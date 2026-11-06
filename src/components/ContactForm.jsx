import { useLayoutEffect, useRef, useState } from "react";
import { config, track } from "../analytics.js";
import {
  buildInquiryMessage,
  whatsappHref,
  phoneDisplay,
  phoneHref,
} from "../inquiries.js";
import { products } from "../data/products.js";

export function BusinessDetails() {
  return (
    <div id="business-details">
      <a className="contact-phone" href={phoneHref}>
        Llamanos al {phoneDisplay}
      </a>
      {config.address || config.hours ? (
        <>
          {config.address && <p>Dirección: {config.address}</p>}
          {config.hours && <p>Horarios: {config.hours}</p>}
        </>
      ) : (
        <p>Encontranos en nuestras dos sedes.</p>
      )}
      <a className="arrow-link" href="#sedes">
        Ver sedes y ubicaciones →
      </a>
    </div>
  );
}

export function ContactForm() {
  const query = new URLSearchParams(window.location.search);
  const [fields, setFields] = useState(() => ({
    name: "",
    battery: query.get("producto") || "",
    specifications: query.get("especificaciones") || "",
    dimensions: query.get("medidas") || "",
    references: query.get("referencias") || "",
    vehicle: query.get("vehiculo") || "",
    year: query.get("anio") || "",
    engine: query.get("motor") || "",
    message: query.get("consulta") || "",
    branch: query.get("sede") || "",
  }));
  const [prepared, setPrepared] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submission, setSubmission] = useState(0);
  const resultRef = useRef(null);
  const messageRef = useRef(null);
  const inputProps = (field) => ({
    name: field,
    value: fields[field],
    onChange: (event) => {
      event.target.setCustomValidity("");
      setFields({ ...fields, [field]: event.target.value });
    },
  });

  useLayoutEffect(() => {
    if (submission)
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submission]);

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    for (const [field, message] of [
      ["name", "Ingresá tu nombre."],
      ["vehicle", "Ingresá la marca y el modelo del vehículo."],
    ]) {
      form.elements
        .namedItem(field)
        .setCustomValidity(fields[field].trim() ? "" : message);
    }
    if (!form.reportValidity()) return;
    const product = products.find((product) => product.name === fields.battery);
    const inquiry = {
      ...fields,
      specifications: fields.specifications || product?.description,
    };
    const messageOptions = {
      includeCompatibilityQuestion: false,
      format: "sections",
    };
    const message = buildInquiryMessage(inquiry, messageOptions);
    const href = whatsappHref(inquiry, messageOptions);
    if (href) {
      track("whatsapp_click", { source: "contact_form" });
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      setPrepared(message);
      setSubmission((value) => value + 1);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(prepared);
      setFeedback("Mensaje copiado.");
    } catch {
      messageRef.current.select();
      setFeedback("Seleccioná el texto y presioná Ctrl+C.");
    }
  }

  return (
    <>
      <form id="contact-form" className="contact-form" onSubmit={submit}>
        <label>
          Batería que te interesa
          <select
            id="contact-product"
            name="battery"
            value={fields.battery}
            onChange={(event) =>
              setFields({
                ...fields,
                battery: event.target.value,
                specifications: "",
                dimensions: "",
                references: "",
              })
            }
          >
            <option value="">No sé el modelo / Consultar</option>
            {products.map((product) => (
              <option key={product.name} value={product.name}>
                {product.name}
              </option>
            ))}
            {fields.battery &&
              !products.some((product) => product.name === fields.battery) && (
                <option value={fields.battery}>{fields.battery}</option>
              )}
          </select>
        </label>
        <label>
          Tu nombre <span>*</span>
          <input
            id="contact-name"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            {...inputProps("name")}
          />
        </label>
        <label>
          Marca y modelo del vehículo <span>*</span>
          <input
            id="contact-vehicle"
            required
            placeholder="Ej.: Volkswagen Gol"
            {...inputProps("vehicle")}
          />
        </label>
        <div className="two-fields">
          <label>
            Año
            <input
              id="contact-year"
              inputMode="numeric"
              maxLength="4"
              placeholder="Ej.: 2018"
              {...inputProps("year")}
            />
          </label>
          <label>
            Motorización
            <input
              id="contact-engine"
              placeholder="Ej.: 1.6 nafta"
              {...inputProps("engine")}
            />
          </label>
        </div>
        <label>
          ¿En qué podemos ayudarte?
          <textarea
            id="contact-message"
            rows="4"
            placeholder="Contanos qué necesitás"
            {...inputProps("message")}
          />
        </label>
        <button className="button btn-primary" type="submit">
          Consultar por WhatsApp <span>↗</span>
        </button>
        <p className="small-note">
          Se abrirá WhatsApp con tu mensaje escrito. Revisalo y enviá la
          consulta.
        </p>
      </form>
      <div
        id="contact-result"
        className="copy-panel"
        hidden={!submission}
        ref={resultRef}
      >
        <h3>Tu mensaje está listo</h3>
        <textarea
          id="prepared-message"
          rows="7"
          readOnly
          value={prepared}
          ref={messageRef}
        />
        <button
          className="button btn-dark"
          id="copy-message"
          type="button"
          onClick={copyMessage}
        >
          Copiar mensaje
        </button>
        <p id="copy-feedback" role="status">
          {feedback}
        </p>
      </div>
    </>
  );
}
