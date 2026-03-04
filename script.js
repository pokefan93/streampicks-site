const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const formMessage = document.getElementById("form-message");
const yearEl = document.getElementById("year");

// auto year so i dont gotta remember to update footer every jan lol
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");

// simple scroll reveal, just enough motion so it doesnt feel stiff
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((section) => revealObserver.observe(section));

document.querySelectorAll(".js-scroll").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (!targetEl) {
      return;
    }

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// quick email check so ppl dont submit random junk
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

if (waitlistForm && emailInput && formMessage) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      formMessage.textContent = "Enter a valid email address to join the waitlist.";
      formMessage.classList.remove("success");
      formMessage.classList.add("error");
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    emailInput.setAttribute("aria-invalid", "false");
    formMessage.textContent = "You are on the list. We will send launch updates soon.";
    formMessage.classList.remove("error");
    formMessage.classList.add("success");

    // backend hookup goes here later when we wire teh real waitlist api
    // fetch("https://your-api.example.com/waitlist", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email })
    // })

    waitlistForm.reset();
  });
}
