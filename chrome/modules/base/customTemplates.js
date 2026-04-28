function CustomTemplateWatcher() {
	let customSelectEl = null;
	let warningEl = null;

	function createSelect(templates, useTemplates) {
		const wrapper = document.createElement("div");
		wrapper.className = useTemplates ? "form-group col-md-6" : "form-group col-md-4";
		wrapper.style.paddingLeft = "0";
		wrapper.id = "customTemplateSelectWrapper";

		const row = document.createElement("div");
		row.style.display = "flex";
		row.style.gap = "8px";
		row.style.alignItems = "center";

		const label = document.createElement("label");
		label.textContent = "Пользовательские шаблоны";
		label.style.display = "block";
		label.style.marginBottom = "6px";

		const select = document.createElement("select");
		select.className = "form-control";
		select.id = "customTemplateSelect";
		select.style.flex = "1";

		const defaultOpt = document.createElement("option");
		defaultOpt.disabled = true;
		defaultOpt.selected = true;
		defaultOpt.textContent = "Выберите шаблон";
		select.appendChild(defaultOpt);

		templates.forEach((t, i) => {
			const opt = document.createElement("option");
			opt.value = i;
			opt.textContent = t.name || `Шаблон ${i + 1}`;
			opt.dataset.text = t.text || "";
			select.appendChild(opt);
		});

		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "btn btn-primary";
		btn.textContent = "Вернуть стандартный";
		btn.style.whiteSpace = "nowrap";
		btn.disabled = true;
		btn.style.display = "none";

		(async () => {
			const storage = await chrome.storage.sync.get(["useTemplates"]);
			if (storage.useTemplates) {
				btn.style.display = "inline-block";
			}
		})();

		btn.addEventListener("click", async () => {
			const storage = await chrome.storage.sync.get(["templates"]);
			const defaultTemplates = storage.templates || {};

			const reasonInput = document.querySelector('input[name="reason"]');
			if (!reasonInput) return;

			const currentSelect = document.getElementById("inputState");
			if (!currentSelect) return;

			const reason = currentSelect.value;

			const defaultText = defaultTemplates?.[reason];
			if (!defaultText) return;

			reasonInput.value = defaultText;
			reasonInput.dispatchEvent(new Event("input", { bubbles: true }));

			select.selectedIndex = 0;
			btn.disabled = true;
		});

		select.addEventListener("change", (e) => {
			const opt = e.target.selectedOptions[0];
			if (!opt) return;

			const text = opt.dataset.text || "";

			const input = document.querySelector('input[name="reason"]');
			if (!input) return;

			input.value = text;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			btn.disabled = select.selectedIndex === 0;
		});

		row.appendChild(select);
		row.appendChild(btn);

		wrapper.appendChild(label);
		wrapper.appendChild(row);

		return wrapper;
	}

	function createWarning() {

		const div = document.createElement("div");
		div.className = "form-group col-md-12";
		div.style.paddingLeft = "0";
		div.id = "customTemplateWarning";

		div.innerHTML = `
			<label style="color: #f90101;">
				Использование пользовательских шаблонов включено, но для выбранной причины отклонения не найдено ни одного шаблона
			</label>
		`;

		return div;
	}

	async function update(reason) {
		const storage = await chrome.storage.sync.get(["useCustomTemplates", "customTemplates", "useTemplates"]);

		if (!storage.useCustomTemplates) return;

		document.getElementById("customTemplateSelectWrapper")?.remove();
		document.getElementById("customTemplateWarning")?.remove();

		customSelectEl = null;
		warningEl = null;

		const templates = storage.customTemplates?.[reason] || [];
		const useTemplates = storage.useTemplates ?? false;

		const selectContainer = document.getElementById("inputState")?.closest(".form-group");
		if (!selectContainer) return;

		document.getElementById("customTemplateSelectWrapper")?.remove();
		document.getElementById("customTemplateWarning")?.remove();

		if (templates.length > 0) {
			customSelectEl = createSelect(templates, useTemplates);
			selectContainer.insertAdjacentElement("afterend", customSelectEl);
		} else {
			warningEl = createWarning();
			selectContainer.insertAdjacentElement("afterend", warningEl);
		}
	}

	const select = document.getElementById("inputState");
	if (!select) return;

	select.addEventListener("change", (e) => {
		update(e.target.value);
	});
}