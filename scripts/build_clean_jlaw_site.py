#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parent.parent
SITE_NAME = "JLaw"
TYPEKIT_SCRIPT = (
    "https://use.typekit.net/ik/"
    "B3vm-uCu24G29ub7Ki-UtrOguyu-pTwzTs7k5HJ9OjIfe7JIfFHN4UJLFRbh52jhWDmcFDJXjR4qjhI3jhIDwD4qwQMtFhBK"
    "Zy7nMkG0jAFu-WsoShFGZAsude80ZkoRdhXCHKoyjamTiY8Djhy8ZYmC-Ao1Oco8if37OcBDOcu8OfG0de8EjW4qOWFod1sGZ"
    "WFTpcmkOAu3ShJ0SaBujW48Sagyjh90jhNlOfG0SaBujW48SagyjhmDjhy8ZYmC-Ao1OcFzdPUyjamTiY8Djhy8ZYmC-Ao1Oc"
    "FzdPUyjamTiY8Djhy8ZYmC-Ao1Oco8ifUySkolZPU7ZW40-AiydcUyihikdam3OcFzdPUC-WTyScblSa80iey8Sh8EZWJldWg"
    "DjKoDSWmyScmDSeBRZPoRdhXCdeNRjAUGdaFXOYFUiABkZWF3jAF8ShFGZAsude80ZkoRdhXCiaiaOcBRiA8XpWFR-emqiAUT"
    "dcS0jhNlOYiaikoyjamTiY8Djhy8ZYmC-Ao1Oco8ifUaiaS0jWw0dA9CiaiaOcT8ScoTZhB0deBaZa4ziWM0jhNlOYiaikoC-"
    "WTyScblSa80iey8Sh8EZWJldWgDjKoDSWmyScmDSeBRZPoRdhXCiaiaO1FUiABkZWF3jAF8ShFGZAsude80ZkoRdhXKBcBnie8"
    "hOAikdas8ShClZWyXZAoqZAb7f6KiX6IbMg6IJMJ7f6KyX6IbMg6YJMJ7f6KpX6IbMg65JMJ7f6KKX6IbMg6sJMHbMjHm_xXB.js"
)
NAV_LINKS = [
    ("Home", "/"),
    ("About", "/about"),
    ("Services", "/services"),
    ("Press", "/press"),
    ("Contact", "/contact"),
]


def asset(prefix: str, name: str) -> str:
    return f"{prefix}assets/jlaw/{name}"


def page_title(label: str) -> str:
    return SITE_NAME if label == "Home" else f"{label} - {SITE_NAME}"


def nav_html(current: str) -> str:
    items = []
    for label, href in NAV_LINKS:
        attrs = ' aria-current="page"' if current == label.lower() else ""
        items.append(
            f'<li class="site-nav__item"><a class="site-nav__link" href="{href}"{attrs}>{label}</a></li>'
        )
    return "\n".join(items)


def head_html(title: str, description: str, prefix: str) -> str:
    return dedent(
        f"""\
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content="{description}" />
          <link rel="icon" type="image/x-icon" href="{asset(prefix, 'favicon.ico')}" />
          <meta property="og:title" content="{title}" />
          <meta property="og:description" content="{description}" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="{asset(prefix, 'logo-white.png')}" />
          <link rel="preconnect" href="https://images.squarespace-cdn.com" />
          <link rel="preconnect" href="https://use.typekit.net" crossorigin />
          <link rel="preconnect" href="https://p.typekit.net" crossorigin />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <script>document.documentElement.classList.add("wf-loading");</script>
          <script
            async
            src="{TYPEKIT_SCRIPT}"
            onload="try{{Typekit.load();}}catch(e){{}} document.documentElement.classList.remove('wf-loading');"
          ></script>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          />
          <link rel="stylesheet" href="{asset(prefix, 'site.css')}" />
        </head>
        """
    )


