chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type !== "PLAY_SOUND") return;

  const audio = new Audio(msg.url);
  audio.volume = msg.volume ?? 1;

  try {
    await audio.play();
  } catch (e) {
    console.warn("[UCP] Не удалось воспроизвести звук", e);
  }
});