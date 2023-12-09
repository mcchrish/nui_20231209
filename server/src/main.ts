import cors from "@fastify/cors";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";
import { isQuestionData } from "./is-question-data.js";
import { resolveServices } from "./resolve-services.js";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();
await server.register(cors, {});

server.route({
  method: "POST",
  url: "/next-question",
  async handler(request) {
    const res = await fetch(
      "https://nui-testchallenge-default-rtdb.europe-west1.firebasedatabase.app/services_backend.json",
    );
    const data = await res.json();
    if (!isQuestionData(data)) {
      throw new Error("Invalid data");
    }

    const questions = Object.entries(data.questions);
    const { answers } = request.body;
    const answeredKeys = answers.map((answer) => answer.key);

    // Resolve the next question
    for (const question of questions) {
      if (!answeredKeys.includes(question[0])) {
        return {
          nextQuestion: {
            key: question[0],
            title: question[1].title[0],
            options: Object.entries(question[1].answers).map((answer) => ({
              result: answer[1].result,
              title: answer[1].title,
            })),
          },
        };
      }
    }

    // If no more next question, resolve the services
    return { services: resolveServices(answers, data.topics) };
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
              key: { type: "string" },
              result: { type: "string" },
            },
            required: ["key", "result"],
          },
        },
      },
      required: ["answers"],
    },

    response: {
      200: {
        type: "object",
        properties: {
          nextQuestion: {
            type: "object",
            properties: {
              key: { type: "string" },
              title: { type: "string" },
              options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    result: { type: "string" },
                  },
                },
              },
            },
          },
          services: { type: "array", items: { type: "string" } },
        },
      },
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