def header_html(prefix: str, current: str) -> str:
    return dedent(
        f"""\
        <a class="skip-link" href="#content">Skip to content</a>
        <header class="site-header" data-site-header>
          <div class="site-header__inner container">
            <nav class="site-nav" id="primary-nav" data-site-nav aria-label="Primary">
              <ul class="site-nav__list">
                {nav_html(current)}
              </ul>
              <a class="site-header__cta site-header__cta--mobile" href="tel:+14794740700">free consultation</a>
            </nav>
            <a class="site-logo" href="/" aria-label="JLaw home">
              <img src="{asset(prefix, 'logo-white.png')}" alt="J.LAW" width="535" height="100" />
            </a>
            <a class="site-header__cta site-header__cta--desktop" href="tel:+14794740700">free consultation</a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>
              <span class="visually-hidden">Toggle navigation</span>
              <span class="nav-toggle__bars"></span>
            </button>
          </div>
        </header>
        """
    )


def footer_html(prefix: str) -> str:
    return dedent(
        f"""\
        <footer class="site-footer">
          <div class="site-footer__inner container">
            <a class="site-footer__brand" href="/" aria-label="JLaw home">
              <img src="{asset(prefix, 'logo-white.png')}" alt="J.LAW" width="535" height="100" />
            </a>
            <div class="site-footer__contact">
              <p>2501 Fayetteville Road<br />Van Buren, AR 72956</p>
              <p><a href="tel:+14794740700">479.474.0700</a></p>
              <p class="site-footer__legal">Jernigan Law Group &copy; 2025</p>
            </div>
          </div>
        </footer>
        """
    )


def layout_html(*, title: str, description: str, prefix: str, current: str, body_class: str, main_html: str) -> str:
    return dedent(
        f"""\
        <!doctype html>
        <html lang="en-US">
        {head_html(title, description, prefix)}
          <body class="{body_class}">
            <div class="page-shell">
              {header_html(prefix, current)}
              <main id="content">
                {main_html}
              </main>
              {footer_html(prefix)}
            </div>
            <script src="{asset(prefix, 'site.js')}" defer></script>
          </body>
        </html>
        """
    )


def home_html(prefix: str) -> str:
    return dedent(
        f"""\
        <section class="hero hero--short">
          <div class="hero__media">
            <img src="{asset(prefix, 'home-hero.jpg')}" alt="Carrie Jernigan standing outside the law office" style="object-position: center 18%;" />
          </div>
          <div class="hero__veil"></div>
          <div class="hero__content">
            <p class="hero__statement hero__statement--compact">Law, The Jernigan Way.</p>
            <a class="btn btn--light" href="/about">who is j.law?</a>
          </div>
        </section>

        <section class="section section--paper">
          <div class="container split split--home-stats">
            <h1 class="section-mark">Jernigan</h1>
            <ul class="metrics-list" aria-label="Firm snapshot">
              <li><span>x</span> 1 Attorney at Law</li>
              <li><span>x</span> 3 Children</li>
              <li><span>x</span> 4 Years Best of the Best Attorney</li>
              <li><span>x</span> 12 Years of Marriage</li>
              <li><span>x</span> 14 Years of Practice</li>
            </ul>
          </div>
        </section>

        <section class="quote-slab section--night">
          <div class="quote-slab__media">
            <img src="{asset(prefix, 'home-quote.jpg')}" alt="Carrie Jernigan portrait in a white blazer" style="object-position: center 20%; filter: grayscale(100%);" />
          </div>
          <div class="quote-slab__veil"></div>
          <div class="quote-slab__inner">
            <p class="quote-slab__eyebrow">Lady Boss &times; Lady Justice</p>
            <p class="quote-slab__text">&quot;I&apos;m a sweet southern woman, but when it comes to my work, I seek justice and I get it.&quot;</p>
            <div class="quote-slab__cite">- Carrie Jernigan</div>
          </div>
        </section>

        <section class="section section--paper-deep">
          <div class="container testimonial-grid">
            <h2 class="section-title">WHAT ARE<br />THE PEOPLE SAYING?</h2>
            <div class="testimonial-card">
              <blockquote>
                &quot;When we hired Mrs. Jernigan, we got more than just a lawyer; We got a guide to help us through the
                court system; an interpreter to translate the legal documents and language, and an advocate who
                understood what our case meant to our family and who fought to defend our rights. We received more than
                just legal council, we received highly professional and personalized service!&quot;
              </blockquote>
              <cite>- Susie, Van Buren</cite>
            </div>
          </div>
        </section>
        """
    )


