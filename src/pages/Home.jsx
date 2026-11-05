import { VehicleFinder } from "../components/VehicleFinder.jsx";

export default function Home() {
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="kicker">
            <span className="kicker-line"></span> ESPECIALISTAS EN BATERÍAS
          </p>
          <h1>La batería que tu auto necesita.</h1>
          <p className="lead">
            Trabajamos con marcas reconocidas para autos y camionetas. Te
            ayudamos a encontrar la opción correcta para tu vehículo.
          </p>
          <div className="hero-actions">
            <a className="button btn-primary" href="buscador.html">
              Buscá tu batería <span>→</span>
            </a>
            <a className="button btn-white" href="baterias.html">
              Ver baterías
            </a>
          </div>
          <div className="hero-caption">
            <span className="tick">✓</span> Asesoramiento para elegir la batería
            adecuada
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="assets/local-exterior.webp"
            alt="Frente del local de El Emporio de las Baterías"
          />
          <span className="photo-caption">NUESTRO LOCAL</span>
        </div>
      </section>
      <section className="search-strip">
        <div className="shell strip-layout">
          <div>
            <p className="eyebrow light">ENCONTRÁ TU BATERÍA</p>
            <h2>¿Qué vehículo tenés?</h2>
            <p>Elegí la marca y el modelo para ver una referencia.</p>
          </div>
          <VehicleFinder mini />
        </div>
      </section>
      <section className="section shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">PRODUCTOS</p>
            <h2>Marcas que trabajamos</h2>
            <p>Baterías para distintos tipos de vehículos y necesidades.</p>
          </div>
          <a href="baterias.html" className="arrow-link">
            Ver todas las baterías <span>→</span>
          </a>
        </div>
        <div className="brand-grid">
          <a className="brand-tile" href="baterias.html?marca=Moura">
            <img src="assets/moura.webp" alt="Batería Moura" />
            <span>
              <b>Moura</b>
              <small>Consultar modelos →</small>
            </span>
          </a>
          <a className="brand-tile" href="baterias.html?marca=Willard">
            <img src="assets/willard.webp" alt="Batería Willard" />
            <span>
              <b>Willard</b>
              <small>Consultar modelos →</small>
            </span>
          </a>
          <a className="brand-tile" href="baterias.html?marca=Varta">
            <img src="assets/varta.webp" alt="Batería Varta" />
            <span>
              <b>Varta</b>
              <small>Consultar modelos →</small>
            </span>
          </a>
          <a className="brand-tile" href="baterias.html?marca=Vulcano">
            <img src="assets/vulcano.webp" alt="Batería Vulcano" />
            <span>
              <b>Vulcano</b>
              <small>Consultar modelos →</small>
            </span>
          </a>
        </div>
      </section>
      <section className="feature-panel">
        <div className="shell feature-layout">
          <img
            src="assets/local-interior.webp"
            alt="Interior del local y exhibición de baterías"
          />
          <div>
            <p className="eyebrow">EL EMPORIO DE LAS BATERÍAS</p>
            <h2>Un local dedicado a las baterías.</h2>
            <p>
              Atención directa y asesoramiento para encontrar una batería
              compatible con tu auto o camioneta.
            </p>
            <a href="nosotros.html" className="button btn-dark">
              Conocé el local <span>→</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section shell last-cta">
        <div>
          <p className="eyebrow">¿NECESITÁS ASESORAMIENTO?</p>
          <h2>Contanos qué auto tenés.</h2>
          <p>Con la marca, el modelo y el año podemos orientarte mejor.</p>
        </div>
        <a className="button btn-primary" href="contacto.html">
          Hacer una consulta →
        </a>
      </section>
    </main>
  );
}
