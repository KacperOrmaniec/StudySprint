import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { colors } from "../theme";
import { validateSubjectName } from "../logic/subjectsLogic";
import ScreenStatus from "../components/ScreenStatus";
import { useAppData } from "../context/AppDataContext";

export default function SubjectsScreen() {
  // Lista przedmiotów i akcje CRUD pochodzą z globalnego stanu.
  const {
    subjects,
    loading,
    error,
    reload,
    createSubject,
    updateSubject,
    removeSubject,
  } = useAppData();

  // Stan LOKALNY: pola formularzy i widoczność modala — dotyczą tylko tego ekranu.
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editSubjectItem, setEditSubjectItem] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editError, setEditError] = useState("");

  const handleAdd = () => {
    const err = validateSubjectName(input);
    if (err) {
      setInputError(err);
      return;
    }
    createSubject(input);
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
    const err = validateSubjectName(editInput);
    if (err) {
      setEditError(err);
      return;
    }
    updateSubject(editSubjectItem.id, editInput);
    setEditModal(false);
    setEditSubjectItem(null);
  };

  const handleDelete = (id) => {
    removeSubject(id);
  };

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={reload} />;

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
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  addRow: { flexDirection: "row", marginBottom: 5 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.white,
  },
  addBtn: {
    backgroundColor: colors.primary,
    width: 44,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: colors.white, fontSize: 24, lineHeight: 26 },
  error: { color: colors.danger, fontSize: 13, marginBottom: 8 },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectName: { flex: 1, fontSize: 16, color: colors.textPrimary },
  actionBtn: { paddingHorizontal: 8 },
  editText: { color: colors.primary, fontWeight: "bold" },
  deleteText: { color: colors.danger, fontWeight: "bold" },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: 30,
  },
  modalBox: { backgroundColor: colors.white, borderRadius: 12, padding: 20 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textPrimary,
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