def about_html(prefix: str) -> str:
    return dedent(
        f"""\
        <section class="hero hero--short">
          <div class="hero__media">
            <img src="{asset(prefix, 'about-hero.jpg')}" alt="Carrie Jernigan smiling in a blazer outdoors" style="object-position: center 14%;" />
          </div>
          <div class="hero__veil"></div>
        </section>

        <section class="section section--paper">
          <div class="container bio-grid">
            <div class="text-stack">
              <p class="eyebrow">The Woman Behind the Brand</p>
              <h1 class="section-title section-title--serif">Carrie Jernigan</h1>
            </div>
            <div class="bio-columns">
              <article class="bio-card">
                <h2>Personal Background</h2>
                <ul>
                  <li>Born and raised in Alma, AR</li>
                  <li>Lives in Alma, AR</li>
                  <li>Enjoys spending time with her husband, Shawn, two daughters, Harper and Campbell, and son, Amos</li>
                  <li>Avid bow hunter; shot professionally for Martin Archery</li>
                </ul>
              </article>
              <article class="bio-card">
                <h2>Academic + Professional Background</h2>
                <ul>
                  <li>Alma High School, 2000</li>
                  <li>University of Arkansas, B.A. Computer Science, 2004</li>
                  <li>University of Arkansas Law School [Juris Doctor], 2006</li>
                  <li>Licensed attorney in Arkansas</li>
                </ul>
              </article>
              <article class="bio-card">
                <h2>Professional + Civil Affiliations</h2>
                <ul>
                  <li>Crawford County Bar Association</li>
                  <li>Sebastian County Bar Association</li>
                  <li>Arkansas Bar Association</li>
                  <li>National Rifle Association</li>
                  <li>Rotary</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section class="section section--paper-deep">
          <div class="container portrait-breakout">
            <div class="portrait-breakout__frame">
              <img src="{asset(prefix, 'about-full.jpg')}" alt="Carrie Jernigan full-length portrait" style="object-position: center 22%;" />
            </div>
            <div class="portrait-breakout__copy">
              <p class="eyebrow">Attorney Statement</p>
              <h2 class="section-title">Commitment Before Everything.</h2>
              <p>
                &quot;I believe that my clients&apos; success depends on my commitment to solving their problems. As your
                attorney, you can expect me to listen to you, fight for your best interest, and always give you my
                undivided attention. I will not only strive for the best possible outcome for your circumstance, but
                provide the legal representation you expect and deserve.&quot;
              </p>
              <p class="quote-slab__cite">- Carrie Jernigan</p>
            </div>
          </div>
        </section>

        <section class="section section--night">
          <div class="container associate-layout">
            <div class="portrait-breakout__frame">
              <img src="{asset(prefix, 'about-detail.jpg')}" alt="Detail portrait from the Jernigan Law Group team session" style="object-position: center 32%;" />
            </div>
            <article class="associate-card">
              <p class="eyebrow">Meet My Associate Attorney</p>
              <h2 class="section-title section-title--serif">Rebecca D. Brannon</h2>
              <p>
                My name is Rebecca D. Brannon, and I am a licensed attorney in Arkansas. I am a member of the
                Arkansas Bar Association, Crawford County Bar Association, and Sebastian County Bar Association. I grew
                up on the Arkansas-Oklahoma state line in Gans, Oklahoma. After I graduated at Gans High School, I
                received an English degree from Arkansas Tech University.
              </p>
              <p>
                I always knew that I wanted to be an attorney, and I was able to fulfill that dream when I got
                accepted into the William H. Bowen School of Law at Little Rock. Since I began the practice of law, I
                have enjoyed nothing more than helping each of my clients get through difficult times. I mainly focus
                on helping clients through family and criminal law cases, but I have also helped clients with a
                wide-variety of other issues.
              </p>
              <p>
                I am committed to helping each of my clients solve their problems, and I will strive for the best
                legal representation that each of my clients deserve.
              </p>
              <a class="btn btn--ghost-light" href="mailto:rebecca@jerniganlawgroup.com">get in touch</a>
            </article>
          </div>
        </section>
        """
    )


