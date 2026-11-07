import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://**/*", (route) => route.abort());
});

for (const [url, title] of [
  ["index.html", "La batería que tu auto necesita."],
  ["baterias.html", "Baterías para tu vehículo."],
  ["buscador.html", "Buscá tu batería."],
  ["nosotros.html", "El Emporio de las Baterías."],
  ["contacto.html", "Hacé tu consulta."],
  ["privacidad.html", "Privacidad."],
]) {
  test(`direct URL and navigation: ${url}`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${url}`);
    await expect(page.locator("h1")).toHaveText(title);
    await expect(page.locator("#year")).toHaveText(
      String(new Date().getFullYear()),
    );
    if (url !== "privacidad.html") {
      await expect(page.locator('.nav [aria-current="page"]')).toHaveAttribute(
        "href",
        url,
      );
    }
    const brokenImages = await page
      .locator("img")
      .evaluateAll(async (images) => {
        await Promise.all(
          images.map((image) => image.decode().catch(() => {})),
        );
        return images
          .filter((image) => !image.naturalWidth)
          .map((image) => image.src);
      });
    expect(brokenImages).toEqual([]);
    expect(errors).toEqual([]);
  });
}

const officialNumber = "5491123724111";
function inquiryUrl(href) {
  const url = new URL(href);
  expect(url.origin).toBe("https://wa.me");
  expect(url.pathname).toBe(`/${officialNumber}`);
  return url.searchParams.get("text");
}

test("Vulcano is first on the home page, catalog and battery selectors", async ({
  page,
}) => {
  await page.goto("/index.html");
  await expect(page.locator(".brand-tile b").first()).toHaveText("Vulcano");
  await page.goto("/baterias.html");
  await expect(page.locator(".product-card h3").first()).toHaveText(
    "Vulcano 70R",
  );
  await expect(page.locator("#product-brand option").nth(1)).toHaveText(
    "Vulcano",
  );
  await page.goto("/contacto.html");
  await expect(page.locator("#contact-product")).toHaveValue("");
  await expect(page.locator("#contact-product option").nth(1)).toHaveText(
    "Vulcano 70R",
  );
});

test("home requires all three fields and shows the result immediately after navigation", async ({
  page,
}) => {
  await page.goto("/index.html");
  await expect(page.locator("#mini-model")).toBeDisabled();
  await expect(page.locator("#mini-engine")).toBeDisabled();
  await page.selectOption("#mini-brand", "Toyota");
  await page.selectOption("#mini-model", "Hilux");
  await page.locator("#mini-finder button").click();
  await expect(page).toHaveURL(/index.html$/);
  expect(
    await page
      .locator("#mini-engine")
      .evaluate((el) => el.validity.valueMissing),
  ).toBe(true);
  await page.selectOption("#mini-engine", "2.8 Diésel");
  await page.locator("#mini-finder button").click();
  await expect(page.locator("#finder-result")).toBeVisible();
  const url = new URL(page.url());
  expect(url.searchParams.get("marca")).toBe("Toyota");
  expect(url.searchParams.get("modelo")).toBe("Hilux");
  expect(url.searchParams.get("motor")).toBe("2.8 Diésel");
  await expect(page.locator("#finder-engine")).toHaveValue("2.8 Diésel");
  await expect(page.locator(".preferred-battery strong")).toHaveText(
    "Moura M28RD / M30LD",
  );
  const message = inquiryUrl(
    await page.locator("#finder-result a").getAttribute("href"),
  );
  for (const detail of [
    "Batería: Moura M28RD / M30LD",
    "Vehículo: Toyota Hilux",
    "Motor: 2.8 Diésel",
    "Especificaciones: 12x75 / 12x90",
    "Medidas: 275×175×190 mm",
    "Referencias orientativas: Moura M28RD / M30LD",
  ])
    expect(message).toContain(detail);
  await page.reload();
  await expect(page.locator("#finder-result")).toBeVisible();
  await page.selectOption("#finder-brand", "Honda");
  await expect(page.locator("#finder-model")).toHaveValue("");
  await expect(page.locator("#finder-engine")).toBeDisabled();
  await expect(page.locator("#finder-result")).toBeHidden();
});

test("incomplete or invalid deep links do not show an unrelated battery", async ({
  page,
}) => {
  await page.goto("/buscador.html?marca=Toyota&modelo=Hilux&motor=incorrecto");
  await expect(page.locator("#finder-result")).toBeHidden();
  await expect(page.locator("#finder-engine")).toHaveValue("");
  await page.selectOption("#finder-engine", "2.8 Diésel");
  await page.locator("#finder-form button").click();
  await expect(page.locator("#finder-result")).toBeVisible();
});

test("catalog combines filters and sends the selected product and its specifications to WhatsApp", async ({
  page,
}) => {
  await page.goto("/baterias.html?marca=Moura");
  await expect(page.locator("#product-count")).toHaveText("6 modelos");
  await page.selectOption("#product-type", "camionetas");
  await expect(page.locator("#product-count")).toHaveText("2 modelos");
  await page.fill("#product-search", "sin coincidencias");
  await expect(page.locator("#product-empty")).toBeVisible();
  const emptyMessage = inquiryUrl(
    await page.locator("#product-empty a").getAttribute("href"),
  );
  expect(emptyMessage).toContain("Moura");
  expect(emptyMessage).toContain("sin coincidencias");
  await page.fill("#product-search", "diesel");
  await expect(page.locator("#product-count")).toHaveText("2 modelos");
  await page.fill("#product-search", "M30LD");
  const link = page.locator(".product-card:visible a");
  const message = inquiryUrl(await link.getAttribute("href"));
  expect(message).toContain("Batería: Moura M30LD");
  expect(message).toContain(
    "Especificaciones: Batería 12x90 · Pick-ups diésel",
  );
  expect(message).not.toContain("Vehículo:");
  expect(message).toContain(
    "¿Me pueden confirmar disponibilidad y compatibilidad?",
  );
  await expect(link).toHaveAttribute("target", "_blank");
});

test("contact opens WhatsApp with the selected battery and every completed field", async ({
  page,
}) => {
  await page.goto("/contacto.html");
  await page.evaluate(() => {
    window.open = (...args) => {
      window.opened = args;
    };
  });
  await page.selectOption("#contact-product", "Vulcano 70R");
  await page.fill("#contact-name", " Ana ");
  await page.fill("#contact-vehicle", "Toyota Corolla");
  await page.fill("#contact-year", "2018");
  await page.fill("#contact-engine", "1.8 Nafta");
  await page.fill(
    "#contact-message",
    "¿Tienen stock? Necesito confirmar medidas.",
  );
  await page.locator("#contact-form button").click();
  const opened = await page.evaluate(() => window.opened);
  const message = inquiryUrl(opened[0]);
  expect(opened[0]).toContain("%0A%0A");
  expect(message).toContain(
    "*Datos de contacto*\nNombre: Ana\n\n*Datos del vehículo*\nVehículo: Toyota Corolla\nAño: 2018\nMotor: 1.8 Nafta\n\n*Batería y especificaciones*",
  );
  expect(message).toContain(
    "\n\nConsulta: ¿Tienen stock? Necesito confirmar medidas.",
  );
  expect(message).not.toContain(
    "¿Me pueden confirmar disponibilidad y compatibilidad?",
  );
  for (const detail of [
    "Nombre: Ana",
    "Batería: Vulcano 70R",
    "Vehículo: Toyota Corolla",
    "Año: 2018",
    "Motor: 1.8 Nafta",
    "Especificaciones: Consultar medidas y compatibilidad",
    "Consulta: ¿Tienen stock? Necesito confirmar medidas.",
  ])
    expect(message).toContain(detail);
  expect(opened.slice(1)).toEqual(["_blank", "noopener,noreferrer"]);
  await expect(page.locator("#contact-result")).toBeHidden();
});

test("contact preserves supplied product and vehicle context in old direct links", async ({
  page,
}) => {
  const query = new URLSearchParams({
    producto: "Moura M22GD",
    vehiculo: "Volkswagen Gol",
    motor: "1.6 Nafta",
    anio: "2017",
    especificaciones: "12x65",
    medidas: "242×175×190 mm",
    referencias: "Moura M22GD / Willard UB620",
  });
  await page.goto(`/contacto.html?${query}`);
  await page.evaluate(() => {
    window.open = (href) => {
      window.openedHref = href;
    };
  });
  await expect(page.locator("#contact-product")).toHaveValue("Moura M22GD");
  await page.fill("#contact-name", "Ana");
  await page.locator("#contact-form button").click();
  const message = inquiryUrl(await page.evaluate(() => window.openedHref));
  for (const detail of [
    "Batería: Moura M22GD",
    "Vehículo: Volkswagen Gol",
    "Año: 2017",
    "Motor: 1.6 Nafta",
    "Especificaciones: 12x65",
    "Medidas: 242×175×190 mm",
    "Referencias orientativas: Moura M22GD / Willard UB620",
  ])
    expect(message).toContain(detail);
});

test("explicitly disabling WhatsApp retains message copying and clipboard fallback", async ({
  page,
}) => {
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: 'window.SITE_CONFIG = { whatsapp: "" };',
    }),
  );
  await page.goto(
    "/contacto.html?vehiculo=Toyota%20Hilux&motor=2.8%20Di%C3%A9sel",
  );
  await page.fill("#contact-name", "Ana");
  await page.locator("#contact-form button").click();
  await expect(page.locator("#prepared-message")).toHaveValue(
    /Vehículo: Toyota Hilux/,
  );
  await expect(page.locator("#prepared-message")).toHaveValue(
    /Nombre: Ana\n\n\*Datos del vehículo\*\nVehículo: Toyota Hilux/,
  );
  await expect(page.locator("#prepared-message")).not.toHaveValue(
    /¿Me pueden confirmar disponibilidad y compatibilidad\?/,
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedMessage = text;
        },
      },
    }),
  );
  await page.click("#copy-message");
  await expect(page.locator("#copy-feedback")).toHaveText("Mensaje copiado.");
  expect(await page.evaluate(() => window.copiedMessage)).toContain(
    "Nombre: Ana",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    }),
  );
  await page.click("#copy-message");
  await expect(page.locator("#copy-feedback")).toHaveText(
    "Seleccioná el texto y presioná Ctrl+C.",
  );
});

test("reference filters combine, reset dependent fields and include full WhatsApp context", async ({
  page,
}) => {
  await page.goto("/buscador.html");
  await expect(page.locator("#guide-count")).toHaveText("29 referencias");
  await expect(
    page.locator(".guide-references").filter({ hasText: /Vulcano/ }),
  ).toHaveCount(0);
  await page.fill("#table-query", "Vulcano");
  await expect(page.locator("#guide-count")).toHaveText("0 referencias");
  await page.fill("#table-query", "");
  await page.selectOption("#guide-brand", "Toyota");
  await expect(page.locator("#guide-count")).toHaveText("5 referencias");
  await page.selectOption("#guide-model", "Hilux");
  await page.selectOption("#guide-engine", "2.8 Diésel");
  await page.selectOption("#guide-battery", "12x75 / 12x90");
  await page.selectOption("#guide-dimensions", "275×175×190");
  await expect(page.locator("#guide-count")).toHaveText("1 referencia");
  await expect(page.locator("#guide-body tr")).toHaveCount(1);
  await expect(page.locator(".guide-references strong")).toHaveText(
    "Moura M28RD / M30LD",
  );
  const message = inquiryUrl(
    await page.locator("#guide-body a").getAttribute("href"),
  );
  expect(message).not.toContain("Vulcano");
  for (const detail of [
    "Vehículo: Toyota Hilux",
    "Motor: 2.8 Diésel",
    "Especificaciones: 12x75 / 12x90",
    "Medidas: 275×175×190 mm",
    "Moura M28RD / M30LD",
  ])
    expect(message).toContain(detail);
  await page.selectOption("#guide-brand", "Ford");
  await expect(page.locator("#guide-model")).toHaveValue("");
  await expect(page.locator("#guide-engine")).toHaveValue("");
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(page.locator("#guide-count")).toHaveText("29 referencias");
  await page.fill("#table-query", "diesel");
  await expect(page.locator("#guide-count")).toHaveText("5 referencias");
  await page.fill("#table-query", "sin coincidencias");
  await expect(page.locator("#guide-body")).toHaveText(
    "No se encontraron coincidencias.",
  );
  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await expect(page.locator("#table-query")).toHaveValue("");
  await expect(page.locator("#guide-count")).toHaveText("29 referencias");
});

test("telephone links use the official number and generic WhatsApp inquiries do not choose a battery", async ({
  page,
}) => {
  await page.goto("/contacto.html");
  const phoneLinks = page.locator('a[href^="tel:"]');
  expect(await phoneLinks.count()).toBeGreaterThanOrEqual(5);
  for (const link of await phoneLinks.all())
    await expect(link).toHaveAttribute("href", "tel:+5491123724111");
  const link = page.locator('.footer a[href^="https://wa.me/"]');
  const message = inquiryUrl(await link.getAttribute("href"));
  expect(message).not.toContain("Vulcano");
  expect(message).not.toContain("Batería:");
  await page.context().route("https://wa.me/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>WhatsApp compose link</p>",
    }),
  );
  const popupPromise = page.waitForEvent("popup");
  await link.click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  inquiryUrl(popup.url());
  await popup.close();
});

for (const url of ["contacto.html", "nosotros.html"]) {
  test(`Merlo and Moreno maps and opening hours are configured on ${url}`, async ({
    page,
  }) => {
    await page.goto(`/${url}`);
    await expect(page.locator(".branch-card")).toHaveCount(2);
    await expect(page.locator(".branch-map-placeholder")).toHaveCount(0);
    await expect(page.locator("#sedes iframe")).toHaveCount(2);
    await expect(page.locator(".branch-card h3")).toHaveText([
      "Sucursal Merlo",
      "Sucursal Moreno",
    ]);
    for (const card of await page.locator(".branch-card").all()) {
      await expect(card).toContainText("Horarios: 9 a 18");
    }
    await expect(page.locator("#sedes iframe").nth(0)).toHaveAttribute(
      "src",
      /0x95bc955bc7d1f5ad/,
    );
    await expect(page.locator("#sedes iframe").nth(1)).toHaveAttribute(
      "src",
      /0x95bc9500915dfb31/,
    );
    const mapLinks = page.getByRole("link", { name: "Ver en Google Maps ↗" });
    await expect(mapLinks.nth(0)).toHaveAttribute(
      "href",
      "https://www.google.com/maps?cid=11222734419170433436",
    );
    await expect(mapLinks.nth(1)).toHaveAttribute(
      "href",
      "https://www.google.com/maps?cid=3296901922149380405",
    );
    await page.context().route("https://www.google.com/maps?cid=*", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<p>Google Maps location</p>",
      }),
    );
    const popupPromise = page.waitForEvent("popup");
    await mapLinks.first().click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    expect(popup.url()).toBe(
      "https://www.google.com/maps?cid=11222734419170433436",
    );
    await popup.close();
    const message = inquiryUrl(
      await page.locator(".branch-actions a").first().getAttribute("href"),
    );
    expect(message).toContain("Sede: Sucursal Merlo");
  });
}

test("configured Google maps render both locations from src or iframe HTML", async ({
  page,
}) => {
  const config = {
    branches: [
      {
        id: "sede-1",
        name: "Sede de prueba uno",
        address: "Dirección de prueba uno",
        hours: "9 a 18",
        googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=prueba-uno",
        googleMapsUrl: "https://maps.app.goo.gl/prueba-uno",
      },
      {
        id: "sede-2",
        name: "Sede de prueba dos",
        googleMapsEmbedUrl:
          '<iframe src="https://www.google.com/maps/embed?pb=prueba-dos" width="600"></iframe>',
      },
    ],
  };
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.SITE_CONFIG = ${JSON.stringify(config)};`,
    }),
  );
  await page.route("https://www.google.com/maps/embed**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Map fixture</p>" }),
  );
  await page.goto("/contacto.html");
  await expect(page.locator(".branch-map iframe")).toHaveCount(2);
  await expect(page.locator(".branch-map iframe").nth(0)).toHaveAttribute(
    "src",
    "https://www.google.com/maps/embed?pb=prueba-uno",
  );
  await expect(page.locator(".branch-map iframe").nth(1)).toHaveAttribute(
    "src",
    "https://www.google.com/maps/embed?pb=prueba-dos",
  );
  await expect(page.locator(".branch-card").first()).toContainText(
    "Dirección de prueba uno",
  );
  await expect(page.locator(".branch-card").first()).toContainText(
    "Horarios: 9 a 18",
  );
  await expect(
    page.getByRole("link", { name: "Ver en Google Maps ↗" }).first(),
  ).toHaveAttribute("href", "https://maps.app.goo.gl/prueba-uno");
});

