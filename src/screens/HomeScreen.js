import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { saveData, loadData } from "../utils/storage";

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editError, setEditError] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const s = await loadData("subjects");
        const sess = await loadData("sessions");
        const t = await loadData("tasks");
        setSubjects(s || []);
        setSessions(sess || []);
        setTasks(t || []);
      }
      load();
    }, [])
  );

  const saveSubjects = (updated) => {
    setSubjects(updated);
    saveData("subjects", updated);
  };

  const addSubject = () => {
    if (!input.trim()) {
      setInputError("Nazwa przedmiotu nie może być pusta.");
      return;
    }
    const newSubject = { id: Date.now().toString(), name: input.trim() };
    saveSubjects([...subjects, newSubject]);
    setInput("");
    setInputError("");
  };

  const openEdit = (subject) => {
    setEditSubject(subject);
    setEditInput(subject.name);
    setEditError("");
    setEditModal(true);
  };

  const saveEdit = () => {
    if (!editInput.trim()) {
      setEditError("Nazwa przedmiotu nie może być pusta.");
      return;
    }
    const updated = subjects.map((s) =>
      s.id === editSubject.id ? { ...s, name: editInput.trim() } : s
    );
    saveSubjects(updated);
    setEditModal(false);
    setEditSubject(null);
  };

  const deleteSubject = (id) => {
    Alert.alert("Usuń przedmiot", "Na pewno chcesz usunąć ten przedmiot?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => saveSubjects(subjects.filter((s) => s.id !== id)),
      },
    ]);
  };

  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudySprint</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Sesje</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{doneTasks}</Text>
          <Text style={styles.statLabel}>Zadania</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{subjects.length}</Text>
          <Text style={styles.statLabel}>Przedmioty</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Przedmioty</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Nowy przedmiot..."
          value={input}
          onChangeText={(t) => {
            setInput(t);
            setInputError("");
          }}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addSubject}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      {inputError ? <Text style={styles.error}>{inputError}</Text> : null}

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subjectRow}>
            <Text style={styles.subjectName}>{item.name}</Text>
            <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
              <Text style={styles.editText}>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSubject(item.id)} style={styles.actionBtn}>
              <Text style={styles.deleteText}>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak przedmiotów. Dodaj pierwszy!</Text>
        }
      />

      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edytuj przedmiot</Text>
            <TextInput
              style={styles.input}
              value={editInput}
              onChangeText={(t) => {
                setEditInput(t);
                setEditError("");
              }}
            />
            {editError ? <Text style={styles.error}>{editError}</Text> : null}
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
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statNum: { fontSize: 26, fontWeight: "bold", color: "#4a90e2" },
  statLabel: { fontSize: 12, color: "#999", marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  addRow: { flexDirection: "row", marginBottom: 5 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#4a90e2",
    width: 44,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 24, lineHeight: 26 },
  error: { color: "#e74c3c", fontSize: 13, marginBottom: 8 },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  subjectName: { flex: 1, fontSize: 16, color: "#333" },
  actionBtn: { paddingHorizontal: 8 },
  editText: { color: "#4a90e2", fontWeight: "bold" },
  deleteText: { color: "#e74c3c", fontWeight: "bold" },
  empty: { textAlign: "center", color: "#999", marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 30,
  },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
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
