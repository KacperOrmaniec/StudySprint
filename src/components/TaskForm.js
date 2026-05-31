import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../theme";
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
                formPriority === p && { color: colors.white },
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
          <Text style={{ color: colors.textMuted, paddingVertical: 6 }}>
            Brak przedmiotów (dodaj na ekranie Przedmioty)
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  formLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.white,
  },
  error: { color: colors.danger, fontSize: 13, marginTop: 3 },
  priorityRow: { flexDirection: "row", gap: 8, marginBottom: 5 },
  priorityBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderInput,
    alignItems: "center",
  },
  priorityBtnText: { color: colors.textSecondary, fontSize: 13 },
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
});
