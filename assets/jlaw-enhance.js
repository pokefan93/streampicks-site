"use strict";

(function initJlawEnhancements() {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const VALID_MODES = new Set(["classic", "upgraded"]);
  const VALID_LANGS = new Set(["en", "es"]);
  const STORAGE_KEYS = {
    mode: "jlaw-mode",
    lang: "jlaw-lang",
    transition: "jlaw-transition",
  };

  const CONTROL_COPY = {
    en: {
      preview: "Preview",
      mode: "Mode",
      classic: "Classic",
      upgraded: "Upgraded",
      language: "Language",
      english: "English",
      spanish: "Español",
      call: "Call",
      directions: "Directions",
      menu: "Menu",
    },
    es: {
      preview: "Vista",
      mode: "Modo",
      classic: "Clásico",
      upgraded: "Mejorado",
      language: "Idioma",
      english: "Inglés",
      spanish: "Español",
      call: "Llamar",
      directions: "Ruta",
      menu: "Menú",
    },
  };

  const TRANSLATIONS = {
    "Skip to Content": "Saltar al contenido",
    Home: "Inicio",
    About: "Acerca de",
    Services: "Servicios",
    Press: "Prensa",
    Contact: "Contacto",
    "free consultation": "consulta gratuita",
    "Open Menu": "Abrir menú",
    "Close Menu": "Cerrar menú",
    "Law, The Jernigan Way.": "La ley, al estilo Jernigan.",
    "who is j.law?": "¿quién es j.law?",
    "x 1 Attorney at Law": "x 1 Abogada",
    "x 3 Children": "x 3 hijos",
    "x 4 Years Best of the Best Attorney": "x 4 años como mejor abogada de las mejores",
    "x 12 Years of Marriage": "x 12 años de matrimonio",
    "x 14 Years of Practice": "x 14 años de práctica",
    "Lady Boss x Lady Justice": "Jefa x Justicia",
    "“I’m a sweet southern woman, but when it comes to my work, I seek justice and I get it.”":
      "“Soy una mujer sureña dulce, pero cuando se trata de mi trabajo, busco justicia y la consigo.”",
    "– Carrie Jernigan": "– Carrie Jernigan",
    "WHAT ARE": "¿QUÉ ESTÁ",
    "THE PEOPLE SAYING?": "DICIENDO LA GENTE?",
    "When we hired Mrs. Jernigan, we got more than just a lawyer; We got a guide to help us through the court system; an interpreter to translate the legal documents and language, and an advocate who understood what our case meant to our family and who fought to defend our rights. We received more than just legal council, we received highly professional and personalized service!":
      "Cuando contratamos a la Sra. Jernigan, obtuvimos más que una abogada; obtuvimos una guía para ayudarnos a atravesar el sistema judicial, una intérprete para traducir los documentos y el lenguaje legal, y una defensora que entendía lo que nuestro caso significaba para nuestra familia y que luchó por defender nuestros derechos. Recibimos más que asesoría legal: recibimos un servicio sumamente profesional y personalizado.",
    "— Susie, Van Buren": "— Susie, Van Buren",
    "The Woman Behind the Brand": "La mujer detrás de la marca",
    "Carrie Jernigan": "Carrie Jernigan",
    "Personal Background": "Trayectoria personal",
    "Born and raised in Alma, AR": "Nació y creció en Alma, AR",
    "Lives in Alma, AR": "Vive en Alma, AR",
    "Enjoys spending time with her husband, Shawn, two daughters, Harper and Campbell, and son, Amos":
      "Disfruta pasar tiempo con su esposo, Shawn, sus dos hijas, Harper y Campbell, y su hijo, Amos",
    "Avid bow hunter; shot professionally for Martin Archery":
      "Apasionada de la caza con arco; compitió profesionalmente para Martin Archery",
    "Academic + Professional Background": "Formación académica y profesional",
    "Alma High School, 2000": "Alma High School, 2000",
    "University of Arkansas, B.A. Computer Science, 2004":
      "Universidad de Arkansas, Licenciatura en Ciencias de la Computación, 2004",
    "University of Arkansas Law School [Juris Doctor], 2006":
      "Facultad de Derecho de la Universidad de Arkansas [Juris Doctor], 2006",
    "Licensed attorney in Arkansas": "Abogada con licencia en Arkansas",
    "Professional + Civil Affiliations": "Afiliaciones profesionales y cívicas",
    "Crawford County Bar Association": "Colegio de Abogados del Condado de Crawford",
    "Sebastian County Bar Association": "Colegio de Abogados del Condado de Sebastian",
    "Arkansas Bar Association": "Colegio de Abogados de Arkansas",
    "National Rifle Association": "Asociación Nacional del Rifle",
    Rotary: "Rotary",
    "“I believe that my clients’ success depends on my commitment to solving their problems. As your attorney, you can expect me to listen to you, fight for your best interest, and always give you my undivided attention. I will not only strive for the best possible outcome for your circumstance, but provide the legal representation you expect and deserve.”":
      "“Creo que el éxito de mis clientes depende de mi compromiso para resolver sus problemas. Como su abogada, puede esperar que la escuche, que luche por su mejor interés y que siempre le brinde toda mi atención. No solo buscaré el mejor resultado posible para su situación, sino también la representación legal que usted espera y merece.”",
    "– CARRIE JERNIGAN": "– CARRIE JERNIGAN",
    "Meet My Associate Attorney": "Conozca a mi abogada asociada",
    "Rebecca D. Brannon": "Rebecca D. Brannon",
    "My name is Rebecca D. Brannon, and I am a licensed attorney in Arkansas. I am a member of the Arkansas Bar Association, Crawford County Bar Association, and Sebastian County Bar Association. I grew up on the Arkansas-Oklahoma state line in Gans, Oklahoma. After I graduated at Gans High School, I received an English degree from Arkansas Tech University. I always knew that I wanted to be an attorney, and I was able to fulfill that dream when I got accepted into the William H. Bowen School of Law at Little Rock. Since I began the practice of law, I have enjoyed nothing more than helping each of my clients get through difficult times. I mainly focus on helping clients through family and criminal law cases, but I have also helped clients with a wide-variety of other issues. I am committed to helping each of my clients solve their problems, and I will strive for the best legal representation that each of my clients deserve.":
      "Mi nombre es Rebecca D. Brannon y soy una abogada con licencia en Arkansas. Soy miembro del Colegio de Abogados de Arkansas, del Colegio de Abogados del Condado de Crawford y del Colegio de Abogados del Condado de Sebastian. Crecí en la línea estatal entre Arkansas y Oklahoma, en Gans, Oklahoma. Después de graduarme de Gans High School, obtuve una licenciatura en inglés en Arkansas Tech University. Siempre supe que quería ser abogada, y pude cumplir ese sueño cuando fui aceptada en la William H. Bowen School of Law en Little Rock. Desde que comencé a ejercer el derecho, no he disfrutado nada más que ayudar a cada uno de mis clientes a atravesar momentos difíciles. Me enfoco principalmente en ayudar a los clientes en casos de derecho de familia y derecho penal, pero también he ayudado a clientes con una amplia variedad de otros asuntos. Estoy comprometida a ayudar a cada uno de mis clientes a resolver sus problemas y me esforzaré por brindar la mejor representación legal que cada uno merece.",
    "get in touch": "contáctenos",
    "AREAS OF PRACTICE": "ÁREAS DE PRÁCTICA",
    "Personal Injury": "Lesiones personales",
    "Auto + Truck Accidents": "Accidentes automovilísticos y de camión",
    "Motorcycle Accidents": "Accidentes de motocicleta",
    "Wrongful Death": "Muerte por negligencia",
    "Slip + Fall Accidents": "Accidentes por resbalones y caídas",
    "Criminal Law": "Derecho penal",
    "All Criminal Cases": "Todo tipo de casos penales",
    Drugs: "Delitos de drogas",
    "Driving While Intoxicated": "Conducción en estado de ebriedad",
    "Domestic Disputes": "Conflictos domésticos",
    "Theft/Burglary": "Robo/hurto",
    "Felonies + All Misdemeanors": "Delitos graves y todos los delitos menores",
    "Federal + State": "Federal y estatal",
    Murder: "Homicidio",
    "Fraud/Identity Theft": "Fraude/robo de identidad",
    "Family Law": "Derecho de familia",
    Custody: "Custodia",
    Divorce: "Divorcio",
    Paternity: "Paternidad",
    Adoption: "Adopción",
    Guardianships: "Tutelas",
    "work with us": "trabaje con nosotros",
    "Drop a line.": "Escríbanos.",
    "(office)": "(oficina)",
    "479.474.0753 (fax)": "479.474.0753 (fax)",
    TikTok: "TikTok",
    "Over 178K followers • 2M+ views": "Más de 178 mil seguidores • más de 2 M de visualizaciones",
    "see more": "ver más",
    "The Payless Shoe Mom": "La mamá de Payless",
    "1 trip to the mall • 1,500 pairs of shoes": "1 viaje al centro comercial • 1,500 pares de zapatos",
    "Carrie and her daughter, Harper, took a trip to Payless as they were going out of business and ended up purchasing 1,500 shoes to donate to a local middle school.":
      "Carrie y su hija, Harper, hicieron un viaje a Payless cuando la tienda estaba por cerrar y terminaron comprando 1,500 zapatos para donarlos a una escuela secundaria local.",
    Instagram: "Instagram",
    "3,500+ followers • 1 husband • 3 children": "Más de 3,500 seguidores • 1 esposo • 3 hijos",
    "See more": "Ver más",
  };

  const state = {
    mode: VALID_MODES.has(root.dataset.jlawMode) ? root.dataset.jlawMode : "classic",
    lang: VALID_LANGS.has(root.dataset.jlawLang) ? root.dataset.jlawLang : "en",
  };

  const restorableElements = [];
  const originalMarkup = new WeakMap();
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const parallaxTargets = [];
  let sectionObserver = null;

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getPageName() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/home") {
      return "home";
    }
    return path.replace(/^\//, "") || "home";
  }

  function persistState() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.mode, state.mode);
      window.localStorage.setItem(STORAGE_KEYS.lang, state.lang);
    } catch (error) {
      return;
    }
  }

  function setRootState() {
    root.dataset.jlawMode = state.mode;
    root.dataset.jlawLang = state.lang;
    root.lang = state.lang === "es" ? "es" : "en";
    body.dataset.jlawPage = getPageName();
  }

  function rememberMarkup(element) {
    if (!element || originalMarkup.has(element)) {
      return;
    }

    originalMarkup.set(element, element.innerHTML);
    restorableElements.push(element);
  }

  function restoreMarkup() {
    restorableElements.forEach((element) => {
      if (!element || !element.isConnected || !originalMarkup.has(element)) {
        return;
      }

      element.innerHTML = originalMarkup.get(element);
    });
  }

  function getMeaningfulSections() {
    return Array.from(document.querySelectorAll('[data-type="page-section"], .fluid-engine')).filter((section) => {
      if (section.closest("#header") || section.closest(".header-menu")) {
        return false;
      }

      const text = normalizeText(section.textContent);
      return text.length > 0 || Boolean(section.querySelector("img, iframe, video"));
    });
  }

  function annotateSections() {
    const sections = getMeaningfulSections();
    const page = getPageName();

    sections.forEach((section, index) => {
      section.classList.add("jlaw-section");
      section.dataset.jlawSection = String(index);
      section.style.setProperty("--jlaw-reveal-delay", `${Math.min(index * 70, 280)}ms`);
    });

    const footer = sections.find((section) => normalizeText(section.textContent).includes("Jernigan Law Group ©"));
    if (footer) {
      footer.classList.add("jlaw-footer-section");
    }

    if (page === "home") {
      sections[0]?.classList.add("jlaw-hero-section");
      sections[1]?.classList.add("jlaw-home-stats");
      sections[2]?.classList.add("jlaw-home-quote");
      sections[3]?.classList.add("jlaw-home-testimonial");
    }

    if (page === "about") {
      sections[0]?.classList.add("jlaw-about-intro");
      sections[1]?.classList.add("jlaw-about-quote");
      sections[2]?.classList.add("jlaw-associate-section");
    }

    if (page === "services") {
      sections[0]?.classList.add("jlaw-services-intro");
      sections[1]?.classList.add("jlaw-services-section");
    }

    if (page === "contact") {
      sections[0]?.classList.add("jlaw-contact-stage");
    }

    if (page === "press") {
      sections[0]?.classList.add("jlaw-press-section");
      sections[1]?.classList.add("jlaw-press-section");
      sections[2]?.classList.add("jlaw-press-section");
    }
  }

  function splitLines(element) {
    return (element?.innerText || "")
      .split(/\n+/)
      .map((line) => normalizeText(line))
      .filter(Boolean);
  }

  function splitPills(line) {
    return normalizeText(line)
      .split(/\s*•\s*/)
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  function findTextContainers(predicate) {
    return Array.from(document.querySelectorAll(".sqs-html-content")).filter(predicate);
  }

  function enhanceHomeStats() {
    const container = findTextContainers(
      (element) =>
        normalizeText(element.textContent).includes("1 Attorney at Law") &&
        normalizeText(element.textContent).includes("14 Years of Practice")
    )[0];

    if (!container) {
      return;
    }

    const lines = splitLines(container);
    if (!lines.length) {
      return;
    }

    rememberMarkup(container);
    container.innerHTML = `<div class="jlaw-stat-list">${lines
      .map((line) => `<span class="jlaw-stat-pill">${escapeHtml(line)}</span>`)
      .join("")}</div>`;
  }

  function enhanceServices() {
    const titles = new Set(["Personal Injury", "Criminal Law", "Family Law"]);
    const containers = findTextContainers((element) => titles.has(normalizeText(element.querySelector("p")?.textContent)));

    containers.forEach((container) => {
      const paragraphs = Array.from(container.querySelectorAll("p"));
      const title = normalizeText(paragraphs[0]?.textContent);
      const items = splitLines(paragraphs[1]);

      if (!title || !items.length) {
        return;
      }

      rememberMarkup(container);
      container.innerHTML = `
        <article class="jlaw-service-card">
          <p class="jlaw-service-card__title">${escapeHtml(title)}</p>
          <ul class="jlaw-service-card__list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `;
    });
  }

  function enhancePressCards() {
    const titles = new Set(["TikTok", "The Payless Shoe Mom", "Instagram"]);
    const containers = findTextContainers((element) => titles.has(normalizeText(element.querySelector("p")?.textContent)));

    containers.forEach((container) => {
      const paragraphs = Array.from(container.querySelectorAll("p"));
      const title = normalizeText(paragraphs[0]?.textContent);
      const metaLine = normalizeText(paragraphs[1]?.textContent);
      const copy = paragraphs
        .slice(2)
        .map((paragraph) => normalizeText(paragraph.textContent))
        .filter(Boolean)
        .join(" ");

      rememberMarkup(container);
      container.innerHTML = `
        <article class="jlaw-press-card">
          <p class="jlaw-press-card__title">${escapeHtml(title)}</p>
          ${
            metaLine
              ? `<div class="jlaw-pill-row">${splitPills(metaLine)
                  .map((item) => `<span class="jlaw-pill">${escapeHtml(item)}</span>`)
                  .join("")}</div>`
              : ""
          }
          ${copy ? `<p class="jlaw-press-card__body">${escapeHtml(copy)}</p>` : ""}
        </article>
      `;
    });
  }

  function applyUpgradedMarkup() {
    enhanceHomeStats();
    enhanceServices();
    enhancePressCards();
  }

  function collectParallaxTargets() {
    parallaxTargets.length = 0;

    if (state.mode !== "upgraded") {
      return;
    }

    const candidates = Array.from(
      document.querySelectorAll(
        [
          ".jlaw-associate-section .image-block img",
          ".jlaw-press-section .image-block img",
          ".jlaw-contact-stage .image-block img",
          ".jlaw-footer-section .image-block img",
          ".jlaw-press-section .sqs-video-wrapper",
        ].join(",")
      )
    );

    const seenFrames = new Set();

    candidates.forEach((target) => {
      if (target.closest(".header-title-logo")) {
        return;
      }

      const frame =
        target.classList.contains("sqs-video-wrapper") ||
        target.classList.contains("fe-image") ||
        target.classList.contains("sqs-image-shape-container-element")
          ? target
          : target.closest(".sqs-block-content, .fe-block, .sqs-video-wrapper") || target.parentElement;

      if (!frame || seenFrames.has(frame)) {
        return;
      }

      seenFrames.add(frame);
      frame.classList.add("jlaw-parallax-frame");

      if (target !== frame) {
        target.classList.add("jlaw-parallax-target");
      } else {
        frame.classList.add("jlaw-parallax-target");
      }

      parallaxTargets.push(target !== frame ? target : frame);
    });
  }

  function updateScrollProgress() {
    const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--jlaw-scroll-progress", progress.toFixed(4));
    body.classList.toggle("jlaw-is-scrolled", window.scrollY > 18);
  }

  function updateParallax() {
    if (state.mode !== "upgraded") {
      parallaxTargets.forEach((target) => target.style.removeProperty("--jlaw-parallax-shift"));
      return;
    }

    parallaxTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (!visible) {
        target.style.setProperty("--jlaw-parallax-shift", "0px");
        return;
      }

      const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-18, Math.min(18, distance * -0.035));
      target.style.setProperty("--jlaw-parallax-shift", `${shift.toFixed(2)}px`);
    });
  }

  function updateFloatingLayout() {
    const controls = document.querySelector(".jlaw-controls");
    if (!controls) {
      return;
    }

    const controlsHeight = Math.ceil(controls.getBoundingClientRect().height);
    root.style.setProperty("--jlaw-controls-stack-height", `${controlsHeight}px`);
  }

  function initRevealObserver() {
    if (sectionObserver) {
      sectionObserver.disconnect();
      sectionObserver = null;
    }

    const sections = Array.from(document.querySelectorAll(".jlaw-section"));

    if (state.mode !== "upgraded" || reduceMotion) {
      sections.forEach((section) => section.classList.add("jlaw-in-view"));
      return;
    }

    sections.forEach((section, index) => {
      if (index === 0 || section.classList.contains("jlaw-footer-section")) {
        section.classList.add("jlaw-in-view");
      } else {
        section.classList.remove("jlaw-in-view");
      }
    });

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("jlaw-in-view");
          }
        });
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.14,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  function refreshTranslatables() {
    const textNodes = [];
    const attributeEntries = [];
    const skipSelectors = [".jlaw-controls", ".jlaw-mobile-dock", ".jlaw-transition"];
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (skipSelectors.some((selector) => parent.closest(selector))) {
          return NodeFilter.FILTER_REJECT;
        }

        return normalizeText(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) {
        originalText.set(node, node.textContent);
      }

      const key = normalizeText(originalText.get(node));
      if (TRANSLATIONS[key]) {
        textNodes.push({ node, key });
      }
    }

    document.querySelectorAll("[aria-label],[title],[placeholder]").forEach((element) => {
      if (skipSelectors.some((selector) => element.closest(selector))) {
        return;
      }

      if (!originalAttributes.has(element)) {
        originalAttributes.set(element, {});
      }

      ["aria-label", "title", "placeholder"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) {
          return;
        }

        const originals = originalAttributes.get(element);
        if (!originals[attribute]) {
          originals[attribute] = element.getAttribute(attribute);
        }

        const key = normalizeText(originals[attribute]);
        if (TRANSLATIONS[key]) {
          attributeEntries.push({ element, attribute, key, original: originals[attribute] });
        }
      });
    });

    return { textNodes, attributeEntries };
  }

  function applyLanguage() {
    setRootState();
    const { textNodes, attributeEntries } = refreshTranslatables();

    textNodes.forEach(({ node, key }) => {
      node.textContent = state.lang === "es" ? TRANSLATIONS[key] : originalText.get(node);
    });

    attributeEntries.forEach(({ element, attribute, key, original }) => {
      element.setAttribute(attribute, state.lang === "es" ? TRANSLATIONS[key] : original);
    });

    updateControls();
    updateMobileDock();
    updateFloatingLayout();
  }

  function buildProgressBar() {
    if (document.querySelector(".jlaw-progress")) {
      return;
    }

    const progress = document.createElement("div");
    progress.className = "jlaw-progress";
    progress.setAttribute("aria-hidden", "true");

    const bar = document.createElement("span");
    bar.className = "jlaw-progress__bar";
    progress.appendChild(bar);
    body.appendChild(progress);
  }

  function buildTransitionOverlay() {
    if (document.querySelector(".jlaw-transition")) {
      return;
    }

    const transition = document.createElement("div");
    transition.className = "jlaw-transition";
    transition.setAttribute("aria-hidden", "true");

    const liveLogo = document.querySelector(
      'img[alt="J.LAW"], img[alt="JLaw"], img[src*="J.LAW_White"], img[src*="JLAW_White"]'
    );

    if (liveLogo) {
      const logo = liveLogo.cloneNode(true);
      logo.className = "jlaw-transition__logo";
      logo.removeAttribute("sizes");
      logo.removeAttribute("srcset");
      transition.appendChild(logo);
    }

    body.appendChild(transition);
  }

  function buildControls() {
    if (document.querySelector(".jlaw-controls")) {
      return;
    }

    const controls = document.createElement("aside");
    controls.className = "jlaw-controls";
    controls.setAttribute("aria-label", "Preview controls");
    controls.innerHTML = `
      <div class="jlaw-controls__eyebrow" data-jlaw-copy="preview"></div>
      <div class="jlaw-controls__group">
        <span class="jlaw-controls__label" data-jlaw-copy="mode"></span>
        <div class="jlaw-segmented" role="group" aria-label="Preview mode">
          <button type="button" class="jlaw-segmented__button" data-mode="classic"></button>
          <button type="button" class="jlaw-segmented__button" data-mode="upgraded"></button>
        </div>
      </div>
      <div class="jlaw-controls__group">
        <span class="jlaw-controls__label" data-jlaw-copy="language"></span>
        <div class="jlaw-segmented" role="group" aria-label="Preview language">
          <button type="button" class="jlaw-segmented__button" data-lang="en"></button>
          <button type="button" class="jlaw-segmented__button" data-lang="es"></button>
        </div>
      </div>
    `;

    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }

      const nextMode = button.dataset.mode;
      const nextLang = button.dataset.lang;

      if (nextMode && VALID_MODES.has(nextMode) && nextMode !== state.mode) {
        state.mode = nextMode;
        persistState();
        applyState();
      }

      if (nextLang && VALID_LANGS.has(nextLang) && nextLang !== state.lang) {
        state.lang = nextLang;
        persistState();
        applyLanguage();
      }
    });

    body.appendChild(controls);
  }

  function getVisibleBurgerButton() {
    return Array.from(document.querySelectorAll(".header-burger-btn")).find((button) => {
      const styles = window.getComputedStyle(button);
      return styles.display !== "none" && styles.visibility !== "hidden" && button.offsetWidth > 0;
    });
  }

  function buildMobileDock() {
    if (document.querySelector(".jlaw-mobile-dock")) {
      return;
    }

    const dock = document.createElement("nav");
    dock.className = "jlaw-mobile-dock";
    dock.setAttribute("aria-label", "Quick actions");
    dock.innerHTML = `
      <a class="jlaw-mobile-dock__action" data-jlaw-action="call" href="/contact">
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6.6 3.8h3.1l1.6 4.3-2.1 1.4a13.8 13.8 0 0 0 5.3 5.3l1.4-2.1 4.3 1.6v3.1c0 .8-.6 1.5-1.4 1.6A16.8 16.8 0 0 1 5 5.2c.1-.8.8-1.4 1.6-1.4Z"/>
          </svg>
        </span>
        <span class="jlaw-mobile-dock__text" data-jlaw-copy="call"></span>
      </a>
      <a class="jlaw-mobile-dock__action" data-jlaw-action="directions" href="https://www.google.com/maps/search/?api=1&query=2501%20Fayetteville%20Road%2C%20Van%20Buren%2C%20AR%2072956" target="_blank" rel="noreferrer">
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="m12 20 7-16-16 7 6 1 1 6Z"/>
          </svg>
        </span>
        <span class="jlaw-mobile-dock__text" data-jlaw-copy="directions"></span>
      </a>
      <button type="button" class="jlaw-mobile-dock__action" data-jlaw-action="menu">
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </span>
        <span class="jlaw-mobile-dock__text" data-jlaw-copy="menu"></span>
      </button>
    `;

    dock.addEventListener("click", (event) => {
      const action = event.target.closest("[data-jlaw-action]");
      if (!action) {
        return;
      }

      if (action.dataset.jlawAction === "menu") {
        event.preventDefault();
        getVisibleBurgerButton()?.click();
      }
    });

    body.appendChild(dock);
  }

  function updateControls() {
    const copy = CONTROL_COPY[state.lang];
    const controls = document.querySelector(".jlaw-controls");
    if (!controls) {
      return;
    }

    controls.querySelectorAll("[data-jlaw-copy]").forEach((node) => {
      node.textContent = copy[node.dataset.jlawCopy];
    });

    controls.querySelectorAll("[data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.textContent = copy[button.dataset.mode];
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });

    controls.querySelectorAll("[data-lang]").forEach((button) => {
      const active = button.dataset.lang === state.lang;
      button.textContent = copy[button.dataset.lang === "en" ? "english" : "spanish"];
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });

    updateFloatingLayout();
  }

  function updateMobileDock() {
    const copy = CONTROL_COPY[state.lang];
    const dock = document.querySelector(".jlaw-mobile-dock");
    if (!dock) {
      return;
    }

    const phoneLink = document.querySelector('a[href^="tel:"]');
    const address = normalizeText(
      Array.from(document.querySelectorAll(".sqs-html-content"))
        .map((element) => element.textContent)
        .find((text) => normalizeText(text).includes("2501 Fayetteville Road")) || ""
    );

    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address || "2501 Fayetteville Road, Van Buren, AR 72956"
    )}`;

    dock.querySelector('[data-jlaw-action="call"]').setAttribute("href", phoneLink?.getAttribute("href") || "tel:+14794740700");
    dock.querySelector('[data-jlaw-action="directions"]').setAttribute("href", directionsUrl);
    dock.querySelectorAll("[data-jlaw-copy]").forEach((node) => {
      node.textContent = copy[node.dataset.jlawCopy];
    });
  }

  function isInternalLink(link) {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
      return false;
    }

    try {
      const url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function beginLeave(url) {
    if (reduceMotion || state.mode !== "upgraded") {
      window.location.href = url;
      return;
    }

    body.classList.add("jlaw-is-leaving");
    window.sessionStorage.setItem(STORAGE_KEYS.transition, "1");

    window.setTimeout(() => {
      window.location.href = url;
    }, 220);
  }

  function initPageTransitions() {
    if (!reduceMotion && state.mode === "upgraded" && window.sessionStorage.getItem(STORAGE_KEYS.transition) === "1") {
      body.classList.add("jlaw-is-entering");
      window.sessionStorage.removeItem(STORAGE_KEYS.transition);

      window.setTimeout(() => {
        body.classList.remove("jlaw-is-entering");
      }, 180);
    }

    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !isInternalLink(link)
        ) {
          return;
        }

        const nextUrl = new URL(link.href, window.location.href);
        if (nextUrl.href === window.location.href) {
          return;
        }

        event.preventDefault();
        beginLeave(nextUrl.href);
      });
    });
  }

  function applyState() {
    setRootState();
    restoreMarkup();
    annotateSections();

    if (state.mode === "upgraded") {
      applyUpgradedMarkup();
    }

    collectParallaxTargets();
    initRevealObserver();
    applyLanguage();
    updateScrollProgress();
    updateParallax();
    updateFloatingLayout();
  }

  buildProgressBar();
  buildTransitionOverlay();
  buildControls();
  buildMobileDock();
  initPageTransitions();
  applyState();

  body.classList.add("jlaw-enhancements-ready");

  window.addEventListener(
    "scroll",
    () => {
      updateScrollProgress();
      updateParallax();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateScrollProgress();
    updateParallax();
    updateFloatingLayout();
  });
})();