test("all six pages and navigation fit mobile, landscape, tablet and desktop", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const [width, height] of [
    [320, 720],
    [360, 740],
    [390, 844],
    [540, 900],
    [768, 1024],
    [810, 900],
    [811, 900],
    [768, 390],
    [844, 390],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    for (const path of [
      "/index.html",
      "/baterias.html",
      "/buscador.html",
      "/nosotros.html",
      "/contacto.html",
      "/privacidad.html",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow, `${path} overflows at ${width}px`).toBe(false);
      if (await page.locator("#menu-button").isVisible()) {
        await page.click("#menu-button");
        await expect(page.locator("#menu")).toBeVisible();
        const menuBounds = await page.locator("#menu").boundingBox();
        expect(
          menuBounds.y + menuBounds.height,
          `${path} menu extends below the viewport at ${width}×${height}`,
        ).toBeLessThanOrEqual(height);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          `${path} menu overflows at ${width}px`,
        ).toBe(false);
      }
      if (path === "/baterias.html") {
        const clippedLinks = await page
          .locator(".product-card .card-link")
          .evaluateAll(
            (links) =>
              links.filter((link) => {
                const bounds = link.getBoundingClientRect();
                const card = link
                  .closest(".product-card")
                  .getBoundingClientRect();
                return (
                  bounds.right > card.right + 1 || bounds.left < card.left - 1
                );
              }).length,
          );
        expect(clippedLinks, `Product links are clipped at ${width}px`).toBe(0);
      }
    }
  }
});

