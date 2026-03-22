import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadData } from "../utils/storage";

export default function StatsScreen() {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const sess = await loadData("sessions");
        const t = await loadData("tasks");
        const s = await loadData("subjects");
        setSessions(sess || []);
        setTasks(t || []);
        setSubjects(s || []);
      }
      load();
    }, [])
  );

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 25), 0);
  const doneTasks = tasks.filter((t) => t.done).length;

  const subjectStats = subjects.map((s) => ({
    id: s.id,
    name: s.name,
    done: tasks.filter((t) => t.subjectId === s.id && t.done).length,
    total: tasks.filter((t) => t.subjectId === s.id).length,
  }));

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
        ListEmptyComponent={
          <Text style={styles.empty}>Brak przedmiotów.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardNum: { fontSize: 28, fontWeight: "bold", color: "#4a90e2" },
  cardLabel: { fontSize: 11, color: "#999", marginTop: 4, textAlign: "center" },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  subjectName: { flex: 1, fontSize: 15, color: "#333" },
  subjectStat: { fontSize: 15, fontWeight: "bold", color: "#4a90e2" },
  empty: { textAlign: "center", color: "#999", marginTop: 10 },
});
