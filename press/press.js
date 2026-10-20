"use strict";
const filters = [...document.querySelectorAll("[data-filter]")];
const screenshots = [...document.querySelectorAll("[data-category]")];
filters.forEach((button) =>
  button.addEventListener("click", () => {
    filters.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    screenshots.forEach((shot) => {
      shot.hidden =
        button.dataset.filter !== "all" &&
        shot.dataset.category !== button.dataset.filter;
    });
    const count = screenshots.filter((shot) => !shot.hidden).length;
    document.getElementById("screenshot-results").textContent =
      `${count} screenshot${count === 1 ? "" : "s"} shown`;
  }),
);
const dialog = document.getElementById("media-dialog");
document.querySelectorAll("[data-preview]").forEach((button) =>
  button.addEventListener("click", () => {
    const image = document.getElementById("media-image");
    image.src = button.dataset.preview;
    image.alt = button.querySelector("img").alt;
    document.getElementById("media-title").textContent = button.dataset.title;
    document.getElementById("media-download").href = button.dataset.preview;
    dialog.showModal();
  }),
);
document
  .getElementById("media-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    dialog.close();
});
document.querySelectorAll("[data-copy]").forEach((button) =>
  button.addEventListener("click", async () => {
    const node = document.getElementById(button.dataset.copy);
    try {
      await navigator.clipboard.writeText(node.innerText.trim());
      button.textContent = "Copied ✓";
      document.getElementById("copy-status").textContent =
        "Description copied to clipboard.";
      window.setTimeout(() => {
        button.textContent = "Copy description";
      }, 2400);
    } catch {
      button.textContent = "Select the description to copy";
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.getElementById("copy-status").textContent =
        "Description selected. Use your device’s copy command.";
    }
  }),
);
