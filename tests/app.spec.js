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

test("home finder keeps query parameters, suggests a battery and prefills contact", async ({
  page,
}) => {
  await page.goto("/index.html");
  await expect(page.locator("#mini-model")).toBeDisabled();
  await page.selectOption("#mini-brand", "Toyota");
  await page.selectOption("#mini-model", "Hilux");
  await page.locator("#mini-finder button").click();
  await expect(page).toHaveURL(/buscador\.html\?marca=Toyota&modelo=Hilux/);
  await expect(page.locator("#finder-brand")).toHaveValue("Toyota");
  await expect(page.locator("#finder-model")).toHaveValue("Hilux");
  await page.selectOption("#finder-engine", "2.8 Diésel");
  await page.locator("#finder-form button").click();
  await expect(page.locator("#finder-result")).toContainText(
    "Moura M28RD / M30LD",
  );
  await page.locator("#finder-result a").click();
  await expect(page.locator("#contact-vehicle")).toHaveValue("Toyota Hilux");
  await expect(page.locator("#contact-engine")).toHaveValue("2.8 Diésel");
});

test("finder resets dependent selectors and searches the guide without accents", async ({
  page,
}) => {
  await page.goto("/buscador.html?marca=Toyota&modelo=Hilux");
  await page.selectOption("#finder-engine", "2.8 Diésel");
  await page.selectOption("#finder-brand", "Honda");
  await expect(page.locator("#finder-model")).toHaveValue("");
  await expect(page.locator("#finder-engine")).toBeDisabled();
  await page.fill("#table-query", "diesel");
  await expect(page.locator("#guide-count")).toHaveText("5 referencias");
  await page.fill("#table-query", "sin coincidencias");
  await expect(page.locator("#guide-body")).toHaveText(
    "No se encontraron coincidencias.",
  );
  await expect(page.locator("#guide-count")).toHaveText("0 referencias");
});

test("catalog combines URL brand, category and search; product link prefills contact", async ({
  page,
}) => {
  await page.goto("/baterias.html?marca=Moura");
  await expect(page.locator("#product-count")).toHaveText("6 modelos");
  await page.selectOption("#product-type", "camionetas");
  await expect(page.locator("#product-count")).toHaveText("2 modelos");
  await page.fill("#product-search", "sin coincidencias");
  await expect(page.locator("#product-empty")).toBeVisible();
  await page.fill("#product-search", "diesel");
  await expect(page.locator("#product-count")).toHaveText("2 modelos");
  await page.fill("#product-search", "M30LD");
  await expect(page.locator(".product-card:visible h3")).toHaveText(
    "Moura M30LD",
  );
  await page.locator(".product-card:visible a").click();
  await expect(page.locator("#contact-message")).toHaveValue(
    "Quiero consultar precio y disponibilidad de Moura M30LD.",
  );
});

test("contact prepares the same message and supports clipboard and fallback", async ({
  page,
}) => {
  await page.goto(
    "/contacto.html?vehiculo=Toyota%20Hilux&motor=2.8%20Di%C3%A9sel",
  );
  await page.fill("#contact-name", " Ana ");
  await page.locator("#contact-form button").click();
  await expect(page.locator("#prepared-message")).toHaveValue(
    "Hola, quisiera consultar por una batería en El Emporio de las Baterías.\nNombre: Ana\nVehículo: Toyota Hilux\nAño: No indicado\nMotor: 2.8 Diésel\nConsulta: Precio y disponibilidad",
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

test("configured WhatsApp and business details preserve their behavior", async ({
  page,
}) => {
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: 'window.SITE_CONFIG = { whatsapp: "+54 9 11 1234-5678", address: "Dirección de prueba", hours: "9 a 18" };',
    }),
  );
  await page.goto("/contacto.html");
  await expect(page.locator("#business-details")).toHaveText(
    "Dirección: Dirección de pruebaHorarios: 9 a 18",
  );
  await page.evaluate(() => {
    window.open = (...args) => {
      window.opened = args;
    };
  });
  await page.fill("#contact-name", "Ana");
  await page.fill("#contact-vehicle", "Toyota Hilux");
  await page.locator("#contact-form button").click();
  const opened = await page.evaluate(() => window.opened);
  expect(opened[0]).toMatch(/^https:\/\/wa.me\/5491112345678\?text=/);
  expect(decodeURIComponent(opened[0])).toContain("Vehículo: Toyota Hilux");
  expect(opened.slice(1)).toEqual(["_blank", "noopener,noreferrer"]);
  await expect(page.locator("#contact-result")).toBeHidden();
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
