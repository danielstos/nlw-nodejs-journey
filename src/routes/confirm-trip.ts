import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

// Definição do schema de validação para a rota de confirmação da viagem
export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    // Confirmação do participante na viagem no banco de dados
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (trip.is_confirmed) {
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${trip.id}`);
      }
      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      })

      const fomarttedStartDate = dayjs(trip.starts_at).format("LL");
      const fomarttedEndDate = dayjs(trip.ends_at).format("LL");

      // Envio de email para o proprietário da viagem
      const mail = await getMailClient();

      // Enviando email para todos os participantes da viagem (exceto o proprietário)
      await Promise.all(
        trip.participants.map(async (participant) => {
          const confimationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`

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
          })

          console.log(nodemailer.getTestMessageUrl(message))
        })
      );

      return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
    }
  )
}
