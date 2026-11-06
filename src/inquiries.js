import { config } from "./analytics.js";

export const phoneHref = `tel:+${String(config.phone).replace(/\D/g, "")}`;
export const phoneDisplay = config.phoneDisplay || config.phone;

export function vehicleInquiry(row) {
  return {
    battery: row[5],
    vehicle: `${row[0]} ${row[1]}`,
    engine: row[2],
    specifications: row[3],
    dimensions: `${row[4]} mm`,
    references: row[5],
  };
}

export function productInquiry(product) {
  return { battery: product.name, specifications: product.description };
}

export function contactFormHref(inquiry = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({
    producto: inquiry.battery,
    vehiculo: inquiry.vehicle,
    motor: inquiry.engine,
    anio: inquiry.year,
    especificaciones: inquiry.specifications,
    medidas: inquiry.dimensions,
    referencias: inquiry.references,
    sede: inquiry.branch,
    consulta: inquiry.message,
  })) {
    if (String(value || "").trim()) params.set(key, String(value).trim());
  }
  return `contacto.html${params.size ? `?${params}` : ""}`;
}

export function buildInquiryMessage(
  inquiry = {},
  { includeCompatibilityQuestion = true, format = "compact" } = {},
) {
  const fields = [
    ["Nombre", inquiry.name],
    ["Batería", inquiry.battery],
    ["Vehículo", inquiry.vehicle],
    ["Año", inquiry.year],
    ["Motor", inquiry.engine],
    ["Especificaciones", inquiry.specifications],
    ["Medidas", inquiry.dimensions],
    ["Referencias orientativas", inquiry.references],
    ["Sede", inquiry.branch],
    ["Consulta", inquiry.message],
  ];
  const completed = fields.filter(([, value]) => String(value || "").trim());
  const renderFields = (values) =>
    values
      .map(
        ([label, value]) =>
          `${label}: ${String(value).trim().replace(/\r\n?/g, "\n")}`,
      )
      .join("\n");
  const sections =
    format === "sections"
      ? [
          ["Datos de contacto", ["Nombre", "Sede"]],
          ["Datos del vehículo", ["Vehículo", "Año", "Motor"]],
          [
            "Batería y especificaciones",
            [
              "Batería",
              "Especificaciones",
              "Medidas",
              "Referencias orientativas",
            ],
          ],
          ["", ["Consulta"]],
        ]
          .map(([heading, labels]) => {
            const values = completed.filter(([label]) =>
              labels.includes(label),
            );
            return values.length
              ? `${heading ? `*${heading}*\n` : ""}${renderFields(values)}`
              : "";
          })
          .filter(Boolean)
      : completed.map((field) => renderFields([field]));
  return [
    "Hola, quisiera consultar precio y disponibilidad de una batería en El Emporio de las Baterías.",
    ...sections,
    ...(includeCompatibilityQuestion
      ? ["¿Me pueden confirmar disponibilidad y compatibilidad?"]
      : []),
  ].join(format === "sections" ? "\n\n" : "\n");
}

export function whatsappHref(inquiry = {}, options) {
  const number = String(config.whatsapp || "").replace(/\D/g, "");
  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(buildInquiryMessage(inquiry, options))}`
    : "";
}
