import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/pt-br"
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";


dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

// Definição do schema de validação para a rota de criação de viagem
export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    // Validação e criação da viagem no banco de dados
    //e envio de email para o proprietário da viagem
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;
      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Invalid trip start date ");
      }

      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new Error("Invalid trip end date ");
      }

      // Criando a viagem e a inclusão do participante  no banco de dados
      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const fomarttedStartDate = dayjs(starts_at).format('LL')
      const fomarttedEndDate = dayjs(ends_at).format('LL')

      const confimationLink = `http://localhost3333/trips/${trip.id}/confirm`

      // Envio de email para o proprietário da viagem
      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirme sua Viagem para ${destination} em ${fomarttedStartDate}`,
        html: `
        <div style="font-family:sans-serif; font-size:16px; line-height: 1.6;">
          <p></p>
            Você foi convidado(a) para participar de uma viagem para <strong>${destination} </strong>
          nas datas de <strong> ${fomarttedStartDate} </strong> até <strong> ${fomarttedEndDate} </strong>  .
          </p>
          <p></p>
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
      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: trip.id };
    }
  );
}
