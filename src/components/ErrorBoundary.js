import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../theme";

/**
 * Error Boundary — łapie błędy renderowania w drzewie komponentów poniżej i
 * zamiast „białego ekranu śmierci" pokazuje przyjazny komunikat z możliwością
 * ponowienia.
 *
 * DLACZEGO komponent KLASOWY: React udostępnia mechanizm error boundary tylko
 * przez metody cyklu życia klasy (`getDerivedStateFromError`, `componentDidCatch`)
 * — nie ma odpowiednika w hookach funkcyjnych.
 */
export default class ErrorBoundary extends React.Component {
  state = { hasError: false, message: "" };

  // Wywoływane podczas renderu, gdy potomek rzuci błąd — ustawia stan fallbacku.
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? "Nieznany błąd" };
  }

  // Miejsce na logowanie błędu (np. do zewnętrznego serwisu).
  componentDidCatch(error, info) {
    console.warn("ErrorBoundary złapał błąd:", error, info?.componentStack);
  }

  handleReset = () => {
    // Resetujemy stan, by spróbować ponownie wyrenderować aplikację.
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>😵</Text>
          <Text style={styles.title}>Ups! Coś poszło nie tak.</Text>
          <Text style={styles.message}>
            Wystąpił nieoczekiwany błąd. Spróbuj ponownie — jeśli problem wraca,
            uruchom aplikację jeszcze raz.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: colors.background,
  },
  icon: { fontSize: 56, marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
  },
  buttonText: { color: colors.white, fontWeight: "bold", fontSize: 15 },
});
