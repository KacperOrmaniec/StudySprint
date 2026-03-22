import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { saveData, loadData } from "../utils/storage";

const PRIORITIES = ["wysoki", "średni", "niski"];
const PRIORITY_COLORS = { wysoki: "#e74c3c", średni: "#f39c12", niski: "#27ae60" };
const STATUS_FILTERS = ["Wszystkie", "Aktywne", "Ukończone"];
const PRIORITY_ORDER = { wysoki: 0, średni: 1, niski: 2 };

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Wszystkie");
  const [sortBy, setSortBy] = useState("data");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState("średni");
  const [formSubjectId, setFormSubjectId] = useState(null);
  const [formError, setFormError] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const t = await loadData("tasks");
        const s = await loadData("subjects");
        setTasks(t || []);
        setSubjects(s || []);
      }
      load();
    }, [])
  );

  const saveTasks = (updated) => {
    setTasks(updated);
    saveData("tasks", updated);
  };

  const openAdd = () => {
    setFormName("");
    setFormDesc("");
    setFormPriority("średni");
    setFormSubjectId(subjects.length > 0 ? subjects[0].id : null);
    setFormError("");
    setAddModal(true);
  };

  const addTask = () => {
    if (!formName.trim()) {
      setFormError("Nazwa zadania nie może być pusta.");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: formName.trim(),
      description: formDesc.trim(),
      priority: formPriority,
      subjectId: formSubjectId,
      done: false,
      createdAt: Date.now(),
    };
    saveTasks([...tasks, newTask]);
    setAddModal(false);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setFormName(task.name);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormSubjectId(task.subjectId);
    setFormError("");
    setEditModal(true);
  };

  const saveEdit = () => {
    if (!formName.trim()) {
      setFormError("Nazwa zadania nie może być pusta.");
      return;
    }
    const updated = tasks.map((t) =>
      t.id === editTask.id
        ? {
            ...t,
            name: formName.trim(),
            description: formDesc.trim(),
            priority: formPriority,
            subjectId: formSubjectId,
          }
        : t
    );
    saveTasks(updated);
    setEditModal(false);
  };

  const deleteTask = (id) => {
    Alert.alert("Usuń zadanie", "Na pewno chcesz usunąć to zadanie?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => saveTasks(tasks.filter((t) => t.id !== id)),
      },
    ]);
  };

  const toggleDone = (id) => {
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const getSubjectName = (id) => {
    const s = subjects.find((s) => s.id === id);
    return s ? s.name : "—";
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (subjectFilter !== "all" && t.subjectId !== subjectFilter) return false;
      if (statusFilter === "Aktywne" && t.done) return false;
      if (statusFilter === "Ukończone" && !t.done) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priorytet") {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      return b.createdAt - a.createdAt;
    });

  const TaskForm = () => (
    <View>
      <Text style={styles.formLabel}>Nazwa *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa zadania..."
        value={formName}
        onChangeText={(t) => {
          setFormName(t);
          setFormError("");
        }}
      />
      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Text style={styles.formLabel}>Opis</Text>
      <TextInput
        style={[styles.input, { height: 70, textAlignVertical: "top" }]}
        placeholder="Krótki opis..."
        value={formDesc}
        onChangeText={setFormDesc}
        multiline
      />

      <Text style={styles.formLabel}>Priorytet</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityBtn,
              formPriority === p && {
                backgroundColor: PRIORITY_COLORS[p],
                borderColor: PRIORITY_COLORS[p],
              },
            ]}
            onPress={() => setFormPriority(p)}
          >
            <Text
              style={[
                styles.priorityBtnText,
                formPriority === p && { color: "#fff" },
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.formLabel}>Przedmiot</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 5 }}
      >
        {subjects.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.chipBtn,
              formSubjectId === s.id && styles.chipBtnActive,
            ]}
            onPress={() => setFormSubjectId(s.id)}
          >
            <Text
              style={[
                styles.chipBtnText,
                formSubjectId === s.id && styles.chipBtnTextActive,
              ]}
            >
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
        {subjects.length === 0 && (
          <Text style={{ color: "#999", paddingVertical: 6 }}>
            Brak przedmiotów (dodaj na ekranie Główna)
          </Text>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Subject filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        <TouchableOpacity
          style={[styles.chipBtn, subjectFilter === "all" && styles.chipBtnActive]}
          onPress={() => setSubjectFilter("all")}
        >
          <Text
            style={[
              styles.chipBtnText,
              subjectFilter === "all" && styles.chipBtnTextActive,
            ]}
          >
            Wszystkie
          </Text>
        </TouchableOpacity>
        {subjects.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.chipBtn,
              subjectFilter === s.id && styles.chipBtnActive,
            ]}
            onPress={() => setSubjectFilter(s.id)}
          >
            <Text
              style={[
                styles.chipBtnText,
                subjectFilter === s.id && styles.chipBtnTextActive,
              ]}
            >
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status filter */}
      <View style={styles.statusRow}>
        {STATUS_FILTERS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.statusBtn,
              statusFilter === s && styles.statusBtnActive,
            ]}
            onPress={() => setStatusFilter(s)}
          >
            <Text
              style={[
                styles.statusBtnText,
                statusFilter === s && styles.statusBtnTextActive,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sortuj: </Text>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === "data" && styles.sortBtnActive]}
          onPress={() => setSortBy("data")}
        >
          <Text
            style={[
              styles.sortBtnText,
              sortBy === "data" && styles.sortBtnTextActive,
            ]}
          >
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortBtn,
            sortBy === "priorytet" && styles.sortBtnActive,
          ]}
          onPress={() => setSortBy("priorytet")}
        >
          <Text
            style={[
              styles.sortBtnText,
              sortBy === "priorytet" && styles.sortBtnTextActive,
            ]}
          >
            Priorytet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.done && styles.taskCardDone]}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleDone(item.id)}
            >
              <Text style={styles.checkboxText}>{item.done ? "✓" : " "}</Text>
            </TouchableOpacity>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskName, item.done && styles.taskNameDone]}>
                {item.name}
              </Text>
              <Text style={styles.taskMeta}>
                {getSubjectName(item.subjectId)} •{" "}
                <Text style={{ color: PRIORITY_COLORS[item.priority] }}>
                  {item.priority}
                </Text>
              </Text>
              {item.description ? (
                <Text style={styles.taskDesc}>{item.description}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconBtn}>
              <Text style={{ fontSize: 18 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak zadań.</Text>
        }
      />

      {/* Floating add button */}
      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Dodaj zadanie</Text>
            <ScrollView>
              <TaskForm />
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addTask}>
                <Text style={styles.saveBtnText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edytuj zadanie</Text>
            <ScrollView>
              <TaskForm />
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  filterRow: { paddingHorizontal: 15, paddingVertical: 10, maxHeight: 55 },
  statusRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 8,
    gap: 6,
  },
  statusBtn: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  statusBtnActive: { backgroundColor: "#4a90e2", borderColor: "#4a90e2" },
  statusBtnText: { color: "#666", fontSize: 13 },
  statusBtnTextActive: { color: "#fff" },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sortLabel: { color: "#666", marginRight: 8 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sortBtnActive: { backgroundColor: "#4a90e2", borderColor: "#4a90e2" },
  sortBtnText: { color: "#666", fontSize: 13 },
  sortBtnTextActive: { color: "#fff" },
  taskCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  taskCardDone: { opacity: 0.55 },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#4a90e2",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },
  checkboxText: { color: "#4a90e2", fontWeight: "bold", fontSize: 16 },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 15, fontWeight: "bold", color: "#333" },
  taskNameDone: { textDecorationLine: "line-through", color: "#aaa" },
  taskMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  taskDesc: { fontSize: 13, color: "#666", marginTop: 3 },
  iconBtn: { padding: 4 },
  empty: { textAlign: "center", color: "#999", marginTop: 40, fontSize: 16 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4a90e2",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { color: "#fff", fontSize: 30, lineHeight: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "88%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  formLabel: { fontSize: 14, color: "#666", marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  error: { color: "#e74c3c", fontSize: 13, marginTop: 3 },
  priorityRow: { flexDirection: "row", gap: 8, marginBottom: 5 },
  priorityBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  priorityBtnText: { color: "#666", fontSize: 13 },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  chipBtnActive: { backgroundColor: "#4a90e2", borderColor: "#4a90e2" },
  chipBtnText: { color: "#666", fontSize: 13 },
  chipBtnTextActive: { color: "#fff" },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 10,
  },
  cancelBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelBtnText: { color: "#666" },
  saveBtn: {
    backgroundColor: "#4a90e2",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
});
