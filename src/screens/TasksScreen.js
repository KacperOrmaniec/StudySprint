import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import {
  PRIORITY_COLORS,
  STATUS_FILTERS,
  validateTaskName,
  filterAndSortTasks,
  getSubjectName,
} from "../logic/tasksLogic";
import TaskForm from "../components/TaskForm";
import ScreenStatus from "../components/ScreenStatus";
import { useAppData } from "../context/AppDataContext";

/**
 * Pojedynczy wiersz listy zadań. DLACZEGO `React.memo`: przy długiej liście i
 * zmianie stanu LOKALNEGO ekranu (np. wpisywanie w formularzu, zmiana filtra)
 * niezmienione wiersze nie renderują się ponownie — porównanie propsów odcina
 * zbędne re-rendery. Działa, bo `subjectName` to string, a callbacki są
 * stabilizowane przez `useCallback` w rodzicu.
 */
const TaskRow = React.memo(function TaskRow({
  item,
  subjectName,
  onToggle,
  onPress,
  onEdit,
  onDelete,
}) {
  return (
    <View style={[styles.taskCard, item.done && styles.taskCardDone]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(item.id)}
      >
        <Text style={styles.checkboxText}>{item.done ? "✓" : " "}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.taskInfo}
        onPress={() => onPress(item.id)}
      >
        <Text style={[styles.taskName, item.done && styles.taskNameDone]}>
          {item.name}
        </Text>
        <Text style={styles.taskMeta}>
          {subjectName} •{" "}
          <Text style={{ color: PRIORITY_COLORS[item.priority] }}>
            {item.priority}
          </Text>
        </Text>
        {item.description ? (
          <Text style={styles.taskDesc}>{item.description}</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconBtn}>
        <Text style={{ fontSize: 18 }}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.iconBtn}
      >
        <Text style={{ fontSize: 18 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function TasksScreen() {
  const navigation = useNavigation();

  // Dane i akcje CRUD z globalnego stanu (jedno źródło prawdy).
  const {
    tasks,
    subjects,
    loading,
    error,
    reload,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
  } = useAppData();

  // Stan LOKALNY: filtry, sortowanie, modale i pola formularza — tylko ten ekran.
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

  const openAdd = () => {
    setFormName("");
    setFormDesc("");
    setFormPriority("średni");
    setFormSubjectId(subjects.length > 0 ? subjects[0].id : null);
    setFormError("");
    setAddModal(true);
  };

  const handleAdd = () => {
    const err = validateTaskName(formName);
    if (err) {
      setFormError(err);
      return;
    }
    addTask({
      name: formName,
      description: formDesc,
      priority: formPriority,
      subjectId: formSubjectId,
    });
    setAddModal(false);
  };

  // useCallback, by referencje handlerów były stabilne między renderami —
  // dzięki temu zmemoizowane wiersze (TaskRow) nie renderują się bez potrzeby.
  const openEdit = useCallback((task) => {
    setEditTaskItem(task);
    setFormName(task.name);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormSubjectId(task.subjectId);
    setFormError("");
    setEditModal(true);
  }, []);

  const handleSaveEdit = () => {
    const err = validateTaskName(formName);
    if (err) {
      setFormError(err);
      return;
    }
    updateTask(editTaskItem.id, {
      name: formName,
      description: formDesc,
      priority: formPriority,
      subjectId: formSubjectId,
    });
    setEditModal(false);
  };

  const handleDelete = useCallback(
    (id) => {
      // Wibracja ostrzegawcza przy usuwaniu — wyraźniejszy sygnał akcji niszczącej.
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      removeTask(id);
    },
    [removeTask]
  );

  const handleToggleDone = useCallback(
    (id) => {
      // Lekka wibracja potwierdzająca zaznaczenie/odznaczenie zadania.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleTask(id);
    },
    [toggleTask]
  );

  const openDetail = useCallback(
    (id) => navigation.navigate("TaskDetail", { taskId: id }),
    [navigation]
  );

  // useMemo: filtrowanie i sortowanie przeliczamy tylko gdy zmienią się zadania
  // lub kryteria — a nie przy każdym renderze (np. po wpisaniu znaku w formularzu).
  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, subjectFilter, statusFilter, sortBy),
    [tasks, subjectFilter, statusFilter, sortBy]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TaskRow
        item={item}
        subjectName={getSubjectName(subjects, item.subjectId)}
        onToggle={handleToggleDone}
        onPress={openDetail}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    ),
    [subjects, handleToggleDone, openDetail, openEdit, handleDelete]
  );

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={reload} />;

  return (
    <View style={styles.container}>
      {/* Subject filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        <TouchableOpacity
          style={[
            styles.chipBtn,
            subjectFilter === "all" && styles.chipBtnActive,
          ]}
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
        renderItem={renderItem}
        // Optymalizacje długiej listy: ograniczają liczbę jednocześnie
        // renderowanych i utrzymywanych w pamięci wierszy.
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews
        ListEmptyComponent={<Text style={styles.empty}>Brak zadań.</Text>}
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
  container: { flex: 1, backgroundColor: colors.background },
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
    borderColor: colors.borderInput,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  statusBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusBtnText: { color: colors.textSecondary, fontSize: 13 },
  statusBtnTextActive: { color: colors.white },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sortLabel: { color: colors.textSecondary, marginRight: 8 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.borderInput,
    marginRight: 8,
    backgroundColor: colors.white,
  },
  sortBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortBtnText: { color: colors.textSecondary, fontSize: 13 },
  sortBtnTextActive: { color: colors.white },
  taskCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskCardDone: { opacity: 0.55 },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },
  checkboxText: { color: colors.primary, fontWeight: "bold", fontSize: 16 },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 15, fontWeight: "bold", color: colors.textPrimary },
  taskNameDone: { textDecorationLine: "line-through", color: colors.textFaint },
  taskMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  taskDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  iconBtn: { padding: 4 },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { color: colors.white, fontSize: 30, lineHeight: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    maxHeight: "88%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderInput,
    marginRight: 8,
    backgroundColor: colors.white,
  },
  chipBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipBtnText: { color: colors.textSecondary, fontSize: 13 },
  chipBtnTextActive: { color: colors.white },
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
    borderColor: colors.borderInput,
  },
  cancelBtnText: { color: colors.textSecondary },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveBtnText: { color: colors.white, fontWeight: "bold" },
});