test("consent persists, resets and only loads analytics after acceptance", async ({
  page,
}) => {
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: 'window.SITE_CONFIG = {ga4Id: "G-TEST123", googleAdsId: "AW-123456"};',
    }),
  );
  await page.goto("/privacidad.html");
  await expect(page.locator("#consent")).toBeVisible();
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  await page.click("#consent-no");
  await page.reload();
  await expect(page.locator("#consent")).toBeHidden();
  expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
  await page.click("#reset-consent");
  await expect(page.locator("#consent")).toBeVisible();
  await page.click("#consent-yes");
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  expect(
    await page.evaluate(() => localStorage.getItem("emporio-cookie-consent")),
  ).toBe("yes");
  await page.reload();
  await expect(page.locator("#consent")).toBeHidden();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
});

test("mobile menu toggles and keeps all pages accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  await expect(page.locator("#menu")).toBeHidden();
  await page.click("#menu-button");
  await expect(page.locator("#menu-button")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.locator("#menu")).toBeVisible();
  await page.locator('#menu a[href="baterias.html"]').click();
  await expect(page.locator("h1")).toHaveText("Baterías para tu vehículo.");
  await expect(page.locator("#menu-button")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

for (const source of ["header", "finder-sidebar"]) {
  test(`${source} inquiry opens the contact form before WhatsApp`, async ({
    page,
  }) => {
    await page.goto(
      "/buscador.html?marca=Toyota&modelo=Hilux&motor=2.8+Di%C3%A9sel",
    );
    const button =
      source === "header"
        ? page.locator(".nav-contact")
        : page.locator(".finder-side .arrow-link");
    await expect(button).not.toHaveAttribute("target", "_blank");
    await button.click();
    await expect(page).toHaveURL(/contacto\.html/);
    await expect(page.locator("#contact-form")).toBeVisible();
    await page.evaluate(() => {
      window.open = (...args) => {
        window.opened = args;
      };
    });
    const submit = page.locator('#contact-form button[type="submit"]');
    await submit.click();
    expect(await page.evaluate(() => window.opened)).toBeUndefined();
    await page.fill("#contact-name", "   ");
    await page.fill("#contact-vehicle", "Toyota Hilux");
    await submit.click();
    expect(await page.evaluate(() => window.opened)).toBeUndefined();
    expect(
      await page
        .locator("#contact-name")
        .evaluate((el) => el.validity.customError),
    ).toBe(true);
    await page.fill("#contact-name", "Ana");
    await page.fill("#contact-vehicle", "   ");
    await submit.click();
    expect(await page.evaluate(() => window.opened)).toBeUndefined();
    expect(
      await page
        .locator("#contact-vehicle")
        .evaluate((el) => el.validity.customError),
    ).toBe(true);
    await page.fill("#contact-vehicle", "Toyota Hilux");
    await page.fill("#contact-year", "2019");
    await page.fill("#contact-engine", "2.8 Diésel");
    await page.fill(
      "#contact-message",
      "Necesito confirmar precio y disponibilidad.",
    );
    await submit.click();
    const opened = await page.evaluate(() => window.opened);
    const message = inquiryUrl(opened[0]);
    for (const detail of [
      "Nombre: Ana",
      "Vehículo: Toyota Hilux",
      "Año: 2019",
      "Motor: 2.8 Diésel",
      "Consulta: Necesito confirmar precio y disponibilidad.",
    ])
      expect(message).toContain(detail);
    expect(message).not.toContain("Vulcano");
    if (source === "finder-sidebar") {
      expect(message).toContain("Batería: Moura M28RD / M30LD");
      expect(message).toContain("Especificaciones: 12x75 / 12x90");
      expect(message).toContain("Medidas: 275×175×190 mm");
    } else {
      expect(message).not.toContain("Batería:");
    }
  });
}

test("sidebar carries the selected vehicle into the form and clears outdated battery context", async ({
  page,
}) => {
  await page.goto("/buscador.html");
  await page.selectOption("#finder-brand", "Toyota");
  await page.selectOption("#finder-model", "Hilux");
  await page.selectOption("#finder-engine", "2.8 Diésel");
  await page.locator(".finder-side .arrow-link").click();
  await expect(page.locator("#contact-vehicle")).toHaveValue("Toyota Hilux");
  await expect(page.locator("#contact-engine")).toHaveValue("2.8 Diésel");
  await expect(page.locator("#contact-product")).toHaveValue(
    "Moura M28RD / M30LD",
  );
  await page.goBack();
  await page.selectOption("#finder-brand", "Honda");
  await page.locator(".finder-side .arrow-link").click();
  await expect(page.locator("#contact-vehicle")).toHaveValue("Honda");
  await expect(page.locator("#contact-engine")).toHaveValue("");
  await expect(page.locator("#contact-product")).toHaveValue("");
});

test("map buttons never reuse embed URLs when public links are missing or misconfigured", async ({
  page,
}) => {
  await page.goto("/contacto.html");
  const config = await page.evaluate(() => window.SITE_CONFIG);
  config.branches[0].googleMapsUrl = "";
  config.branches[1].googleMapsUrl = config.branches[1].googleMapsEmbedUrl;
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.SITE_CONFIG = ${JSON.stringify(config)};`,
    }),
  );
  await page.reload();
  const links = page.getByRole("link", { name: "Ver en Google Maps ↗" });
  await expect(links.nth(0)).toHaveAttribute(
    "href",
    "https://www.google.com/maps?cid=11222734419170433436",
  );
  await expect(links.nth(1)).toHaveAttribute(
    "href",
    "https://www.google.com/maps?cid=3296901922149380405",
  );
});
