import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { PRIORITIES, PRIORITY_COLORS } from "../logic/tasksLogic";

export default function TaskForm({
  formName,
  setFormName,
  formDesc,
  setFormDesc,
  formPriority,
  setFormPriority,
  formSubjectId,
  setFormSubjectId,
  formError,
  setFormError,
  subjects,
}) {
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
            Brak przedmiotów (dodaj na ekranie Przedmioty)
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
