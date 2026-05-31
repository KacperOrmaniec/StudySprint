import {
  validateTaskName,
  createTask,
  editTask,
  deleteTask,
  toggleTaskDone,
  filterAndSortTasks,
  getSubjectName,
} from "../src/logic/tasksLogic";

describe("validateTaskName", () => {
  it("zwraca błąd dla pustej nazwy", () => {
    expect(validateTaskName("")).not.toBe("");
    expect(validateTaskName("   ")).not.toBe("");
  });

  it("nie zwraca błędu dla poprawnej nazwy", () => {
    expect(validateTaskName("Zrobić ćwiczenia")).toBe("");
  });
});

describe("createTask", () => {
  it("tworzy zadanie z poprawnymi polami", () => {
    const task = createTask({
      name: "Test",
      description: "Opis",
      priority: "wysoki",
      subjectId: "s1",
    });
    expect(task.name).toBe("Test");
    expect(task.description).toBe("Opis");
    expect(task.priority).toBe("wysoki");
    expect(task.subjectId).toBe("s1");
    expect(task.done).toBe(false);
    expect(task.id).toBeDefined();
    expect(task.createdAt).toBeDefined();
  });

  it("przycina białe znaki z nazwy i opisu", () => {
    const task = createTask({
      name: "  Test  ",
      description: "  Opis  ",
      priority: "niski",
      subjectId: null,
    });
    expect(task.name).toBe("Test");
    expect(task.description).toBe("Opis");
  });
});

describe("editTask", () => {
  const tasks = [
    {
      id: "1",
      name: "Stara",
      description: "",
      priority: "niski",
      subjectId: null,
      done: false,
      createdAt: 1,
    },
  ];

  it("aktualizuje pola zadania", () => {
    const result = editTask(tasks, "1", {
      name: "Nowa",
      description: "Opis",
      priority: "wysoki",
      subjectId: "s1",
    });
    expect(result[0].name).toBe("Nowa");
    expect(result[0].priority).toBe("wysoki");
  });
});

describe("deleteTask", () => {
  it("usuwa zadanie o podanym id", () => {
    const tasks = [{ id: "1" }, { id: "2" }];
    expect(deleteTask(tasks, "1")).toHaveLength(1);
    expect(deleteTask(tasks, "1")[0].id).toBe("2");
  });
});

describe("toggleTaskDone", () => {
  it("przełącza done z false na true", () => {
    const tasks = [{ id: "1", done: false }];
    expect(toggleTaskDone(tasks, "1")[0].done).toBe(true);
  });

  it("przełącza done z true na false", () => {
    const tasks = [{ id: "1", done: true }];
    expect(toggleTaskDone(tasks, "1")[0].done).toBe(false);
  });
});

describe("filterAndSortTasks", () => {
  const tasks = [
    {
      id: "1",
      subjectId: "s1",
      done: false,
      priority: "wysoki",
      createdAt: 100,
    },
    { id: "2", subjectId: "s2", done: true, priority: "niski", createdAt: 200 },
    {
      id: "3",
      subjectId: "s1",
      done: true,
      priority: "średni",
      createdAt: 300,
    },
  ];

  it("filtruje po przedmiocie", () => {
    const result = filterAndSortTasks(tasks, "s1", "Wszystkie", "data");
    expect(result.every((t) => t.subjectId === "s1")).toBe(true);
  });

  it("filtruje ukończone", () => {
    const result = filterAndSortTasks(tasks, "all", "Ukończone", "data");
    expect(result.every((t) => t.done)).toBe(true);
  });

  it("filtruje aktywne", () => {
    const result = filterAndSortTasks(tasks, "all", "Aktywne", "data");
    expect(result.every((t) => !t.done)).toBe(true);
  });

  it("sortuje po dacie malejąco", () => {
    const result = filterAndSortTasks(tasks, "all", "Wszystkie", "data");
    expect(result[0].createdAt).toBeGreaterThan(result[1].createdAt);
  });

  it("sortuje po priorytecie (wysoki → niski)", () => {
    const result = filterAndSortTasks(tasks, "all", "Wszystkie", "priorytet");
    expect(result[0].priority).toBe("wysoki");
    expect(result[result.length - 1].priority).toBe("niski");
  });
});

describe("getSubjectName", () => {
  const subjects = [{ id: "s1", name: "Matematyka" }];

  it("zwraca nazwę przedmiotu", () => {
    expect(getSubjectName(subjects, "s1")).toBe("Matematyka");
  });

  it("zwraca — dla nieznanego id", () => {
    expect(getSubjectName(subjects, "unknown")).toBe("—");
  });
});
