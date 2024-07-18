import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";

type FastifyErrorHandler = (error: any, request: FastifyRequest, reply: FastifyReply) => void;

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
 // console.log("Error:", error);

  if (error instanceof ZodError) {  
    return reply.status(400).send({
      message: "Invalid input",
     error: error.flatten().fieldErrors
    });
  }

  if (error instanceof ClientError) {
    console.error("Client error:", error.message);
    return reply.status(400).send({ message: error.message });
  }

  console.error("Internal server error:", error);
  return reply.status(500).send({ message: "Internal server error" });
};
