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
  const TAB_ROUTES = ["/", "/about", "/services", "/press"];
  const TAB_COPY = {
    en: ["Home", "About", "Services", "Press"],
    es: ["Inicio", "Acerca de", "Servicios", "Prensa"],
  };
  const QUICK_MENU_COPY = {
    en: {
      home: "Home",
      about: "About",
      services: "Services",
      press: "Press",
      contact: "Contact",
      cta: "free consultation",
      close: "Close menu",
    },
    es: {
      home: "Inicio",
      about: "Acerca de",
      services: "Servicios",
      press: "Prensa",
      contact: "Contacto",
      cta: "consulta gratuita",
      close: "Cerrar menú",
    },
  };

  const ICONS = {
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6.6 3.8h3.1l1.6 4.3-2.1 1.4a13.8 13.8 0 0 0 5.3 5.3l1.4-2.1 4.3 1.6v3.1c0 .8-.6 1.5-1.4 1.6A16.8 16.8 0 0 1 5 5.2c.1-.8.8-1.4 1.6-1.4Z"/></svg>',
    fax:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 13h10v7H7z"/><path d="M8 11h.01M11 11h.01"/></svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-6-4.6-6-10a6 6 0 1 1 12 0c0 5.4-6 10-6 10Z"/><circle cx="12" cy="11" r="2.4"/></svg>',
  };

  const CONTROL_COPY = {
    en: {
      mode: "Mode",
      classic: "Classic",
      upgraded: "Upgraded",
      siteLanguage: "Site language",
      english: "English",
      spanish: "Español",
      call: "Call",
      directions: "Directions",
      menu: "Menu",
      copy: "Copy",
      copied: "Copied",
      practiceNav: "Practice area navigation",
    },
    es: {
      mode: "Modo",
      classic: "Clásico",
      upgraded: "Mejorado",
      siteLanguage: "Idioma del sitio",
      english: "Inglés",
      spanish: "Español",
      call: "Llamar",
      directions: "Ruta",
      menu: "Menú",
      copy: "Copiar",
      copied: "Copiado",
      practiceNav: "Navegación de áreas de práctica",
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
    "x 1 Attorney at Law": "x 1 abogada",
    "x 3 Children": "x 3 hijos",
    "x 4 Years Best of the Best Attorney": "x 4 años como mejor abogada de las mejores",
    "x 12 Years of Marriage": "x 12 años de matrimonio",
    "x 14 Years of Practice": "x 14 años de práctica",
    "Lady Boss x Lady Justice": "Jefa x Justicia",
    "“I’m a sweet southern woman, but when it comes to my work, I seek justice and I get it.”":
      "“Soy una mujer sureña dulce, pero cuando se trata de mi trabajo, busco justicia y la consigo.”",
    "– Carrie Jernigan": "– Carrie Jernigan",
    "WHAT ARE": "QUÉ ESTÁ",
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
  let serviceObserver = null;
  let swipeInitialized = false;
  let swipeGesture = null;

  function renderedLang() {
    return state.mode === "upgraded" ? state.lang : "en";
  }

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

  function slugify(value) {
    return normalizeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function splitLines(element) {
    return (element?.innerText || "")
      .split(/\n+/)
      .map((line) => normalizeText(line))
      .filter(Boolean);
  }

  function splitBreakLines(element) {
    if (!element) {
      return [];
    }

    return element.innerHTML
      .split(/<br\s*\/?>/i)
      .map((fragment) => normalizeText(fragment.replace(/<[^>]+>/g, " ")))
      .filter(Boolean);
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

  function clearGeneratedElements() {
    document.querySelectorAll(".jlaw-generated").forEach((element) => element.remove());
    document.querySelectorAll(".jlaw-mobile-dock").forEach((element) => element.remove());

    if (serviceObserver) {
      serviceObserver.disconnect();
      serviceObserver = null;
    }
  }

  function getPageName() {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/home") {
      return "home";
    }

    return path.replace(/^\//, "") || "home";
  }

  function normalizedPath(pathname) {
    if (!pathname) {
      return "/";
    }

    const clean = pathname.replace(/\/+$/, "") || "/";
    return clean === "/home" ? "/" : clean;
  }

  function currentTabIndex() {
    return TAB_ROUTES.indexOf(normalizedPath(window.location.pathname));
  }

  function setRootState() {
    const lang = renderedLang();
    root.dataset.jlawMode = state.mode;
    root.dataset.jlawLang = lang;
    root.lang = lang === "es" ? "es" : "en";
    body.dataset.jlawPage = getPageName();
  }

  function persistState() {
    try {
      window.localStorage.setItem(STORAGE_KEYS.mode, state.mode);
      window.localStorage.setItem(STORAGE_KEYS.lang, state.lang);
    } catch (error) {
      return;
    }
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
      section.style.setProperty("--jlaw-reveal-delay", `${Math.min(index * 80, 360)}ms`);
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

    if (page === "press") {
      sections.forEach((section) => section.classList.add("jlaw-press-section"));
      sections.find((section) => section.querySelector(".video-block"))?.classList.add("jlaw-press-video-section");
    }

    if (page === "contact") {
      sections[0]?.classList.add("jlaw-contact-stage");
    }
  }

  function findTextContainers(predicate) {
    return Array.from(document.querySelectorAll(".sqs-html-content")).filter(predicate);
  }

  function decorateStatLine(line) {
    return escapeHtml(line)
      .replace(/^x(\s*)/i, '<span class="jlaw-stat-card__mark">x</span>$1')
      .replace(/(\d+)/, '<span class="jlaw-stat-card__value">$1</span>');
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
    container.innerHTML = `
      <div class="jlaw-stat-grid">
        ${lines
          .map(
            (line) => `
              <article class="jlaw-stat-card">
                <p class="jlaw-stat-card__line">${decorateStatLine(line)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function enhanceAboutDetails() {
    const titles = new Set([
      "Personal Background",
      "Academic + Professional Background",
      "Professional + Civil Affiliations",
    ]);

    const containers = findTextContainers((element) => {
      const heading = normalizeText(element.querySelector("p")?.textContent);
      return titles.has(heading);
    });

    containers.forEach((container) => {
      const heading = normalizeText(container.querySelector("p")?.textContent);
      const items = Array.from(container.querySelectorAll("li"))
        .map((item) => normalizeText(item.textContent))
        .filter(Boolean);

      if (!heading || !items.length) {
        return;
      }

      rememberMarkup(container);
      container.innerHTML = `
        <article class="jlaw-detail-card">
          <p class="jlaw-detail-card__title">${escapeHtml(heading)}</p>
          <ul class="jlaw-detail-card__list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `;
    });
  }

  function setServiceNavActive(id) {
    document.querySelectorAll(".jlaw-service-nav__link").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      link.setAttribute("aria-current", link.classList.contains("is-active") ? "true" : "false");
    });
  }

  function initServiceObserver(ids) {
    if (!ids.length) {
      return;
    }

    setServiceNavActive(ids[0]);

    serviceObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries[0]) {
          setServiceNavActive(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.7],
        rootMargin: "-20% 0px -50% 0px",
      }
    );

    ids.forEach((id) => {
      const target = document.getElementById(id);
      if (target) {
        serviceObserver.observe(target);
      }
    });
  }

  function buildServiceJumpNav(cards) {
    if (!cards.length) {
      return;
    }

    const host = document.querySelector(".jlaw-services-intro .col.sqs-col-12") || document.querySelector(".jlaw-services-intro");
    if (!host) {
      return;
    }

    const nav = document.createElement("nav");
    nav.className = "jlaw-service-nav jlaw-generated";
    nav.setAttribute("aria-label", CONTROL_COPY[state.lang].practiceNav);
    nav.innerHTML = cards
      .map(
        (card) => `
          <a class="jlaw-service-nav__link" href="#${card.id}">
            ${escapeHtml(card.title)}
          </a>
        `
      )
      .join("");

    host.appendChild(nav);
    initServiceObserver(cards.map((card) => card.id));
  }

  function enhanceServices() {
    const titles = new Set(["Personal Injury", "Criminal Law", "Family Law"]);
    const containers = findTextContainers((element) => {
      const heading = normalizeText(element.querySelector("p")?.textContent);
      return titles.has(heading);
    });

    const cards = [];

    containers.forEach((container) => {
      const paragraphs = Array.from(container.querySelectorAll("p"));
      const title = normalizeText(paragraphs[0]?.textContent);
      const items = splitLines(paragraphs[1]);

      if (!title || !items.length) {
        return;
      }

      const id = `service-${slugify(title)}`;
      cards.push({ id, title });

      rememberMarkup(container);
      container.innerHTML = `
        <article class="jlaw-service-card ${title === "Family Law" ? "jlaw-service-card--featured" : ""}" id="${id}" tabindex="-1">
          <p class="jlaw-service-card__title">${escapeHtml(title)}</p>
          <ul class="jlaw-service-card__list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `;
    });

    buildServiceJumpNav(cards);
  }

  function enhancePressCards() {
    const titles = new Set(["TikTok", "The Payless Shoe Mom", "Instagram"]);
    const containers = findTextContainers((element) => {
      const heading = normalizeText(element.querySelector("p")?.textContent);
      return titles.has(heading);
    });

    containers.forEach((container) => {
      const paragraphs = Array.from(container.querySelectorAll("p"));
      const title = normalizeText(paragraphs[0]?.textContent);
      const metaLine = normalizeText(paragraphs[1]?.textContent);
      const copy = paragraphs
        .slice(2)
        .map((paragraph) => normalizeText(paragraph.textContent))
        .filter(Boolean)
        .join(" ");

      if (!title) {
        return;
      }

      rememberMarkup(container);
      container.innerHTML = `
        <article class="jlaw-press-card ${copy ? "" : "jlaw-press-card--compact"}">
          <p class="jlaw-press-card__title">${escapeHtml(title)}</p>
          ${
            metaLine
              ? `<div class="jlaw-pill-row">${metaLine
                  .split(/\s*•\s*/)
                  .map((item) => normalizeText(item))
                  .filter(Boolean)
                  .map((item) => `<span class="jlaw-pill">${escapeHtml(item)}</span>`)
                  .join("")}</div>`
              : ""
          }
          ${copy ? `<p class="jlaw-press-card__body">${escapeHtml(copy)}</p>` : ""}
        </article>
      `;
    });
  }

  function copyButtonMarkup(value) {
    return `
      <button type="button" class="jlaw-copy-button" data-copy-text="${escapeHtml(value)}">
        <span class="jlaw-copy-button__icon">${ICONS.copy}</span>
      </button>
    `;
  }

  function enhanceContactStage() {
    const container = findTextContainers(
      (element) =>
        normalizeText(element.textContent).includes("Drop a line.") &&
        normalizeText(element.textContent).includes("479.474.0753")
    )[0];

    if (!container) {
      return;
    }

    const paragraphs = Array.from(container.querySelectorAll("p"));
    const title = normalizeText(paragraphs[0]?.textContent);
    const detailLines = splitBreakLines(paragraphs[1]).filter((line) => line !== "_");
    const addressLines = splitBreakLines(paragraphs[2]);
    const phoneHref = container.querySelector('a[href^="tel:"]')?.getAttribute("href") || "tel:+14794740700";
    const phoneLine = detailLines.find((line) => line.includes("479.474.0700")) || "479.474.0700 (office)";
    const faxLine = detailLines.find((line) => line.includes("fax")) || "479.474.0753 (fax)";
    const phoneNumber = normalizeText(phoneLine.replace("(office)", ""));
    const officeLabel = phoneLine.includes("(office)") ? "(office)" : "";
    const addressText = addressLines.join(", ");
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      addressText || "2501 Fayetteville Road, Van Buren, AR 72956"
    )}`;

    rememberMarkup(container);
    container.innerHTML = `
      <section class="jlaw-contact-ledger">
        <p class="jlaw-contact-ledger__title">${escapeHtml(title)}</p>
        <div class="jlaw-contact-grid">
          <a class="jlaw-contact-card jlaw-contact-card--phone" href="${escapeHtml(phoneHref)}">
            <span class="jlaw-contact-card__icon">${ICONS.phone}</span>
            <span class="jlaw-contact-card__line">${escapeHtml(phoneNumber)}</span>
            ${officeLabel ? `<span class="jlaw-contact-card__meta">${escapeHtml(officeLabel)}</span>` : ""}
            ${copyButtonMarkup(phoneNumber)}
          </a>
          <div class="jlaw-contact-card jlaw-contact-card--fax">
            <span class="jlaw-contact-card__icon">${ICONS.fax}</span>
            <span class="jlaw-contact-card__line">${escapeHtml(faxLine)}</span>
            ${copyButtonMarkup("479.474.0753")}
          </div>
          <a class="jlaw-contact-card jlaw-contact-card--address" href="${escapeHtml(directionsUrl)}" target="_blank" rel="noreferrer">
            <span class="jlaw-contact-card__icon">${ICONS.pin}</span>
            <span class="jlaw-contact-card__line">${escapeHtml(addressLines[0] || "2501 Fayetteville Road")}</span>
            <span class="jlaw-contact-card__meta">${escapeHtml(addressLines[1] || "Van Buren, AR 72956")}</span>
            ${copyButtonMarkup(addressText)}
          </a>
        </div>
      </section>
    `;
  }

  function enhanceFooterSection() {
    const footer = document.querySelector(".jlaw-footer-section");
    if (!footer) {
      return;
    }

    const info = Array.from(footer.querySelectorAll(".sqs-html-content")).find((element) => {
      const text = normalizeText(element.textContent);
      return text.includes("2501 Fayetteville Road") && text.includes("Jernigan Law Group");
    });

    if (!info) {
      return;
    }

    const addressParagraph = info.querySelector("p");
    const addressLines = splitBreakLines(addressParagraph);
    const line1 = addressLines[0] || "2501 Fayetteville Road";
    const line2 = addressLines[1] || "Van Buren, AR 72956";
    const phoneLink = info.querySelector('a[href^="tel:"]');
    const phoneHref = phoneLink?.getAttribute("href") || "tel:+14794740700";
    const phoneText = normalizeText(phoneLink?.textContent) || "479.474.0700";
    const copyrightText = `Jernigan Law Group © ${new Date().getFullYear()}`;
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${line1}, ${line2}`
    )}`;

    rememberMarkup(info);
    info.innerHTML = `
      <section class="jlaw-footer-contact-card">
        <div class="jlaw-footer-cta-row">
          <a class="jlaw-footer-cta jlaw-footer-cta--call" href="${escapeHtml(phoneHref)}" data-jlaw-copy="call"></a>
          <a class="jlaw-footer-cta jlaw-footer-cta--directions" href="${escapeHtml(directionsUrl)}" target="_blank" rel="noreferrer" data-jlaw-copy="directions"></a>
        </div>
        <p class="jlaw-footer-address">${escapeHtml(line1)}<br>${escapeHtml(line2)}</p>
        <p class="jlaw-footer-phone"><a href="${escapeHtml(phoneHref)}">${escapeHtml(phoneText)}</a></p>
        <p class="jlaw-footer-copy">${escapeHtml(copyrightText)}</p>
      </section>
    `;
  }

  function buildPageTabs() {
    if (document.querySelector(".jlaw-page-tabs")) {
      return;
    }

    const tabs = document.createElement("nav");
    tabs.className = "jlaw-page-tabs jlaw-generated";
    tabs.setAttribute("aria-label", "Page tabs");
    tabs.innerHTML = TAB_ROUTES.map((route) => `<a class="jlaw-page-tabs__link" href="${route}" data-route="${route}"></a>`).join("");
    const header = document.querySelector("#header");
    if (header) {
      header.appendChild(tabs);
    } else {
      body.appendChild(tabs);
    }
    initSwipeNavigation();
  }

  function updatePageTabs() {
    const tabs = document.querySelector(".jlaw-page-tabs");
    if (!tabs) {
      return;
    }

    const labels = TAB_COPY[state.lang] || TAB_COPY.en;
    const currentPath = normalizedPath(window.location.pathname);
    tabs.querySelectorAll(".jlaw-page-tabs__link").forEach((link, index) => {
      const label = labels[index] || TAB_COPY.en[index];
      const active = normalizedPath(link.getAttribute("data-route")) === currentPath;
      link.textContent = label;
      link.classList.toggle("is-active", active);
      link.setAttribute("aria-current", active ? "page" : "false");
      link.setAttribute("aria-label", label);
      link.setAttribute("title", label);
    });
  }

  function buildQuickMenu() {
    if (document.querySelector(".jlaw-quick-menu")) {
      return;
    }

    const quickMenu = document.createElement("aside");
    quickMenu.className = "jlaw-quick-menu jlaw-generated";
    quickMenu.setAttribute("aria-hidden", "true");
    quickMenu.innerHTML = `
      <div class="jlaw-quick-menu__backdrop" data-jlaw-quick-close></div>
      <div class="jlaw-quick-menu__panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <button type="button" class="jlaw-quick-menu__close" data-jlaw-quick-close aria-label="Close menu">&times;</button>
        <nav class="jlaw-quick-menu__links" aria-label="Menu">
          <a href="/" data-jlaw-quick-key="home"></a>
          <a href="/about" data-jlaw-quick-key="about"></a>
          <a href="/services" data-jlaw-quick-key="services"></a>
          <a href="/press" data-jlaw-quick-key="press"></a>
          <a href="/contact" data-jlaw-quick-key="contact"></a>
        </nav>
        <a class="jlaw-quick-menu__cta" href="tel:+14794740700" data-jlaw-quick-key="cta"></a>
      </div>
    `;

    quickMenu.addEventListener("click", (event) => {
      if (event.target.closest("[data-jlaw-quick-close]")) {
        event.preventDefault();
        closeQuickMenu();
        return;
      }

      if (event.target.closest(".jlaw-quick-menu__links a, .jlaw-quick-menu__cta")) {
        closeQuickMenu();
      }
    });

    body.appendChild(quickMenu);
  }

  function updateQuickMenu() {
    const quickMenu = document.querySelector(".jlaw-quick-menu");
    if (!quickMenu) {
      return;
    }

    const copy = QUICK_MENU_COPY[state.lang] || QUICK_MENU_COPY.en;
    quickMenu.querySelectorAll("[data-jlaw-quick-key]").forEach((node) => {
      const key = node.dataset.jlawQuickKey;
      if (!copy[key]) {
        return;
      }

      node.textContent = copy[key];
      node.setAttribute("aria-label", copy[key]);
      node.setAttribute("title", copy[key]);
    });

    const close = quickMenu.querySelector(".jlaw-quick-menu__close");
    if (close) {
      close.setAttribute("aria-label", copy.close);
      close.setAttribute("title", copy.close);
    }
  }

  function openQuickMenu() {
    const quickMenu = document.querySelector(".jlaw-quick-menu");
    if (!quickMenu) {
      return;
    }

    quickMenu.setAttribute("aria-hidden", "false");
    body.classList.add("jlaw-quick-menu-open");
  }

  function closeQuickMenu() {
    const quickMenu = document.querySelector(".jlaw-quick-menu");
    if (!quickMenu) {
      return;
    }

    quickMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("jlaw-quick-menu-open");
  }

  function applySwipeShift(deltaX) {
    root.style.setProperty("--jlaw-swipe-shift", `${Math.round(deltaX)}px`);
  }

  function clearSwipeShift() {
    root.style.setProperty("--jlaw-swipe-shift", "0px");
  }

  function canStartSwipe(target) {
    if (!target || state.mode !== "upgraded" || !window.matchMedia("(max-width: 820px)").matches) {
      return false;
    }

    if (currentTabIndex() === -1) {
      return false;
    }

    return !target.closest(
      [
        "a",
        "button",
        "input",
        "select",
        "textarea",
        "label",
        ".header-menu",
        ".jlaw-page-tabs",
        ".jlaw-mobile-dock",
        ".jlaw-controls",
        ".jlaw-service-nav",
      ].join(",")
    );
  }

  function finishSwipeNavigation() {
    if (!swipeGesture) {
      return;
    }

    const distance = swipeGesture.lastX - swipeGesture.startX;
    const threshold = 72;
    const index = currentTabIndex();
    let nextIndex = -1;

    if (Math.abs(distance) >= threshold && index !== -1) {
      nextIndex = distance < 0 ? index + 1 : index - 1;
    }

    body.classList.remove("jlaw-is-swiping");
    clearSwipeShift();

    if (nextIndex >= 0 && nextIndex < TAB_ROUTES.length) {
      beginLeave(TAB_ROUTES[nextIndex]);
    }

    swipeGesture = null;
  }

  function initSwipeNavigation() {
    if (swipeInitialized) {
      return;
    }

    const page = document.querySelector("main#page");
    if (!page) {
      return;
    }

    swipeInitialized = true;
    body.classList.add("jlaw-swipe-ready");

    page.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1 || !canStartSwipe(event.target)) {
          swipeGesture = null;
          return;
        }

        const touch = event.touches[0];
        swipeGesture = {
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          active: false,
        };
      },
      { passive: true }
    );

    page.addEventListener(
      "touchmove",
      (event) => {
        if (!swipeGesture || event.touches.length !== 1) {
          return;
        }

        const touch = event.touches[0];
        swipeGesture.lastX = touch.clientX;
        const deltaX = touch.clientX - swipeGesture.startX;
        const deltaY = touch.clientY - swipeGesture.startY;

        if (!swipeGesture.active) {
          if (Math.abs(deltaX) < 12 || Math.abs(deltaX) <= Math.abs(deltaY) + 8) {
            return;
          }

          swipeGesture.active = true;
          body.classList.add("jlaw-is-swiping");
        }

        event.preventDefault();
        const shift = Math.max(-110, Math.min(110, deltaX * 0.58));
        applySwipeShift(shift);
      },
      { passive: false }
    );

    page.addEventListener(
      "touchend",
      () => {
        if (!swipeGesture) {
          return;
        }

        finishSwipeNavigation();
      },
      { passive: true }
    );

    page.addEventListener(
      "touchcancel",
      () => {
        if (!swipeGesture) {
          return;
        }

        body.classList.remove("jlaw-is-swiping");
        clearSwipeShift();
        swipeGesture = null;
      },
      { passive: true }
    );
  }

  function applyUpgradedMarkup() {
    enhanceHomeStats();
    enhanceAboutDetails();
    enhanceServices();
    enhancePressCards();
    enhanceContactStage();
    enhanceFooterSection();
    buildSiteLanguageSwitches();
    buildPageTabs();
    buildQuickMenu();
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
          ".jlaw-press-video-section .sqs-video-wrapper",
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
    body.classList.toggle("jlaw-is-scrolled", window.scrollY > 12);
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
      const shift = Math.max(-20, Math.min(20, distance * -0.035));
      target.style.setProperty("--jlaw-parallax-shift", `${shift.toFixed(2)}px`);
    });
  }

  function updateFloatingLayout() {
    const controls = document.querySelector(".jlaw-controls");
    const showControls = body.classList.contains("jlaw-controls-visible");
    root.style.setProperty(
      "--jlaw-controls-stack-height",
      controls && showControls ? `${Math.ceil(controls.getBoundingClientRect().height)}px` : "0px"
    );
    root.style.setProperty("--jlaw-dock-stack-height", "0px");
  }

  function updateMobileHeaderOffset() {
    if (state.mode !== "upgraded" || !window.matchMedia("(max-width: 820px)").matches) {
      root.style.removeProperty("--jlaw-mobile-header-height");
      return;
    }

    const header = document.querySelector("#header");
    if (!header) {
      return;
    }

    root.style.setProperty("--jlaw-mobile-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
  }

  function updateBottomControlsVisibility() {
    const isMobileViewport = window.matchMedia("(max-width: 820px)").matches;
    const bottomThreshold = Math.max(48, Math.round(parseFloat(window.getComputedStyle(body).paddingBottom) || 0));
    const footer = document.querySelector(".jlaw-footer-section");
    const footerRect = footer?.getBoundingClientRect();
    const nearBottom = footerRect
      ? footerRect.bottom <= window.innerHeight + bottomThreshold
      : root.scrollHeight - window.innerHeight - window.scrollY <= bottomThreshold;
    body.classList.toggle("jlaw-controls-visible", !isMobileViewport || nearBottom);
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

  function syncPageAccessibility() {
    document.querySelectorAll(".header-nav-item--active a, .header-menu-nav-item--active a").forEach((link) => {
      link.setAttribute("aria-current", "page");
    });
  }

  function refreshTranslatables() {
    const textNodes = [];
    const attributeEntries = [];
    const skipSelectors = [".jlaw-controls", ".jlaw-mobile-dock", ".jlaw-transition", ".jlaw-site-language"];
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

  function updateCopyButtons() {
    const labels = CONTROL_COPY[renderedLang()];
    document.querySelectorAll(".jlaw-copy-button").forEach((button) => {
      const label = button.dataset.copyState === "copied" ? labels.copied : labels.copy;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  function applyLanguage() {
    setRootState();
    const { textNodes, attributeEntries } = refreshTranslatables();
    const translateToSpanish = state.mode === "upgraded" && state.lang === "es";

    textNodes.forEach(({ node, key }) => {
      node.textContent = translateToSpanish ? TRANSLATIONS[key] : originalText.get(node);
    });

    attributeEntries.forEach(({ element, attribute, key, original }) => {
      element.setAttribute(attribute, translateToSpanish ? TRANSLATIONS[key] : original);
    });

    const serviceNav = document.querySelector(".jlaw-service-nav");
    if (serviceNav) {
      serviceNav.setAttribute("aria-label", CONTROL_COPY[renderedLang()].practiceNav);
    }

    updateControls();
    updateSiteLanguageSwitches();
    updatePageTabs();
    updateQuickMenu();
    updateFooterActions();
    updateCopyButtons();
    updateFloatingLayout();
  }

  function buildProgressBar() {
    if (document.querySelector(".jlaw-progress")) {
      return;
    }

    const progress = document.createElement("div");
    progress.className = "jlaw-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = '<span class="jlaw-progress__bar"></span>';
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
    controls.setAttribute("aria-label", "Preview mode");
    controls.innerHTML = `
      <div class="jlaw-controls__group">
        <div class="jlaw-segmented" role="group" aria-label="Preview mode">
          <button type="button" class="jlaw-segmented__button" data-mode="classic"></button>
          <button type="button" class="jlaw-segmented__button" data-mode="upgraded"></button>
        </div>
      </div>
    `;

    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }

      const nextMode = button.dataset.mode;

      if (nextMode && VALID_MODES.has(nextMode) && nextMode !== state.mode) {
        state.mode = nextMode;
        persistState();
        applyState();
      }
    });

    body.appendChild(controls);
  }

  function createSiteLanguageSwitch(className = "") {
    const switcher = document.createElement("div");
    switcher.className = ["jlaw-site-language", "jlaw-generated", className].filter(Boolean).join(" ");
    switcher.setAttribute("role", "group");
    switcher.innerHTML = `
      <button type="button" class="jlaw-site-language__button" data-site-lang="en">EN</button>
      <button type="button" class="jlaw-site-language__button" data-site-lang="es">ES</button>
    `;

    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-site-lang]");
      const nextLang = button?.dataset.siteLang;
      if (!nextLang || !VALID_LANGS.has(nextLang) || nextLang === state.lang) {
        return;
      }

      state.lang = nextLang;
      persistState();
      applyLanguage();
    });

    return switcher;
  }

  function buildSiteLanguageSwitches() {
    Array.from(document.querySelectorAll("#header .header-display-desktop .header-actions--right")).forEach((host, index) => {
      if (host.querySelector(".jlaw-site-language")) {
        return;
      }

      host.insertBefore(createSiteLanguageSwitch(index === 0 ? "jlaw-site-language--desktop" : ""), host.firstChild);
    });

    Array.from(document.querySelectorAll("#header .header-display-mobile")).forEach((host) => {
      if (host.querySelector(".jlaw-site-language--mobile")) {
        return;
      }

      host.appendChild(createSiteLanguageSwitch("jlaw-site-language--mobile"));
    });
  }

  function getVisibleBurgerButton() {
    const buttons = Array.from(document.querySelectorAll(".header-burger-btn"));
    const visible = buttons.find((button) => {
      const styles = window.getComputedStyle(button);
      return styles.display !== "none" && styles.visibility !== "hidden" && button.offsetWidth > 0;
    });

    return visible || buttons[buttons.length - 1] || null;
  }

  function isNativeMenuOpen() {
    const menu = document.querySelector(".header-menu");
    if (!menu) {
      return false;
    }

    const styles = window.getComputedStyle(menu);
    return styles.visibility !== "hidden" && Number.parseFloat(styles.opacity || "0") > 0.05;
  }

  function openSiteMenu() {
    buildQuickMenu();
    const button = getVisibleBurgerButton();
    if (button) {
      button.click();
      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    }

    window.setTimeout(() => {
      if (!isNativeMenuOpen()) {
        openQuickMenu();
      }
    }, 80);
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
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">${ICONS.phone}</span>
        <span class="jlaw-mobile-dock__text" data-jlaw-copy="call"></span>
      </a>
      <a class="jlaw-mobile-dock__action" data-jlaw-action="directions" href="https://www.google.com/maps/search/?api=1&query=2501%20Fayetteville%20Road%2C%20Van%20Buren%2C%20AR%2072956" target="_blank" rel="noreferrer">
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">${ICONS.pin}</span>
        <span class="jlaw-mobile-dock__text" data-jlaw-copy="directions"></span>
      </a>
      <button type="button" class="jlaw-mobile-dock__action" data-jlaw-action="menu">
        <span class="jlaw-mobile-dock__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
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
        openSiteMenu();
      }
    });

    body.appendChild(dock);
  }

  function updateControls() {
    const copy = CONTROL_COPY[renderedLang()];
    const controls = document.querySelector(".jlaw-controls");
    if (!controls) {
      return;
    }

    controls.querySelectorAll("[data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.textContent = copy[button.dataset.mode];
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.setAttribute("title", copy[button.dataset.mode]);
      button.setAttribute("aria-label", copy[button.dataset.mode]);
    });

    updateFloatingLayout();
  }

  function updateSiteLanguageSwitches() {
    const copy = CONTROL_COPY[state.lang];
    document.querySelectorAll(".jlaw-site-language").forEach((switcher) => {
      switcher.setAttribute("aria-label", copy.siteLanguage);

      switcher.querySelectorAll("[data-site-lang]").forEach((button) => {
        const active = button.dataset.siteLang === state.lang;
        const label = button.dataset.siteLang === "en" ? copy.english : copy.spanish;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
      });
    });
  }

  function updateMobileDock() {
    const copy = CONTROL_COPY[renderedLang()];
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

  function updateFooterActions() {
    const copy = CONTROL_COPY[renderedLang()];
    document.querySelectorAll(".jlaw-footer-cta[data-jlaw-copy]").forEach((link) => {
      const key = link.dataset.jlawCopy;
      if (!copy[key]) {
        return;
      }

      link.textContent = copy[key];
      link.setAttribute("aria-label", copy[key]);
      link.setAttribute("title", copy[key]);
    });
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      body.appendChild(helper);
      helper.select();

      try {
        document.execCommand("copy");
        helper.remove();
        return true;
      } catch (fallbackError) {
        helper.remove();
        return false;
      }
    }
  }

  function initUtilityActions() {
    body.addEventListener("click", async (event) => {
      const copyButton = event.target.closest(".jlaw-copy-button");
      if (!copyButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const wasCopied = await copyText(copyButton.dataset.copyText || "");
      if (!wasCopied) {
        return;
      }

      copyButton.dataset.copyState = "copied";
      updateCopyButtons();

      window.clearTimeout(copyButton._copyTimer);
      copyButton._copyTimer = window.setTimeout(() => {
        copyButton.dataset.copyState = "";
        updateCopyButtons();
      }, 1400);
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
      window.setTimeout(() => body.classList.remove("jlaw-is-entering"), 180);
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
    clearGeneratedElements();
    setRootState();
    body.classList.remove("jlaw-is-swiping");
    clearSwipeShift();
    closeQuickMenu();
    restoreMarkup();
    annotateSections();
    syncPageAccessibility();

    if (state.mode === "upgraded") {
      applyUpgradedMarkup();
    }

    collectParallaxTargets();
    initRevealObserver();
    applyLanguage();
    updateScrollProgress();
    updateBottomControlsVisibility();
    updateParallax();
    updateFloatingLayout();
    updateMobileHeaderOffset();
  }

  buildProgressBar();
  buildTransitionOverlay();
  buildControls();
  initUtilityActions();
  initPageTransitions();
  applyState();

  body.classList.add("jlaw-enhancements-ready");

  window.addEventListener(
    "scroll",
    () => {
      updateScrollProgress();
      updateBottomControlsVisibility();
      updateParallax();
      updateFloatingLayout();
      updateMobileHeaderOffset();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    updateScrollProgress();
    updateBottomControlsVisibility();
    updateParallax();
    updateFloatingLayout();
    updateMobileHeaderOffset();
  });
})();
