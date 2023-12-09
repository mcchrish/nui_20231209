import { test, expect } from "@playwright/test";

test("next-question", async ({ request }) => {
  const data = {
    answers: [{}],
  };
  const res = await request.post("/next-question", { data });
  expect(res.ok()).toBeTruthy();
  // expect(await res.json()).toEqual(data);
});
