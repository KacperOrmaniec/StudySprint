import { saveData, loadData } from "../utils/storage";

export const PRIORITIES = ["wysoki", "średni", "niski"];
export const PRIORITY_COLORS = { wysoki: "#e74c3c", średni: "#f39c12", niski: "#27ae60" };
export const STATUS_FILTERS = ["Wszystkie", "Aktywne", "Ukończone"];
export const PRIORITY_ORDER = { wysoki: 0, średni: 1, niski: 2 };

export const validateTaskName = (name) => {
  if (!name.trim()) return "Nazwa zadania nie może być pusta.";
  return "";
};

export const createTask = ({ name, description, priority, subjectId }) => ({
  id: Date.now().toString(),
  name: name.trim(),
  description: description.trim(),
  priority,
  subjectId,
  done: false,
  createdAt: Date.now(),
});

export const editTask = (tasks, id, { name, description, priority, subjectId }) =>
  tasks.map((t) =>
    t.id === id
      ? { ...t, name: name.trim(), description: description.trim(), priority, subjectId }
      : t
  );

export const deleteTask = (tasks, id) => tasks.filter((t) => t.id !== id);

export const toggleTaskDone = (tasks, id) =>
  tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));

export const filterAndSortTasks = (tasks, subjectFilter, statusFilter, sortBy) =>
  tasks
    .filter((t) => {
      if (subjectFilter !== "all" && t.subjectId !== subjectFilter) return false;
      if (statusFilter === "Aktywne" && t.done) return false;
      if (statusFilter === "Ukończone" && !t.done) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priorytet") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return b.createdAt - a.createdAt;
    });

export const getSubjectName = (subjects, id) => {
  const s = subjects.find((s) => s.id === id);
  return s ? s.name : "—";
};

export const loadTasks = async () => (await loadData("tasks")) || [];

export const persistTasks = async (tasks) => {
  await saveData("tasks", tasks);
};