def services_html(prefix: str) -> str:
    return dedent(
        f"""\
        <section class="hero hero--short">
          <div class="hero__media">
            <img src="{asset(prefix, 'services-hero.jpg')}" alt="Carrie Jernigan with a member of the legal team" style="object-position: center 22%;" />
          </div>
          <div class="hero__veil"></div>
        </section>

        <section class="section section--paper-deep">
          <div class="container practice-section">
            <div class="text-stack" style="text-align:center;">
              <p class="eyebrow">AREAS OF PRACTICE</p>
            </div>
          </div>
        </section>

        <section class="section section--paper">
          <div class="container practice-section">
            <div class="practice-grid">
              <article class="practice-card">
                <h1>Personal Injury</h1>
                <ul>
                  <li>Auto + Truck Accidents</li>
                  <li>Motorcycle Accidents</li>
                  <li>Wrongful Death</li>
                  <li>Slip + Fall Accidents</li>
                </ul>
              </article>
              <article class="practice-card">
                <h2>Criminal Law</h2>
                <ul>
                  <li>All Criminal Cases</li>
                  <li>Drugs</li>
                  <li>Driving While Intoxicated</li>
                  <li>Domestic Disputes</li>
                  <li>Theft/Burglary</li>
                  <li>Felonies + All Misdemeanors</li>
                  <li>Federal + State</li>
                  <li>Murder</li>
                  <li>Fraud/Identity Theft</li>
                </ul>
              </article>
              <article class="practice-card">
                <h2>Family Law</h2>
                <ul>
                  <li>Custody</li>
                  <li>Divorce</li>
                  <li>Paternity</li>
                  <li>Adoption</li>
                  <li>Guardianships</li>
                </ul>
              </article>
            </div>
            <div class="center-actions">
              <a class="btn btn--dark" href="/contact">work with us</a>
            </div>
          </div>
        </section>
        """
    )


def contact_html(prefix: str) -> str:
    return dedent(
        f"""\
        <section class="contact-shell section--paper">
          <div class="container contact-layout">
            <div class="contact-copy">
              <p class="eyebrow">Contact</p>
              <h1>Drop a line.</h1>
              <p>_<br /><a href="tel:+14794740700">479.474.0700</a> (office)<br />479.474.0753 (fax)</p>
              <p>2501 Fayetteville Road<br />Van Buren, AR 72956</p>
            </div>
            <figure class="contact-image">
              <img src="{asset(prefix, 'contact-statue.jpg')}" alt="Lady Justice statue" />
            </figure>
          </div>
        </section>
        """
    )


