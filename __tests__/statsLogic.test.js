import {
  calcTotalSessions,
  calcTotalMinutes,
  calcDoneTasks,
  calcSubjectStats,
} from "../src/logic/statsLogic";

describe("calcTotalSessions", () => {
  it("zwraca liczbę sesji", () => {
    expect(calcTotalSessions([{}, {}, {}])).toBe(3);
    expect(calcTotalSessions([])).toBe(0);
  });
});

describe("calcTotalMinutes", () => {
  it("sumuje minuty z pola duration", () => {
    expect(calcTotalMinutes([{ duration: 25 }, { duration: 30 }])).toBe(55);
  });

  it("używa 25 jako domyślnego czasu gdy brak duration", () => {
    expect(calcTotalMinutes([{}, {}])).toBe(50);
  });

  it("zwraca 0 dla pustej listy", () => {
    expect(calcTotalMinutes([])).toBe(0);
  });
});

describe("calcDoneTasks", () => {
  const tasks = [{ done: true }, { done: false }, { done: true }];

  it("liczy tylko ukończone zadania", () => {
    expect(calcDoneTasks(tasks)).toBe(2);
    expect(calcDoneTasks([])).toBe(0);
  });
});

describe("calcSubjectStats", () => {
  const subjects = [
    { id: "s1", name: "Matematyka" },
    { id: "s2", name: "Fizyka" },
  ];
  const tasks = [
    { subjectId: "s1", done: true },
    { subjectId: "s1", done: false },
    { subjectId: "s2", done: true },
  ];

  it("liczy zadania per przedmiot", () => {
    const result = calcSubjectStats(subjects, tasks);
    const mat = result.find((r) => r.id === "s1");
    const fiz = result.find((r) => r.id === "s2");
    expect(mat.total).toBe(2);
    expect(mat.done).toBe(1);
    expect(fiz.total).toBe(1);
    expect(fiz.done).toBe(1);
  });
});
