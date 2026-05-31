import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

/**
 * Wspólny widok stanu ekranu: ładowanie (spinner) lub błąd (komunikat + retry).
 * DLACZEGO osobny komponent: te same stany loading/error powtarzają się na
 * wielu ekranach — wydzielenie zapewnia spójny wygląd i jedną implementację.
 *
 * @param {boolean} loading - pokazuje spinner
 * @param {boolean} error - pokazuje komunikat błędu
 * @param {() => void} onRetry - akcja przycisku „Spróbuj ponownie"
 */
export default function ScreenStatus({ loading, error, onRetry }) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Ładowanie…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>
          Nie udało się wczytać danych. Sprawdź urządzenie i spróbuj ponownie.
        </Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryBtnText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f5f5",
  },
  loadingText: { marginTop: 12, color: "#666", fontSize: 15 },
  errorIcon: { fontSize: 40, marginBottom: 10 },
  errorText: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
  retryBtn: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
