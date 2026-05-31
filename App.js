import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppDataProvider } from "./src/context/AppDataContext";
import ErrorBoundary from "./src/components/ErrorBoundary";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* ErrorBoundary najbardziej na zewnątrz — łapie błędy renderowania także
          z providera stanu i nawigacji, pokazując ekran awaryjny zamiast crasha. */}
      <ErrorBoundary>
        {/* AppDataProvider udostępnia globalny stan (przedmioty/zadania/sesje)
            wszystkim ekranom poniżej. */}
        <AppDataProvider>
          <AppNavigator />
        </AppDataProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