def press_html(prefix: str) -> str:
    return dedent(
        f"""\
        <section class="feature-band feature-band--dark">
          <div class="feature-band__media">
            <img src="{asset(prefix, 'press-tiktok.jpg')}" alt="Carrie Jernigan with a deer at the office entrance" style="object-position: center 22%;" />
          </div>
          <div class="feature-band__veil"></div>
          <div class="feature-band__inner">
            <article class="feature-band__copy">
              <h1>TikTok</h1>
              <p class="feature-band__meta">Over 178K followers &bull; 2M+ views</p>
              <a
                class="btn btn--light"
                href="https://www.tiktok.com/@carriejernigan1?is_from_webapp=1&amp;lang=en&amp;sender_device=pc&amp;sender_web_id=6886167591246661125&amp;source=h5_m"
                target="_blank"
                rel="noopener noreferrer"
              >see more</a>
            </article>
          </div>
        </section>

        <section class="section section--paper">
          <div class="container feature-band__inner">
            <article class="feature-band__copy">
              <h2>The Payless Shoe Mom</h2>
              <p class="feature-band__meta">1 trip to the mall &bull; 1,500 pairs of shoes</p>
              <p>
                Carrie and her daughter, Harper, took a trip to Payless as they were going out of business and ended
                up purchasing 1,500 shoes to donate to a local middle school.
              </p>
              <a
                class="btn btn--dark"
                href="https://www.google.com/search?bih=758&amp;biw=1476&amp;q=carrie%20jernigan&amp;rlz=1C5CHFA_enUS745US745&amp;sa=X&amp;source=lnms&amp;sxsrf=ALeKk02L8HvnFLuR9FB-Twt9hkQgBJ4gVQ%3A1603395181698&amp;tbm=vid&amp;ved=2ahUKEwiahfXB-MjsAhXMGc0KHbKtD68Q_AUoA3oECAcQBQ"
                target="_blank"
                rel="noopener noreferrer"
              >see more</a>
            </article>
            <figure class="feature-band__frame">
              <img src="{asset(prefix, 'home-hero.jpg')}" alt="Carrie Jernigan portrait in front of the office entrance" style="object-position: center 12%;" />
            </figure>
          </div>
        </section>

        <section class="feature-band feature-band--dark">
          <div class="feature-band__media">
            <img src="{asset(prefix, 'press-instagram.jpg')}" alt="Carrie Jernigan portrait for social media" style="object-position: center 12%;" />
          </div>
          <div class="feature-band__veil"></div>
          <div class="feature-band__inner">
            <article class="feature-band__copy">
              <h2>Instagram</h2>
              <p class="feature-band__meta">3,500+ followers &bull; 1 husband &bull; 3 children</p>
              <a class="btn btn--light" href="https://www.instagram.com/carriejernigan/" target="_blank" rel="noopener noreferrer">see more</a>
            </article>
          </div>
        </section>
        """
    )


PAGES = {
    "index.html": {
        "title": page_title("Home"),
        "description": "JLaw is the Arkansas law firm site for Carrie Jernigan and Rebecca D. Brannon.",
        "prefix": "",
        "current": "home",
        "body_class": "page page-home",
        "main": home_html(""),
    },
    "home/index.html": {
        "title": page_title("Home"),
        "description": "JLaw is the Arkansas law firm site for Carrie Jernigan and Rebecca D. Brannon.",
        "prefix": "../",
        "current": "home",
        "body_class": "page page-home",
        "main": home_html("../"),
    },
    "about/index.html": {
        "title": page_title("About"),
        "description": "Meet Carrie Jernigan and Rebecca D. Brannon at JLaw.",
        "prefix": "../",
        "current": "about",
        "body_class": "page page-about",
        "main": about_html("../"),
    },
    "services/index.html": {
        "title": page_title("Services"),
        "description": "Explore the practice areas offered by JLaw.",
        "prefix": "../",
        "current": "services",
        "body_class": "page page-services",
        "main": services_html("../"),
    },
    "contact/index.html": {
        "title": page_title("Contact"),
        "description": "Contact JLaw in Van Buren, Arkansas.",
        "prefix": "../",
        "current": "contact",
        "body_class": "page page-contact",
        "main": contact_html("../"),
    },
    "press/index.html": {
        "title": page_title("Press"),
        "description": "See JLaw across TikTok, Instagram, and other press moments.",
        "prefix": "../",
        "current": "press",
        "body_class": "page page-press",
        "main": press_html("../"),
    },
}


def write_page(path: str, data: dict[str, str]) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        layout_html(
            title=data["title"],
            description=data["description"],
            prefix=data["prefix"],
            current=data["current"],
            body_class=data["body_class"],
            main_html=data["main"],
        ),
        encoding="utf-8",
    )


def main() -> None:
    for path, data in PAGES.items():
        write_page(path, data)


if __name__ == "__main__":
    main()
