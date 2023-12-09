import cors from "@fastify/cors";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();
await server.register(cors, {});

export function isQuestionData(data: unknown): data is QuestionData {
  return typeof data === "object" && data !== null && "questions" in data;
}

interface Question {
  answers: Record<string, Answer>;
  title: string[];
  title_alt: string[];
}

interface Answer {
  result: string;
  title: string;
  title_alt: string;
}

interface QuestionData {
  questions: Record<string, Question>;
  topics: Record<string, { rule: string; title: Record<string, string> }>;
}

server.route({
  method: "POST",
  url: "/next-question",
  async handler(request) {
    const { answers } = request.body;
    const res = await fetch(
      "https://nui-testchallenge-default-rtdb.europe-west1.firebasedatabase.app/services_backend.json",
    );
    const data = await res.json();

    if (!isQuestionData(data)) {
      throw new Error("Invalid data");
    }

    const questions = Object.entries(data.questions);
    const answeredKeys = answers.map((answer) => answer.key);

    for (const question of questions) {
      if (!answeredKeys.includes(question[0])) {
        return {
          nextQuestion: {
            key: question[0],
            title: question[1].title,
            options: question[1].answers,
          },
        };
      }
    }
    return { services: [] };
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
              answer: { type: "string" },
            },
            required: ["key", "answer"],
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
