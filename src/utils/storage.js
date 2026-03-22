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
    if (json == null) return null;
    return JSON.parse(json);
  } catch (e) {
    console.warn("loadData error:", e);
    return null;
  }
};
