import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { PRIORITY_COLORS, getSubjectName } from "../logic/tasksLogic";
import ScreenStatus from "../components/ScreenStatus";
import { useAppData } from "../context/AppDataContext";

/**
 * Ekran szczegółów zadania — drugi typ nawigacji (Stack) zagnieżdżony w zakładce
 * „Zadania". DLACZEGO przez `route.params` (a nie modal): demonstruje przekazanie
 * parametru (`taskId`) między ekranami routera i pełnoekranowy widok z własnym
 * nagłówkiem i przyciskiem wstecz.
 *
 * Dane czyta z globalnego stanu — po zmianie (toggle/usuń) ekran aktualizuje się
 * automatycznie, bo zadanie pochodzi z tej samej kolekcji co lista.
 */
export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, subjects, loading, error, reload, toggleTask, removeTask } =
    useAppData();

  const task = tasks.find((t) => t.id === taskId) || null;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTask(taskId);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    removeTask(taskId);
    // Wracamy do listy — lista czyta ten sam globalny stan, więc jest aktualna.
    navigation.goBack();
  };

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={reload} />;

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
