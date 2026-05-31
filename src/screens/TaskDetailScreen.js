import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { loadData } from "../utils/storage";
import {
  PRIORITY_COLORS,
  toggleTaskDone,
  deleteTask,
  getSubjectName,
  loadTasks,
  persistTasks,
} from "../logic/tasksLogic";
import ScreenStatus from "../components/ScreenStatus";

/**
 * Ekran szczegółów zadania — drugi typ nawigacji (Stack) zagnieżdżony w zakładce
 * „Zadania". DLACZEGO przez `route.params` (a nie modal): demonstruje przekazanie
 * parametru (`taskId`) między ekranami routera i pełnoekranowy widok z własnym
 * nagłówkiem i przyciskiem wstecz.
 */
export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;

  const [task, setTask] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      const tasks = await loadTasks();
      const subs = (await loadData("subjects")) || [];
      setSubjects(subs);
      setTask(tasks.find((t) => t.id === taskId) || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleToggle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const tasks = await loadTasks();
    const updated = toggleTaskDone(tasks, taskId);
    await persistTasks(updated);
    setTask(updated.find((t) => t.id === taskId) || null);
  };

  const handleDelete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const tasks = await loadTasks();
    await persistTasks(deleteTask(tasks, taskId));
    // Wracamy do listy — odświeży się sama dzięki useFocusEffect.
    navigation.goBack();
  };

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={load} />;

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Nie znaleziono zadania.</Text>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryBtnText}>Wróć do listy</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{task.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[styles.value, { color: task.done ? "#27ae60" : "#f39c12" }]}
          >
            {task.done ? "✓ Ukończone" : "● Aktywne"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Priorytet</Text>
          <Text
            style={[styles.value, { color: PRIORITY_COLORS[task.priority] }]}
          >
            {task.priority}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Przedmiot</Text>
          <Text style={styles.value}>
            {getSubjectName(subjects, task.subjectId)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Utworzono</Text>
          <Text style={styles.value}>
            {new Date(task.createdAt).toLocaleDateString("pl-PL")}
          </Text>
        </View>

        {task.description ? (
          <>
            <Text style={styles.descLabel}>Opis</Text>
            <Text style={styles.desc}>{task.description}</Text>
          </>
        ) : null}
      </View>

      <TouchableOpacity style={styles.toggleBtn} onPress={handleToggle}>
        <Text style={styles.toggleBtnText}>
          {task.done ? "Oznacz jako aktywne" : "Oznacz jako ukończone"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Usuń zadanie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  label: { fontSize: 14, color: "#999" },
  value: { fontSize: 15, color: "#333", fontWeight: "600" },
  descLabel: { fontSize: 14, color: "#999", marginTop: 12, marginBottom: 4 },
  desc: { fontSize: 15, color: "#444", lineHeight: 21 },
  toggleBtn: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  toggleBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteBtn: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  deleteBtnText: { color: "#e74c3c", fontSize: 16, fontWeight: "bold" },
  notFound: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 40 },
  secondaryBtn: { padding: 14, alignItems: "center", marginTop: 12 },
  secondaryBtnText: { color: "#4a90e2", fontWeight: "bold" },
});
