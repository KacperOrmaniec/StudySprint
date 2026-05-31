// Cienki wrapper na AsyncStorage. DLACZEGO osobny moduł: cała aplikacja
// korzysta z jednego, spójnego API zapisu/odczytu (z serializacją JSON
// i obsługą błędów w jednym miejscu), zamiast powtarzać try/catch w ekranach.
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("saveData error:", e);
  }
};

export const loadData = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    // DLACZEGO rozróżniamy null: brak klucza zwraca null, by wołający mógł
    // odróżnić „nic nie zapisano" od pustej tablicy i ustawić wartość domyślną.
    if (json == null) return null;
    return JSON.parse(json);
  } catch (e) {
    // DLACZEGO ponownie rzucamy błąd zamiast zwracać null: ekran musi móc
    // odróżnić „brak danych" od realnej awarii odczytu, żeby pokazać stan
    // błędu z opcją ponowienia (a nie udawać, że jest pusto).
    console.warn("loadData error:", e);
    throw e;
  }
};
