import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";

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
        }),
      },
    },
    // Validação e criação da viagem no banco de dados
    //e envio de email para o proprietário da viagem
    async (request) => {
      const { destination, starts_at, ends_at, owner_name, owner_email } = request.body
      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Invalid trip start date ")
      }

      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new Error("Invalid trip end date ")
      }

      // Criando a viagem e a inclusão do participante  no banco de dados
      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            create: {
              name: owner_name,
              email: owner_email,
              is_owner: true,
              is_confirmed: true,
            }
          }
        }
      })

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
        subject: "Testando envio de e-mail",
        html: `<p> Teste envio de e-mail </p>`,
      });
      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: trip.id };
    }
  );
}
