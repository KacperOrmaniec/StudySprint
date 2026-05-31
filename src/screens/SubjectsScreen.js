import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  validateSubjectName,
  addSubject,
  editSubject,
  deleteSubject,
  loadSubjects,
  persistSubjects,
} from "../logic/subjectsLogic";
import ScreenStatus from "../components/ScreenStatus";

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editSubjectItem, setEditSubjectItem] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editError, setEditError] = useState("");

  // DLACZEGO useFocusEffect: lista przedmiotów może zostać zmieniona pośrednio
  // (np. po powrocie z innego ekranu) — przeładowujemy ją przy każdym wejściu.
  const load = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);
      const s = await loadSubjects();
      setSubjects(s);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const updateSubjects = (updated) => {
    setSubjects(updated);
    persistSubjects(updated);
  };

  const handleAdd = () => {
    const error = validateSubjectName(input);
    if (error) {
      setInputError(error);
      return;
    }
    updateSubjects(addSubject(subjects, input));
    setInput("");
    setInputError("");
  };

  const openEdit = (subject) => {
    setEditSubjectItem(subject);
    setEditInput(subject.name);
    setEditError("");
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    const error = validateSubjectName(editInput);
    if (error) {
      setEditError(error);
      return;
    }
    updateSubjects(editSubject(subjects, editSubjectItem.id, editInput));
    setEditModal(false);
    setEditSubjectItem(null);
  };

  const handleDelete = (id) => {
    updateSubjects(deleteSubject(subjects, id));
  };

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={load} />;

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
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
            <TouchableOpacity
              onPress={() => openEdit(item)}
              style={styles.actionBtn}
            >
              <Text style={styles.editText}>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionBtn}
            >
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
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
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
