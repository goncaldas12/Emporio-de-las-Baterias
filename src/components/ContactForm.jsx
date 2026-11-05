import { useLayoutEffect, useRef, useState } from "react";
import { config, track } from "../analytics.js";

export function BusinessDetails() {
  return (
    <div id="business-details">
      {config.address || config.hours ? (
        <>
          {config.address && <p>Dirección: {config.address}</p>}
          {config.hours && <p>Horarios: {config.hours}</p>}
        </>
      ) : (
        <p>Dirección y horarios: a confirmar con el comercio.</p>
      )}
    </div>
  );
}

export function ContactForm() {
  const query = new URLSearchParams(window.location.search);
  const [fields, setFields] = useState(() => ({
    name: "",
    vehicle: query.get("vehiculo") || "",
    year: "",
    engine: query.get("motor") || "",
    message: query.get("producto")
      ? `Quiero consultar precio y disponibilidad de ${query.get("producto")}.`
      : "",
  }));
  const [prepared, setPrepared] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submission, setSubmission] = useState(0);
  const resultRef = useRef(null);
  const messageRef = useRef(null);
  const inputProps = (field) => ({
    value: fields[field],
    onChange: (event) => setFields({ ...fields, [field]: event.target.value }),
  });

  useLayoutEffect(() => {
    if (submission)
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submission]);

  function submit(event) {
    event.preventDefault();
    const message =
      "Hola, quisiera consultar por una batería en El Emporio de las Baterías.\nNombre: " +
      fields.name.trim() +
      "\nVehículo: " +
      fields.vehicle.trim() +
      "\nAño: " +
      (fields.year.trim() || "No indicado") +
      "\nMotor: " +
      (fields.engine.trim() || "No indicado") +
      "\nConsulta: " +
      (fields.message.trim() || "Precio y disponibilidad");
    const number = String(config.whatsapp || "").replace(/\D/g, "");
    if (number) {
      track("whatsapp_click", { source: "contact_form" });
      window.open(
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
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
          Preparar consulta <span>→</span>
        </button>
        <p className="small-note">
          Si se configura el número oficial, se abrirá WhatsApp con tu mensaje.
          Si no, podrás copiarlo.
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
