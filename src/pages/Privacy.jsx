export default function Privacy({ onResetConsent }) {
  return (
    <main id="main">
      <section className="page-intro shell">
        <p className="eyebrow">INFORMACIÓN DEL SITIO</p>
        <h1>Privacidad.</h1>
        <p>Información básica sobre los datos y la medición de visitas.</p>
      </section>
      <section className="section shell text-page">
        <h2>Consultas</h2>
        <p>
          Los datos que completás en los formularios se utilizan para armar un
          mensaje que vos elegís enviar. El sitio no almacena las consultas en
          un servidor propio.
        </p>
        <h2>Medición</h2>
        <p>
          El sitio está preparado para Google Analytics y Google Ads, que se
          activarán cuando el responsable configure los identificadores
          correspondientes y aceptes la medición. Las cookies de medición no se
          cargan antes de tu consentimiento.
        </p>
        <h2>Contacto</h2>
        <p>
          Para cualquier consulta sobre el uso de datos, comunicate con el
          comercio mediante la <a href="contacto.html">página de contacto</a>.
        </p>
        <button
          id="reset-consent"
          className="button btn-outline"
          type="button"
          onClick={onResetConsent}
        >
          Cambiar preferencia de cookies
        </button>
        <p className="small-note">
          Este texto deberá revisarse antes de lanzar campañas y activar
          servicios de terceros.
        </p>
      </section>
    </main>
  );
}
