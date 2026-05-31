import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { loadData, saveData } from "../utils/storage";
import {
  addSubject,
  editSubject,
  deleteSubject,
  persistSubjects,
} from "../logic/subjectsLogic";
import {
  createTask,
  editTask,
  deleteTask,
  toggleTaskDone,
  persistTasks,
} from "../logic/tasksLogic";

/**
 * Globalny stan aplikacji (Context API).
 *
 * DLACZEGO Context API, a nie Redux/Zustand: dane są płaskie (3 kolekcje),
 * operacje proste (CRUD), a aplikacja niewielka — Context bez dodatkowych
 * zależności w zupełności wystarcza i jest częścią React.
 *
 * CO jest stanem GLOBALNYM (tutaj): przedmioty, zadania, sesje — współdzielone
 * między ekranami (Zadania, Przedmioty, Timer, Statystyki, Szczegóły) i trwałe
 * w AsyncStorage. Jedno źródło prawdy = brak przeładowań przy każdym focusie.
 *
 * CO zostaje stanem LOKALNYM (w ekranach): widoczność modali, pola formularzy,
 * wybrane filtry/sortowanie, stan timera — dotyczą jednego ekranu i nie muszą
 * być współdzielone.
 */
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Jednorazowy odczyt z AsyncStorage przy starcie. DLACZEGO raz, a nie przy
  // każdym wejściu na ekran: stan żyje w providerze, więc po wczytaniu wszystkie
  // ekrany czytają tę samą, aktualną kopię w pamięci.
  const reload = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      const [s, t, sess] = await Promise.all([
        loadData("subjects"),
        loadData("tasks"),
        loadData("sessions"),
      ]);
      setSubjects(s || []);
      setTasks(t || []);
      setSessions(sess || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // --- Przedmioty ---
  const createSubject = useCallback(
    (name) => {
      const updated = addSubject(subjects, name);
      setSubjects(updated);
      persistSubjects(updated);
    },
    [subjects]
  );

  const updateSubject = useCallback(
    (id, name) => {
      const updated = editSubject(subjects, id, name);
      setSubjects(updated);
      persistSubjects(updated);
    },
    [subjects]
  );

  const removeSubject = useCallback(
    (id) => {
      const updated = deleteSubject(subjects, id);
      setSubjects(updated);
      persistSubjects(updated);
    },
    [subjects]
  );

  // --- Zadania ---
  const addTask = useCallback(
    (payload) => {
      const updated = [...tasks, createTask(payload)];
      setTasks(updated);
      persistTasks(updated);
    },
    [tasks]
  );

  const updateTask = useCallback(
    (id, payload) => {
      const updated = editTask(tasks, id, payload);
      setTasks(updated);
      persistTasks(updated);
    },
    [tasks]
  );

  const removeTask = useCallback(
    (id) => {
      const updated = deleteTask(tasks, id);
      setTasks(updated);
      persistTasks(updated);
    },
    [tasks]
  );

  const toggleTask = useCallback(
    (id) => {
      const updated = toggleTaskDone(tasks, id);
      setTasks(updated);
      persistTasks(updated);
    },
    [tasks]
  );

  // --- Sesje (timer) ---
  const addSession = useCallback(() => {
    const newSession = {
      id: Date.now().toString(),
      duration: 25,
      completedAt: Date.now(),
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    saveData("sessions", updated);
  }, [sessions]);

  // useMemo, by referencja `value` zmieniała się tylko przy realnej zmianie
  // danych/akcji — ogranicza zbędne re-rendery konsumentów kontekstu.
  const value = useMemo(
    () => ({
      subjects,
      tasks,
      sessions,
      loading,
      error,
      reload,
      createSubject,
      updateSubject,
      removeSubject,
      addTask,
      updateTask,
      removeTask,
      toggleTask,
      addSession,
    }),
    [
      subjects,
      tasks,
      sessions,
      loading,
      error,
      reload,
      createSubject,
      updateSubject,
      removeSubject,
      addTask,
      updateTask,
      removeTask,
      toggleTask,
      addSession,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

/**
 * Hook dostępu do globalnego stanu. Rzuca błąd, gdy użyty poza providerem —
 * dzięki temu pomyłka w drzewie komponentów ujawnia się od razu.
 */
export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData musi być użyty wewnątrz <AppDataProvider>");
  }
  return ctx;
}
