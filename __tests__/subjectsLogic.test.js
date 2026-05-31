import {
  validateSubjectName,
  addSubject,
  editSubject,
  deleteSubject,
} from "../src/logic/subjectsLogic";

describe("validateSubjectName", () => {
  it("zwraca błąd dla pustej nazwy", () => {
    expect(validateSubjectName("")).not.toBe("");
    expect(validateSubjectName("   ")).not.toBe("");
  });

  it("nie zwraca błędu dla poprawnej nazwy", () => {
    expect(validateSubjectName("Matematyka")).toBe("");
  });
});

describe("addSubject", () => {
  it("dodaje przedmiot do listy", () => {
    const result = addSubject([], "Fizyka");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Fizyka");
    expect(result[0].id).toBeDefined();
  });

  it("przycina białe znaki z nazwy", () => {
    const result = addSubject([], "  Chemia  ");
    expect(result[0].name).toBe("Chemia");
  });

  it("nie modyfikuje oryginalnej tablicy", () => {
    const original = [{ id: "1", name: "Biologia" }];
    addSubject(original, "Fizyka");
    expect(original).toHaveLength(1);
  });
});

describe("editSubject", () => {
  const subjects = [
    { id: "1", name: "Matematyka" },
    { id: "2", name: "Fizyka" },
  ];

  it("zmienia nazwę przedmiotu o podanym id", () => {
    const result = editSubject(subjects, "1", "Algebra");
    expect(result.find((s) => s.id === "1").name).toBe("Algebra");
    expect(result.find((s) => s.id === "2").name).toBe("Fizyka");
  });

  it("nie modyfikuje oryginalnej tablicy", () => {
    editSubject(subjects, "1", "Algebra");
    expect(subjects[0].name).toBe("Matematyka");
  });
});

describe("deleteSubject", () => {
  it("usuwa przedmiot o podanym id", () => {
    const subjects = [
      { id: "1", name: "A" },
      { id: "2", name: "B" },
    ];
    const result = deleteSubject(subjects, "1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
});
