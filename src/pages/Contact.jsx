import { ContactForm, BusinessDetails } from "../components/ContactForm.jsx";
import { BranchLocations } from "../components/BranchLocations.jsx";

export default function Contact() {
  return (
    <main id="main">
      <section className="page-intro shell">
        <p className="eyebrow">CONTACTO</p>
        <h1>Hacé tu consulta.</h1>
        <p>
          Decinos qué vehículo tenés y qué necesitás. Te ayudamos a identificar
          una batería compatible.
        </p>
      </section>
      <section className="section shell contact-layout">
        <div className="contact-card">
          <h2>Consultá por una batería</h2>
          <p>Completá los datos y consultanos directamente por WhatsApp.</p>
          <ContactForm />
        </div>
        <aside className="contact-aside">
          <img
            src="assets/local-exterior.webp"
            alt="Frente de El Emporio de las Baterías"
          />
          <h3>El Emporio de las Baterías</h3>
          <p>Atención y asesoramiento para autos y camionetas.</p>
          <BusinessDetails />
          <a href="buscador.html" className="arrow-link">
            ¿No sabés qué batería lleva? Buscala →
          </a>
        </aside>
      </section>
      <BranchLocations />
    </main>
  );
}
