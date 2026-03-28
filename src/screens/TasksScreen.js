import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadData } from "../utils/storage";
import {
  PRIORITIES,
  PRIORITY_COLORS,
  STATUS_FILTERS,
  validateTaskName,
  createTask,
  editTask,
  deleteTask,
  toggleTaskDone,
  filterAndSortTasks,
  getSubjectName,
  loadTasks,
  persistTasks,
} from "../logic/tasksLogic";

function TaskForm({ formName, setFormName, formDesc, setFormDesc, formPriority, setFormPriority, formSubjectId, setFormSubjectId, formError, setFormError, subjects }) {
  return (
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
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Wszystkie");
  const [sortBy, setSortBy] = useState("data");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editTaskItem, setEditTaskItem] = useState(null);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState("średni");
  const [formSubjectId, setFormSubjectId] = useState(null);
  const [formError, setFormError] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const t = await loadTasks();
        const s = await loadData("subjects");
        setTasks(t);
        setSubjects(s || []);
      }
      load();
    }, [])
  );

  const updateTasks = (updated) => {
    setTasks(updated);
    persistTasks(updated);
  };

  const openAdd = () => {
    setFormName("");
    setFormDesc("");
    setFormPriority("średni");
    setFormSubjectId(subjects.length > 0 ? subjects[0].id : null);
    setFormError("");
    setAddModal(true);
  };

  const handleAdd = () => {
    const error = validateTaskName(formName);
    if (error) {
      setFormError(error);
      return;
    }
    updateTasks([...tasks, createTask({ name: formName, description: formDesc, priority: formPriority, subjectId: formSubjectId })]);
    setAddModal(false);
  };

  const openEdit = (task) => {
    setEditTaskItem(task);
    setFormName(task.name);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormSubjectId(task.subjectId);
    setFormError("");
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    const error = validateTaskName(formName);
    if (error) {
      setFormError(error);
      return;
    }
    updateTasks(editTask(tasks, editTaskItem.id, { name: formName, description: formDesc, priority: formPriority, subjectId: formSubjectId }));
    setEditModal(false);
  };

  const handleDelete = (id) => {
    updateTasks(deleteTask(tasks, id));
  };

  const handleToggleDone = (id) => {
    updateTasks(toggleTaskDone(tasks, id));
  };

  const filteredTasks = filterAndSortTasks(tasks, subjectFilter, statusFilter, sortBy);

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
              onPress={() => handleToggleDone(item.id)}
            >
              <Text style={styles.checkboxText}>{item.done ? "✓" : " "}</Text>
            </TouchableOpacity>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskName, item.done && styles.taskNameDone]}>
                {item.name}
              </Text>
              <Text style={styles.taskMeta}>
                {getSubjectName(subjects, item.subjectId)} •{" "}
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
              onPress={() => handleDelete(item.id)}
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
              <TaskForm
                formName={formName}
                setFormName={setFormName}
                formDesc={formDesc}
                setFormDesc={setFormDesc}
                formPriority={formPriority}
                setFormPriority={setFormPriority}
                formSubjectId={formSubjectId}
                setFormSubjectId={setFormSubjectId}
                formError={formError}
                setFormError={setFormError}
                subjects={subjects}
              />
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
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
              <TaskForm
                formName={formName}
                setFormName={setFormName}
                formDesc={formDesc}
                setFormDesc={setFormDesc}
                formPriority={formPriority}
                setFormPriority={setFormPriority}
                formSubjectId={formSubjectId}
                setFormSubjectId={setFormSubjectId}
                formError={formError}
                setFormError={setFormError}
                subjects={subjects}
              />
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
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
