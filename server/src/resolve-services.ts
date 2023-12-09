import { Service } from "./types.js";

interface Answer {
  key: string;
  result: string;
}

/**
 * Given a set of answers, resolve an array of services based on their rules
 */
export function resolveServices(
  answers: Answer[],
  topics: Record<string, Service>,
): string[] {
  return Object.entries(topics).flatMap(([key, service]) => {
    if (parseRule(answers, service.rule)) {
      return [key];
    }
    return [];
  });
}

/**
 * Parse a rule string then resolve if the answers passes the rule.
 */
function parseRule(answers: Answer[], rules: string): boolean {
  // Array.some can be interpreted as "OR"
  return rules.split("||").some((ors) => {
    // Array.every can be interpreted as "AND"
    return ors.split("-").every((and) => {
      const [key, _value] = and.split("(");
      const value = _value.substring(0, _value.length - 1);
      const answer = answers.find((answer) => answer.key === key);
      if (!answer) return false;
      if (value.startsWith("<")) {
        const num = Number(value.split("<")[1]);
        return Number(answer.result) < num;
      } else if (value.startsWith(">")) {
        const num = Number(value.split(">")[1]);
        return Number(answer.result) > num;
      }
      return answer.result === value;
    });
  });
}
