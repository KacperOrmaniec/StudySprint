import { saveData, loadData } from "../utils/storage";

export const validateSubjectName = (name) => {
  if (!name.trim()) return "Nazwa przedmiotu nie może być pusta.";
  return "";
};

export const addSubject = (subjects, name) => {
  const newSubject = { id: Date.now().toString(), name: name.trim() };
  return [...subjects, newSubject];
};

export const editSubject = (subjects, id, name) => {
  return subjects.map((s) => (s.id === id ? { ...s, name: name.trim() } : s));
};

export const deleteSubject = (subjects, id) => {
  return subjects.filter((s) => s.id !== id);
};

export const loadSubjects = async () => {
  return (await loadData("subjects")) || [];
};

export const persistSubjects = async (subjects) => {
  await saveData("subjects", subjects);
};
