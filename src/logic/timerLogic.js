import { loadData, saveData } from "../utils/storage";

export const STUDY_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export const formatTime = (seconds) => ({
  minutes: String(Math.floor(seconds / 60)).padStart(2, "0"),
  secs: String(seconds % 60).padStart(2, "0"),
});

export const saveSession = async () => {
  const sessions = (await loadData("sessions")) || [];
  const newSession = {
    id: Date.now().toString(),
    duration: 25,
    completedAt: Date.now(),
  };
  await saveData("sessions", [...sessions, newSession]);
};
