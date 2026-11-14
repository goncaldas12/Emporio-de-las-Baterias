import { BranchLocations } from "../components/BranchLocations.jsx";
import { WhatsAppLink } from "../components/WhatsAppLink.jsx";

export default function About() {
  return (
    <main id="main">
      <section className="page-intro shell">
        <p className="eyebrow">SOBRE NOSOTROS</p>
        <h1>El Emporio de las Baterías.</h1>
        <p>
          Un comercio especializado en baterías para vehículos, con atención
          personalizada y distintas marcas para elegir.
        </p>
      </section>
      <section className="section shell about-layout">
        <div className="about-photo">
          <img
            src="assets/local-exterior.webp"
            alt="Fachada de El Emporio de las Baterías"
          />
        </div>
        <div className="about-text">
          <p className="eyebrow">NUESTRO LOCAL</p>
          <h2>Tu batería, con atención de gente que conoce el rubro.</h2>
          <p>
            Nos dedicamos a la venta de baterías para autos y camionetas. Te
            ayudamos a identificar qué referencia puede necesitar tu vehículo y
            a consultar las alternativas disponibles.
          </p>
          <p>
            Trabajamos con marcas como Vulcano, Moura, Willard y Varta, entre
            otras referencias según disponibilidad.
          </p>
          <WhatsAppLink className="button btn-primary" source="about">
            Contactanos →
          </WhatsAppLink>
        </div>
      </section>
      <BranchLocations />
      <section className="section shell second-photo">
        <div>
          <p className="eyebrow">VISITANOS</p>
          <h2>Conocé nuestro espacio.</h2>
          <p>
            Si querés saber qué batería lleva tu vehículo, escribinos con la
            marca, el modelo y el año.
          </p>
          <a href="buscador.html" className="arrow-link">
            Usar el buscador →
          </a>
        </div>
        <img
          src="assets/local-interior.webp"
          alt="Interior del comercio con exhibición de baterías"
        />
      </section>
    </main>
  );
}
