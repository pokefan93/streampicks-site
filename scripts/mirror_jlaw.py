#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path
from urllib.request import Request, urlopen


BASE_URL = "https://www.jerniganlawgroup.com"
PAGES = {
    "": "",
    "home": "home",
    "about": "about",
    "services": "services",
    "contact": "contact",
    "press": "press",
}
ROOT = Path(__file__).resolve().parent.parent
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0.0.0 Safari/537.36"
)
PROTOCOL_RELATIVE_HOSTS = (
    "assets.squarespace.com",
    "definitions.sqspcdn.com",
    "images.squarespace-cdn.com",
    "p.typekit.net",
    "static1.squarespace.com",
    "use.typekit.net",
)
ENHANCEMENT_STYLESHEET = '/assets/jlaw-enhance.css'
ENHANCEMENT_SCRIPT = '/assets/jlaw-enhance.js'
FONT_PRELOADS = (
    "/assets/fonts/aktiv-grotesk-extended-400-normal.woff2",
    "/assets/fonts/aktiv-grotesk-extended-700-normal.woff2",
    "/assets/fonts/aktiv-grotesk-extended-400-italic.woff2",
    "/assets/fonts/aktiv-grotesk-extended-700-italic.woff2",
)


def fetch_text(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request) as response:
        return response.read().decode("utf-8")


def local_route(path: str) -> str:
    return "/" if not path else f"/{path}"


def rewrite_protocol_relative_urls(html: str) -> str:
    pattern = re.compile(
        r"(?<!:)//(" + "|".join(re.escape(host) for host in PROTOCOL_RELATIVE_HOSTS) + r")"
    )
    html = pattern.sub(r"https://\1", html)
    html = html.replace("http://static1.squarespace.com", "https://static1.squarespace.com")
    html = html.replace("http://images.squarespace-cdn.com", "https://images.squarespace-cdn.com")
    return html


def rewrite_internal_absolute_urls(html: str) -> str:
    bases = (BASE_URL, BASE_URL.replace("://www.", "://"))
    for remote_path, local_path in PAGES.items():
        route = local_route(local_path)
        for base in bases:
            full = base if not remote_path else f"{base}/{remote_path}"
            html = html.replace(f'"{full}"', f'"{route}"')
            html = html.replace(f'"{full}/"', f'"{route}/"')
            html = html.replace(f"'{full}'", f"'{route}'")
            html = html.replace(f"'{full}/'", f"'{route}/'")
    return html


def inject_enhancements(html: str) -> str:
    missing_preloads = [font_path for font_path in FONT_PRELOADS if font_path not in html]
    if missing_preloads:
        preload_tags = "\n".join(
            f'  <link rel="preload" href="{font_path}" as="font" type="font/woff2" crossorigin/>'
            for font_path in missing_preloads
        )
        html = html.replace("</head>", f"{preload_tags}\n</head>", 1)

    if ENHANCEMENT_STYLESHEET not in html:
        html = html.replace(
            "</head>",
            f'  <link rel="stylesheet" href="{ENHANCEMENT_STYLESHEET}"/>\n</head>',
            1,
        )

    if ENHANCEMENT_SCRIPT not in html:
        html = html.replace(
            "</body>",
            f'  <script defer src="{ENHANCEMENT_SCRIPT}"></script>\n</body>',
            1,
        )

    return html


def write_page(path: str, html: str) -> None:
    if path:
        destination = ROOT / path / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
    else:
        destination = ROOT / "index.html"
    destination.write_text(html, encoding="utf-8")


def build_cart_redirect() -> None:
    destination = ROOT / "cart" / "index.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=https://www.jerniganlawgroup.com/cart">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redirecting...</title>
    <script>
      window.location.replace("https://www.jerniganlawgroup.com/cart");
    </script>
  </head>
  <body>
    <p><a href="https://www.jerniganlawgroup.com/cart">Continue to cart</a></p>
  </body>
</html>
""",
        encoding="utf-8",
    )


def main() -> None:
    for remote_path, local_path in PAGES.items():
        url = BASE_URL if not remote_path else f"{BASE_URL}/{remote_path}"
        html = fetch_text(url)
        html = rewrite_protocol_relative_urls(html)
        html = rewrite_internal_absolute_urls(html)
        html = inject_enhancements(html)
        write_page(local_path, html)

    build_cart_redirect()


if __name__ == "__main__":
    main()
