import {
  formatTime,
  STUDY_SECONDS,
  BREAK_SECONDS,
} from "../src/logic/timerLogic";

describe("stałe czasowe", () => {
  it("sesja nauki trwa 25 minut", () => {
    expect(STUDY_SECONDS).toBe(25 * 60);
  });

  it("przerwa trwa 5 minut", () => {
    expect(BREAK_SECONDS).toBe(5 * 60);
  });
});

describe("formatTime", () => {
  it("formatuje 0 sekund jako 00:00", () => {
    const { minutes, secs } = formatTime(0);
    expect(minutes).toBe("00");
    expect(secs).toBe("00");
  });

  it("formatuje 90 sekund jako 01:30", () => {
    const { minutes, secs } = formatTime(90);
    expect(minutes).toBe("01");
    expect(secs).toBe("30");
  });

  it("formatuje 1500 sekund (25 min) jako 25:00", () => {
    const { minutes, secs } = formatTime(1500);
    expect(minutes).toBe("25");
    expect(secs).toBe("00");
  });

  it("dopełnia zerami jednocyfrowe wartości", () => {
    const { minutes, secs } = formatTime(65);
    expect(minutes).toBe("01");
    expect(secs).toBe("05");
  });
});
