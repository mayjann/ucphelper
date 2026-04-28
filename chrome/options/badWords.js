import { showToast } from "./toast.js";

export function initBadWords(storage) {
    const textarea = document.getElementById("badWords");
    const userWords = Array.isArray(storage.userBadWords) ? storage.userBadWords : [];
    const allWords = [...BASE_BAD_WORDS, ...userWords];
	
    textarea.value = [...new Set(allWords)].join(", ");

    document.getElementById("saveBadWordsBtn").addEventListener("click", async () => {
		const words = textarea.value
			.split(",")
			.map(w => w.trim())
			.filter(Boolean);

		const newUserWords = words.filter(
			w => !BASE_BAD_WORDS.includes(w)
		);

		await chrome.storage.sync.set({
			userBadWords: newUserWords
		});

		showToast("Запрещённые слова сохранены");
	});
}