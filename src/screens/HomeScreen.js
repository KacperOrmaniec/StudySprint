import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme";
import ScreenStatus from "../components/ScreenStatus";
import { useAppData } from "../context/AppDataContext";

export default function HomeScreen() {
  // Dane czytamy z globalnego stanu — bez przeładowań z AsyncStorage.
  const { subjects, sessions, tasks, loading, error, reload } = useAppData();

  const doneTasks = tasks.filter((t) => t.done).length;

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={reload} />;

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
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
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNum: { fontSize: 26, fontWeight: "bold", color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
