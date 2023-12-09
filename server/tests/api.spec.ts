import { test, expect } from "@playwright/test";

test("first request", async ({ request }) => {
  const data = {
    answers: [],
  };
  const res = await request.post("/next-question", { data });
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toEqual({
    nextQuestion: {
      key: "Arbeit",
      title:
        "Nun noch ein paar Fragen zu Dir und Deiner Situation. Wie groß ist das Unternehmen, in dem Du arbeitest?",
      options: [
        {
          result: "0",
          title: "Ich arbeite momentan nicht/nicht mehr",
        },
        {
          result: "14",
          title: "Es hat weniger als 15 Mitarbeiter",
        },
        {
          result: "25",
          title: "Es hat zwischen 15 und 25 Mitarbeitern",
        },
        {
          result: "26",
          title: "Es hat mehr als 25 Mitarbeiter",
        },
      ],
    },
  });
});

test("first question answered", async ({ request }) => {
  const data = {
    answers: [
      {
        key: "Arbeit",
        result: "0",
      },
    ],
  };
  const res = await request.post("/next-question", { data });
  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toEqual({
    nextQuestion: {
      key: "Bayern",
      title: "In welchem Bundesland lebt {SENIOR}?",
      options: [
        {
          result: "BW",
          title: "Baden-Württemberg",
        },
        {
          result: "BY",
          title: "Bayern",
        },
        {
          result: "BE",
          title: "Berlin",
        },
        {
          result: "BB",
          title: "Brandenburg",
        },
        {
          result: "HB",
          title: "Bremen",
        },
        {
          result: "HH",
          title: "Hamburg",
        },
        {
          result: "HE",
          title: "Hessen",
        },
        {
          result: "MV",
          title: "Mecklenburg-Vorpommern",
        },
        {
          result: "NI",
          title: "Niedersachsen",
        },
        {
          result: "NW",
          title: "Nordrhein-Westfalen",
        },
        {
          result: "RP",
          title: "Rheinland-Pfalz",
        },
        {
          result: "SL",
          title: "Saarland",
        },
        {
          result: "SN",
          title: "Sachsen",
        },
        {
          result: "ST",
          title: "Sachsen-Anhalt",
        },
        {
          result: "SH",
          title: "Schleswig-Holstein",
        },
        {
          result: "TH",
          title: "Thüringen",
        },
      ],
    },
  });
});
