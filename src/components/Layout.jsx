import { useState, useRef, useLayoutEffect } from "react";
import { WhatsAppLink } from "./WhatsAppLink.jsx";
import { phoneHref, phoneDisplay, contactFormHref } from "../inquiries.js";

export function Header({ page }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(null);
  useLayoutEffect(() => {
    if (!open) return;
    const resizeMenu = () =>
      setMenuHeight(
        Math.max(
          0,
          window.innerHeight - navRef.current.getBoundingClientRect().top - 8,
        ),
      );
    resizeMenu();
    window.addEventListener("resize", resizeMenu);
    window.addEventListener("scroll", resizeMenu, { passive: true });
    return () => {
      window.removeEventListener("resize", resizeMenu);
      window.removeEventListener("scroll", resizeMenu);
    };
  }, [open]);
  return (
    <>
      <div className="topline">
        <div className="shell">
          Baterías para autos y camionetas <span>·</span> Atención personalizada
          en nuestras sedes <span>·</span>
          <a href={phoneHref}>Llamanos: {phoneDisplay}</a>
        </div>
      </div>
      <header className="header">
        <div className="shell header-in">
          <a
            className="identity"
            href="index.html"
            aria-label="El Emporio de las Baterías, inicio"
          >
            <img
              src="assets/logo-oficial.jpg"
              alt="Logo El Emporio de las Baterías"
            />
            <span>
              <b>EL EMPORIO</b>
              <small>DE LAS BATERÍAS</small>
            </span>
          </a>
          <button
            className="hamburger"
            id="menu-button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            ☰
          </button>
          <nav
            ref={navRef}
            style={
              open ? { "--menu-max-height": `${menuHeight}px` } : undefined
            }
            id="menu"
            className={`nav${open ? " open" : ""}`}
            aria-label="Navegación principal"
          >
            <a
              href="index.html"
              aria-current={page === "index" ? "page" : undefined}
            >
              Inicio
            </a>
            <a
              href="baterias.html"
              aria-current={page === "baterias" ? "page" : undefined}
            >
              Baterías
            </a>
            <a
              href="buscador.html"
              aria-current={page === "buscador" ? "page" : undefined}
            >
              Buscá tu batería
            </a>
            <a
              href="nosotros.html"
              aria-current={page === "nosotros" ? "page" : undefined}
            >
              Nosotros
            </a>
            <a
              href="contacto.html"
              aria-current={page === "contacto" ? "page" : undefined}
            >
              Contacto
            </a>
            <a className="nav-contact" href={contactFormHref()}>
              Hacer una consulta <span>↗</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-main">
          <div className="footer-logo">
            <img src="assets/logo-oficial.jpg" alt="" />
            <span>
              <b>EL EMPORIO</b>
              <small>DE LAS BATERÍAS</small>
            </span>
          </div>
          <p>
            Baterías para autos y camionetas. Encontrá tu modelo y consultá
            disponibilidad.
          </p>
        </div>
        <div>
          <b>Navegación</b>
          <a href="baterias.html">Baterías</a>
          <a href="buscador.html">Buscá tu batería</a>
          <a href="nosotros.html">Nosotros</a>
          <a href="contacto.html">Contacto</a>
        </div>
        <div>
          <b>Atención</b>
          <p>Consultas sobre modelos, compatibilidad y disponibilidad.</p>
          <a href={phoneHref} className="footer-link">
            Llamar al {phoneDisplay}
          </a>
          <a href="contacto.html#sedes">Nuestras dos sedes</a>
          <WhatsAppLink className="footer-link" source="footer">
            Escribinos ↗
          </WhatsAppLink>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © <span id="year">{new Date().getFullYear()}</span> El Emporio de las
          Baterías
        </span>
        <span>
          <a href="privacidad.html">Privacidad</a> · Sitio informativo
        </span>
      </div>
    </footer>
  );
}

export function ConsentBanner({ visible, onChoose }) {
  return (
    <div id="consent" className="consent" hidden={!visible}>
      <p>
        {"Usamos medición de visitas solo si la aceptás. "}
        <a href="privacidad.html">Política de privacidad</a>.
      </p>
      <div>
        <button
          id="consent-no"
          className="button btn-small btn-outline"
          onClick={() => onChoose("no")}
        >
          Rechazar
        </button>
        <button
          id="consent-yes"
          className="button btn-small btn-primary"
          onClick={() => onChoose("yes")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
