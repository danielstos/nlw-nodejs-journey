import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

// convidar um novo participantes
export async function createInvite(app: FastifyInstance) {
  // Definição do schema de validação para a rota de criação de convite
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },

    // Criar um convite para um novo participante
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      // Verificar se o email já está cadastrado na viagem
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      // cadastrado  um novo participante da viagem
      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });
     
      const fomarttedStartDate = dayjs(trip.starts_at).format("LL");
      const fomarttedEndDate = dayjs(trip.ends_at).format("LL");

      
      // Envio de email para o proprietário da viagem
      const mail = await getMailClient();
      // Estrutura do email com o link para confirmar a viagem
      const confimationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

      // Enviando email para o novo participante
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er",
        },
        to: participant.email,

        subject: `Confirmação de presença na viagem para ${trip.destination} em ${fomarttedStartDate}`,
        html: `
            <div style="font-family:sans-serif; font-size:16px; line-height: 1.6;">
              <p></p>
                Você foi convidado(a) para participar de uma viagem para  <strong>${trip.destination} </strong>
              nas datas de <strong> ${fomarttedStartDate} </strong> até <strong> ${fomarttedEndDate} </strong> .
              </p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
            <p></p>
              <p><a href="${confimationLink}">Confirmar Viagem</a></p>
              <p></p>
              <p>
                Caso você não saiba do que se trata esse e-mail ou não poderá estar
                presente, apenas ignore esse e-mail.
              </p>
            </div>        
        `.trim(),
      });

      
      // Logando o URL do email para testes
      console.log(nodemailer.getTestMessageUrl(message));

      // Retornando o ID do novo participante
      return { participantId: participant.id};
    }
  );
}
