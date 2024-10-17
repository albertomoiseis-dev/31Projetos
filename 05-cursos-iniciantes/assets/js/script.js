(() => {
	handleSwitchThemeEvents();
	handleDefaultTheme();
	handleFooterCurrentYear();

	setTimeout(() => {
		document.body.style.opacity = "1";
	}, 1000);
})();

function handleSwitchThemeEvents() {
	/**
	 * @type {HTMLInputElement | null}
	 */
	const switchTheme = document.getElementById("switch-toggle-theme");

	if (!switchTheme) return;

	switchTheme.addEventListener("change", (event) => toggleTheme(event));
	switchTheme.addEventListener("keydown", (event) => {
		event.stopPropagation();
		const { key, target } = event;
		if (key === "Enter") {
			target.checked = !target.checked;
			toggleTheme(event);
		}
	});
}

/**
 * @param {Event} event
 */
function toggleTheme(event) {
	event.stopPropagation();
	const { target } = event;

	if (target.checked) {
		document.documentElement.classList.remove("dark");
		return;
	}

	document.documentElement.classList.add("dark");
}

function handleDefaultTheme() {
	/**
	 * @type {HTMLInputElement | null}
	 */
	const switchTheme = document.getElementById("switch-toggle-theme");

	if (!switchTheme) return;

	if (isSystemThemeDark()) {
		document.documentElement.classList.add("dark");
		switchTheme.checked = false;
		return;
	}

	document.documentElement.classList.remove("dark");
	switchTheme.checked = true;
}

function isSystemThemeDark() {
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return true;
	}

	return false;
}

function handleFooterCurrentYear() {
	const footerYearElement = document.body.querySelector(".wrapper-footer .footer-year");
	if (footerYearElement) {
		footerYearElement.innerHTML = new Date().getFullYear();
	}
}

const observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		const { type, attributeName, target } = mutation;
		if (!["attributes", "attributeFilter"].includes(type) || attributeName !== "class") return;

		if (target.classList.contains("show")) {
			top.interval = setInterval(createBubble, 1000);
			return;
		}

		clearInterval(top.interval);
	});
});

const bubblesWrapper = document.querySelector(".bubbles-wrapper");
observer.observe(bubblesWrapper, { attributes: true, attributeFilter: ["class"] });

function createBubble() {
	const bubblesWrapper = document.querySelector(".bubbles-wrapper");
	const { width } = bubblesWrapper.getBoundingClientRect();

	const bubbleLeft = Math.floor(Math.random() * (width - 1)) + 1;
	const bubbleBlur = Math.floor(Math.random() * 10) + 2;
	const bubbleWidth = Math.floor(Math.random() * 10) + 5;

	const bubble = document.createElement("span");
	bubble.classList.add("bubble");
	bubble.style.left = bubbleLeft + "px";
	bubble.style.filter = `blur(${bubbleBlur}px)`;
	bubble.style.width = bubbleWidth + "px";

	bubblesWrapper.appendChild(bubble);

	const duration = getComputedStyle(bubble).animationDuration;
	const durationInSecondsRegex = new RegExp(/^\d+s$/);
	let durationToMilliseconds = duration.replaceAll(/\D/g, "");
	if (durationInSecondsRegex.test(duration)) {
		durationToMilliseconds = durationToMilliseconds * 1000;
	}

	setTimeout(() => {
		bubble.remove();
	}, durationToMilliseconds);
}

top.interval = setInterval(createBubble, 500);
