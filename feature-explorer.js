"use strict";
const featureTabs = [...document.querySelectorAll("[data-feature]")];
function selectFeature(button, focus = false) {
  featureTabs.forEach((tab) => {
    const selected = tab === button;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      !selected;
  });
  if (focus) button.focus();
}
featureTabs.forEach((button, index) => {
  button.addEventListener("click", () => selectFeature(button));
  button.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % featureTabs.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + featureTabs.length) % featureTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = featureTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectFeature(featureTabs[next], true);
  });
});
