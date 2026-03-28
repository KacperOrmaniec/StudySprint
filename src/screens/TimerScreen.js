import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { STUDY_SECONDS, BREAK_SECONDS, formatTime, saveSession } from "../logic/timerLogic";

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(STUDY_SECONDS);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const isBreakRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleTimerEnd = async () => {
    if (!isBreakRef.current) {
      await saveSession();

      Alert.alert(
        "Sesja zakończona! 🎉",
        "Świetna robota! Czas na przerwę.",
        [{ text: "OK" }]
      );

      isBreakRef.current = true;
      setIsBreak(true);
      setSeconds(BREAK_SECONDS);
    } else {
      Alert.alert("Przerwa zakończona!", "Czas wracać do nauki.", [
        { text: "OK" },
      ]);

      isBreakRef.current = false;
      setIsBreak(false);
      setSeconds(STUDY_SECONDS);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    isBreakRef.current = false;
    setIsBreak(false);
    setSeconds(STUDY_SECONDS);
  };

  const { minutes, secs } = formatTime(seconds);

  return (
    <View style={styles.container}>
      <Text style={styles.modeLabel}>{isBreak ? "☕ Przerwa" : "📚 Nauka"}</Text>
      <Text style={styles.timer}>
        {minutes}:{secs}
      </Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, running && styles.btnPause]}
          onPress={() => setRunning(!running)}
        >
          <Text style={styles.btnText}>{running ? "Pauza" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={reset}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        {isBreak
          ? "Odpocznij przez 5 minut"
          : "Skup się przez 25 minut"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  modeLabel: { fontSize: 22, color: "#555", marginBottom: 10 },
  timer: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    fontVariant: ["tabular-nums"],
  },
  btnRow: { flexDirection: "row", gap: 15, marginBottom: 30 },
  btn: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
  },
  btnPause: { backgroundColor: "#f39c12" },
  btnReset: { backgroundColor: "#aaa" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  hint: { fontSize: 14, color: "#999" },
});
