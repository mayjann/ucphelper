import { showToast } from "./toast.js";

export function initTemplates(storage) {
	const toggleStock = document.getElementById("useTemplates");
	const toggleCustom = document.getElementById("useCustomTemplates");

	const stockBlock = document.getElementById("stockBlock");
	const customBlock = document.getElementById("customBlock");

	const addBtn = document.getElementById("addCustomTemplate");
	const list = document.getElementById("customTemplatesList");
	const tpl = document.getElementById("customTemplateItem");
	const reasonSelect = document.getElementById("customTemplateReason");

	const ppTemplateEl = document.getElementById("ppTemplate");
	const PP_LIMIT = 400;

	if (ppTemplateEl) {
		const initValue = storage.ppTemplate ?? DEFAULT_SETTINGS.ppTemplate ?? "";
		ppTemplateEl.value = initValue.slice(0, PP_LIMIT);

		function updateCounter() {
			const len = ppTemplateEl.value.length;
			ppCounter.textContent = `${PP_LIMIT - len}/${PP_LIMIT} символов доступно для ввода`;
		}

		ppTemplateEl.addEventListener("input", () => {
			if (ppTemplateEl.value.length > PP_LIMIT) {
				ppTemplateEl.value = ppTemplateEl.value.slice(0, PP_LIMIT);
			}
			updateCounter();
		});

		ppTemplateEl.addEventListener("paste", (e) => {
			e.preventDefault();

			const text = (e.clipboardData || window.clipboardData).getData("text");

			const allowed = PP_LIMIT - ppTemplateEl.value.length;
			if (allowed <= 0) return;

			ppTemplateEl.value += text.slice(0, allowed);
			updateCounter();
		});

		updateCounter();
	}

	toggleStock.checked = storage.useTemplates ?? DEFAULT_SETTINGS.useTemplates;
	toggleCustom.checked = storage.useCustomTemplates ?? DEFAULT_SETTINGS.useCustomTemplates;

	const templates = storage.templates || DEFAULT_SETTINGS.templates;
	const customTemplates = storage.customTemplates || {};

	function bindNameLimit(input) {
		if (!input) return;

		input.addEventListener("input", () => {
			if (input.value.length > 40) {
				input.value = input.value.slice(0, 40);
			}
		});

		input.addEventListener("paste", (e) => {
			e.preventDefault();

			const text = (e.clipboardData || window.clipboardData)
				.getData("text")
				.slice(0, 40 - input.value.length);

			input.value += text;
		});
	}

	function markError(el) {
		if (!el) return;

		if (el.classList.contains("customTemplateText")) {
			el.classList.add("textarea-error");
		} else {
			el.classList.add("input-error");
		}
	}

	function clearErrorOnInput(el) {
		if (!el) return;
		el.addEventListener("input", () => {
			el.classList.remove("input-error", "textarea-error");
		});
	}

	function updateVisibility() {
		stockBlock.style.display = toggleStock.checked ? "block" : "none";
		customBlock.style.display = toggleCustom.checked ? "block" : "none";
	}

	toggleStock.addEventListener("change", updateVisibility);
	toggleCustom.addEventListener("change", updateVisibility);

	updateVisibility();

	Object.entries(templates).forEach(([key, value]) => {
		const el = document.getElementById(`template_${key}`);
		if (el) el.value = value;
	});

	function getReasonLabel(value) {
		return reasonSelect.querySelector(`option[value="${value}"]`)?.textContent || value;
	}

	Object.entries(customTemplates).forEach(([reason, items]) => {

		const group = document.createElement("div");
		group.className = "customGroup";

		const header = document.createElement("div");
		header.className = "customGroupHeader";

		const title = document.createElement("span");
		title.className = "reasonLabel";
		title.textContent = getReasonLabel(reason);

		header.appendChild(title);

		const body = document.createElement("div");
		body.className = "customGroupBody";

		header.addEventListener("click", () => {
			group.classList.toggle("open");
		});

		group.appendChild(header);
		group.appendChild(body);

		items.forEach(t => {

			const node = tpl.content.cloneNode(true);

			const item = node.querySelector(".customTemplate");
			item.dataset.reason = reason;

			const nameInput = node.querySelector(".customTemplateName");
			const textInput = node.querySelector(".customTemplateText");

			if (nameInput) {
				nameInput.value = t.name || "";
				nameInput.setAttribute("maxlength", "40");
				bindNameLimit(nameInput);
				clearErrorOnInput(nameInput);
			}

			if (textInput) {
				textInput.value = t.text || "";
				clearErrorOnInput(textInput);
			}

			node.querySelector(".removeTemplate").addEventListener("click", (e) => {
				e.target.closest(".customTemplate").remove();
			});

			body.appendChild(node);
		});

		list.appendChild(group);
	});

	addBtn.addEventListener("click", () => {

		const reason = reasonSelect.value;

		let group = [...list.querySelectorAll(".customGroup")]
			.find(g => g.querySelector(".reasonLabel")?.textContent === getReasonLabel(reason));

		if (!group) {

			group = document.createElement("div");
			group.className = "customGroup";

			const header = document.createElement("div");
			header.className = "customGroupHeader";

			const title = document.createElement("span");
			title.className = "reasonLabel";
			title.textContent = getReasonLabel(reason);

			header.appendChild(title);

			const body = document.createElement("div");
			body.className = "customGroupBody";

			header.addEventListener("click", () => {
				group.classList.toggle("open");
			});

			group.appendChild(header);
			group.appendChild(body);

			list.appendChild(group);
		}

		const node = tpl.content.cloneNode(true);

		const item = node.querySelector(".customTemplate");
		item.dataset.reason = reason;

		const nameInput = node.querySelector(".customTemplateName");
		const textInput = node.querySelector(".customTemplateText");

		if (nameInput) {
			nameInput.value = "";
			nameInput.setAttribute("maxlength", "40");
			bindNameLimit(nameInput);
			clearErrorOnInput(nameInput);
		}

		if (textInput) {
			textInput.value = "";
			clearErrorOnInput(textInput);
		}

		node.querySelector(".removeTemplate").addEventListener("click", (e) => {
			e.target.closest(".customTemplate").remove();
		});

		group.querySelector(".customGroupBody").appendChild(node);
	});

	document.getElementById("saveTemplatesBtn").addEventListener("click", async () => {

	const newTemplates = {};
	const newCustomTemplates = {};

	const allowedVars = ["{{ucpLink}}", "{{lk}}"];

	Object.keys(DEFAULT_SETTINGS.templates).forEach(key => {
		const el = document.getElementById(`template_${key}`);
		if (el) newTemplates[key] = el.value.trim();
	});

	const ppTemplateEl = document.getElementById("ppTemplate");
	const ppTemplateValue = (ppTemplateEl?.value || "").trim();

	let hasError = false;

	function validatePpTemplate(text, el) {

		if (!text) {
			showToast("Шаблон проверки новорега не может быть пустым", "error");
			markError(el);
			return false;
		}

		if (text.length > 400) {
			showToast("Шаблон проверки новорега не должен превышать 400 символов", "error");
			markError(el);
			return false;
		}

		const missingVars = allowedVars.filter(v => !text.includes(v));

		if (missingVars.length > 0) {
			showToast("В шаблоне проверки новорега должны быть все переменные", "error");
			markError(el);
			return false;
		}

		return true;
	}

	if (!validatePpTemplate(ppTemplateValue, ppTemplateEl)) {
		hasError = true;
	}

	document.querySelectorAll(".customGroup").forEach(group => {
			const reason = group.querySelector(".reasonLabel")?.textContent;
			const key = [...reasonSelect.options]
				.find(o => o.textContent === reason)?.value;

			if (!key) return;

			const validItems = [];

			group.querySelectorAll(".customTemplate").forEach(el => {

				const nameEl = el.querySelector(".customTemplateName");
				const textEl = el.querySelector(".customTemplateText");

				const name = (nameEl?.value || "").trim();
				const text = (textEl?.value || "").trim();

				if (!name && !text) return;

				if (!name && text) {
					hasError = true;
					showToast("Необходимо указать название шаблона", "error");
					markError(nameEl);
					return;
				}

				if (name && !text) {
					hasError = true;
					showToast("Необходимо указать текст шаблона", "error");
					markError(textEl);
					return;
				}

				if (text.length > 150) {
					hasError = true;
					showToast("Шаблон не должен превышать 150 символов", "error");
					markError(textEl);
					return;
				}

				validItems.push({
					name: name.slice(0, 40),
					text
				});
			});

			if (validItems.length === 0) return;

			newCustomTemplates[key] = validItems;
		});

		if (hasError) return;

		await browser.storage.sync.set({
			templates: newTemplates,
			customTemplates: newCustomTemplates,
			ppTemplate: ppTemplateValue,
			useTemplates: toggleStock.checked,
			useCustomTemplates: toggleCustom.checked
		});

		showToast("Шаблоны сохранены", "success");
	});
}