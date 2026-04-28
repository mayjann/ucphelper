function initStatusLogger() {
	const radios = document.querySelectorAll('input[name="status"]');
	const reasonInput = document.querySelector('input[name="reason"]');

	if (!radios.length || !reasonInput) return;

	radios.forEach(radio => {
		radio.addEventListener("change", () => {

			if (radio.value === "1" && radio.checked) {
				if (reasonInput.value.trim() !== "") {
					reasonInput.value = "";
				}
			}

		});
	});
}