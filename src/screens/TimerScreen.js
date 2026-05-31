import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { colors } from "../theme";
import * as Haptics from "expo-haptics";
import { STUDY_SECONDS, BREAK_SECONDS, formatTime } from "../logic/timerLogic";
import {
  requestNotificationPermission,
  sendLocalNotification,
} from "../utils/notifications";
import { useAppData } from "../context/AppDataContext";

export default function TimerScreen() {
  // Zapis sesji idzie do globalnego stanu (Statystyki/Główna od razu to widzą).
  const { addSession } = useAppData();

  // Stan LOKALNY timera (odliczanie, tryb, działanie) — dotyczy tylko tego ekranu.
  const [seconds, setSeconds] = useState(STUDY_SECONDS);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Zgoda na powiadomienia: pytamy raz przy wejściu na ekran. Jeśli użytkownik
  // odmówi, aplikacja działa dalej (timer + wibracje), a my informujemy go, że
  // powiadomienia po sesji się nie pojawią — czyli OBSŁUGA ODMOWY uprawnień.
  useEffect(() => {
    (async () => {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "Powiadomienia wyłączone",
          "Bez zgody na powiadomienia nie pokażemy alertu po zakończeniu sesji. " +
            "Timer i wibracje działają normalnie. Zgodę możesz włączyć w ustawieniach systemu."
        );
      }
    })();
  }, []);

  // useWindowDimensions reaguje na zmianę rozmiaru/orientacji ekranu w czasie
  // rzeczywistym (inaczej niż Dimensions.get pobierane raz). Dzięki temu zegar
  // skaluje się do urządzenia i nie jest przycinany w orientacji poziomej.
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  // Rozmiar zależny od krótszego boku, ograniczony do bezpiecznego zakresu.
  const timerFontSize = Math.max(
    56,
    Math.min(120, Math.min(width, height) * 0.22)
  );

  // DLACZEGO ref, a nie tylko stan `isBreak`: callback w setInterval domyka się
  // (closure) nad wartościami z momentu uruchomienia interwału. Gdyby
  // handleTimerEnd czytał stan `isBreak`, widziałby przestarzałą wartość.
  // Ref zawsze trzyma aktualną wartość, niezależnie od domknięcia.
  const isBreakRef = useRef(false);
  // DLACZEGO ref na id interwału: utrzymuje go między renderami bez wywoływania
  // ponownego renderowania i pozwala go wyczyścić (clearInterval) z dowolnego miejsca.
  const intervalRef = useRef(null);
  // DLACZEGO ref na handler końca: interwał ma zależeć tylko od `running`, więc
  // wywołuje zawsze NAJNOWSZą wersję handleTimerEnd przez ref — bez restartu
  // odliczania, gdy zmieni się np. akcja addSession z kontekstu.
  const handleTimerEndRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            handleTimerEndRef.current();
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

  const handleTimerEnd = () => {
    // Wibracja sukcesu — natychmiastowy, namacalny sygnał końca odliczania,
    // nawet gdy telefon jest wyciszony lub powiadomienia są odrzucone.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (!isBreakRef.current) {
      addSession();

      // Powiadomienie systemowe (jeśli zgoda) + alert w aplikacji.
      sendLocalNotification(
        "Sesja zakończona! 🎉",
        "Świetna robota! Czas na 5-minutową przerwę."
      );
      Alert.alert("Sesja zakończona! 🎉", "Świetna robota! Czas na przerwę.", [
        { text: "OK" },
      ]);

      isBreakRef.current = true;
      setIsBreak(true);
      setSeconds(BREAK_SECONDS);
    } else {
      sendLocalNotification("Przerwa zakończona!", "Czas wracać do nauki. 📚");
      Alert.alert("Przerwa zakończona!", "Czas wracać do nauki.", [
        { text: "OK" },
      ]);

      isBreakRef.current = false;
      setIsBreak(false);
      setSeconds(STUDY_SECONDS);
    }
  };
  // Trzymamy najnowszą wersję handlera w refie (czytaną przez interwał powyżej).
  handleTimerEndRef.current = handleTimerEnd;

  const toggleRunning = () => {
    // Lekka wibracja jako potwierdzenie dotknięcia Start/Pauza.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRunning((prev) => !prev);
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearInterval(intervalRef.current);
    setRunning(false);
    isBreakRef.current = false;
    setIsBreak(false);
    setSeconds(STUDY_SECONDS);
  };

  const { minutes, secs } = formatTime(seconds);

  return (
    <View style={styles.container}>
      <Text style={styles.modeLabel}>
        {isBreak ? "☕ Przerwa" : "📚 Nauka"}
      </Text>
      <Text
        style={[
          styles.timer,
          { fontSize: timerFontSize, marginBottom: isLandscape ? 20 : 40 },
        ]}
      >
        {minutes}:{secs}
      </Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, running && styles.btnPause]}
          onPress={toggleRunning}
        >
          <Text style={styles.btnText}>{running ? "Pauza" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={reset}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        {isBreak ? "Odpocznij przez 5 minut" : "Skup się przez 25 minut"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 30,
  },
  modeLabel: { fontSize: 22, color: colors.textSecondary, marginBottom: 10 },
  timer: {
    // fontSize i marginBottom ustawiane dynamicznie w komponencie
    // (zależnie od rozmiaru ekranu i orientacji).
    fontWeight: "bold",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  btnRow: { flexDirection: "row", gap: 15, marginBottom: 30 },
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
  },
  btnPause: { backgroundColor: colors.warning },
  btnReset: { backgroundColor: colors.textFaint },
  btnText: { color: colors.white, fontSize: 18, fontWeight: "bold" },
  hint: { fontSize: 14, color: colors.textMuted },
});
