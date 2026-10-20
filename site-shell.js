"use strict";
const sharedMenu = document.querySelector(".marketing-header .mobile-menu");
if (sharedMenu) {
  sharedMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      sharedMenu.open = false;
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sharedMenu.open) {
      sharedMenu.open = false;
      sharedMenu.querySelector("summary").focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (sharedMenu.open && !sharedMenu.contains(event.target))
      sharedMenu.open = false;
  });
  window
    .matchMedia("(min-width:1051px)")
    .addEventListener("change", (event) => {
      if (event.matches) sharedMenu.open = false;
    });
}
