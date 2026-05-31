import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadData } from "../utils/storage";
import { loadSubjects } from "../logic/subjectsLogic";

export default function HomeScreen() {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const s = await loadSubjects();
        const sess = await loadData("sessions");
        const t = await loadData("tasks");
        setSubjects(s);
        setSessions(sess || []);
        setTasks(t || []);
      }
      load();
    }, [])
  );

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
});
