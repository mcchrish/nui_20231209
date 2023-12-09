import { Service } from "./types.js";

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
  topics: Record<string, Service>;
}
