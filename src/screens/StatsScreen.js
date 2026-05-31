import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { colors } from "../theme";
import {
  calcTotalSessions,
  calcTotalMinutes,
  calcDoneTasks,
  calcSubjectStats,
} from "../logic/statsLogic";
import ScreenStatus from "../components/ScreenStatus";
import { useAppData } from "../context/AppDataContext";

export default function StatsScreen() {
  // Statystyki liczone z globalnego stanu — aktualizują się natychmiast po
  // zmianie zadań/sesji na innych ekranach (wspólne źródło danych).
  const { sessions, tasks, subjects, loading, error, reload } = useAppData();

  const totalSessions = calcTotalSessions(sessions);
  const totalMinutes = calcTotalMinutes(sessions);
  const doneTasks = calcDoneTasks(tasks);
  const subjectStats = calcSubjectStats(subjects, tasks);

  if (loading) return <ScreenStatus loading />;
  if (error) return <ScreenStatus error onRetry={reload} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statystyki</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardNum}>{totalSessions}</Text>
          <Text style={styles.cardLabel}>Sesje nauki</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNum}>{totalMinutes}</Text>
          <Text style={styles.cardLabel}>Minut nauki</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNum}>{doneTasks}</Text>
          <Text style={styles.cardLabel}>Zadań wykonanych</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Zadania według przedmiotów</Text>

      <FlatList
        data={subjectStats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subjectRow}>
            <Text style={styles.subjectName}>{item.name}</Text>
            <Text style={styles.subjectStat}>
              {item.done} / {item.total}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Brak przedmiotów.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardNum: { fontSize: 28, fontWeight: "bold", color: colors.primary },
  cardLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectName: { flex: 1, fontSize: 15, color: colors.textPrimary },
  subjectStat: { fontSize: 15, fontWeight: "bold", color: colors.primary },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 10 },
});
