import cors from "@fastify/cors";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();
await server.register(cors, {});

server.route({
  method: "POST",
  url: "/next-question",
  async handler(request) {
    console.log("answers:", request.body);
    return request.body;
  },
  schema: {
    body: {
      type: "object",
      properties: {
        answers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: "string",
              answer: "string",
            },
          },
        },
      },
      required: ["answers"],
    },
  },
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
