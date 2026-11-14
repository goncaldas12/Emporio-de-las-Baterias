import { config } from "../analytics.js";
import { phoneDisplay, phoneHref } from "../inquiries.js";
import { WhatsAppLink } from "./WhatsAppLink.jsx";

export function getMapEmbedUrl(value) {
  // Accept the copied src URL or the entire Google iframe, without injecting HTML.
  const source = String(value || "").trim();
  const urlString =
    source.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] || source;
  try {
    const url = new URL(urlString.replace(/&amp;/g, "&"));
    return url.protocol === "https:" &&
      ["www.google.com", "google.com", "maps.google.com"].includes(
        url.hostname,
      ) &&
      /^\/maps\/embed(?:\/|$)/.test(url.pathname)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export function getMapLocationUrl(branch) {
  try {
    const url = new URL(branch.googleMapsUrl);
    if (
      url.protocol === "https:" &&
      [
        "www.google.com",
        "google.com",
        "maps.google.com",
        "maps.app.goo.gl",
        "goo.gl",
      ].includes(url.hostname) &&
      !getMapEmbedUrl(url.href) &&
      url.searchParams.get("output") !== "embed"
    )
      return url.href;
  } catch {
    /* Build a public location link from the embedded place below. */
  }

  const embedUrl =
    getMapEmbedUrl(branch.googleMapsUrl) ||
    getMapEmbedUrl(branch.googleMapsEmbedUrl);
  if (embedUrl) {
    // Preserve the exact business identified by the Google map's feature ID.
    const featureId = new URL(embedUrl).searchParams
      .get("pb")
      ?.match(/!1s0x[0-9a-f]+:(0x[0-9a-f]+)(?:!|$)/i)?.[1];
    if (featureId)
      return `https://www.google.com/maps?cid=${BigInt(featureId).toString()}`;
  }

  const query =
    branch.address ||
    (branch.name ? `El Emporio de las Baterías ${branch.name}` : "");
  if (!query) return "";
  const params = new URLSearchParams({ api: "1", query });
  return `https://www.google.com/maps/search/?${params}`;
}

export const branches = config.branches?.length
  ? config.branches
  : [
      {
        id: "sede-1",
        name: "Sede 1",
        address: config.address,
        hours: config.hours,
        googleMapsUrl: config.googleMapsUrl,
      },
      { id: "sede-2", name: "Sede 2" },
    ];

export function BranchLocations() {
  return (
    <section
      className="section shell branch-section"
      id="sedes"
      aria-labelledby="branches-title"
    >
      <div className="section-head">
        <div>
          <p className="eyebrow">VENÍ A VISITARNOS</p>
          <h2 id="branches-title">Nuestras dos sedes.</h2>
          <p>Atención y asesoramiento para encontrar tu próxima batería.</p>
        </div>
      </div>
      <div className="branch-grid">
        {branches.map((branch, index) => {
          const name = branch.name || `Sede ${index + 1}`;
          const mapUrl = getMapEmbedUrl(branch.googleMapsEmbedUrl);
          const directionsUrl = getMapLocationUrl(branch);
          return (
            <article className="branch-card" key={branch.id || index}>
              <div className="branch-map">
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    title={`Ubicación de ${name} en Google Maps`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="branch-map-placeholder">
                    <svg
                      viewBox="0 0 48 48"
                      width="48"
                      height="48"
                      aria-hidden="true"
                    >
                      <path
                        d="M24 43S8 29 8 18a16 16 0 1 1 32 0c0 11-16 25-16 25Z"
                        fill="currentColor"
                      />
                      <circle cx="24" cy="18" r="6" fill="white" />
                    </svg>
                    <strong>{name}</strong>
                    <span>Ubicación próximamente</span>
                  </div>
                )}
              </div>
              <div className="branch-body">
                <p className="eyebrow">EL EMPORIO DE LAS BATERÍAS</p>
                <h3>{name}</h3>
                {branch.address && <p>{branch.address}</p>}
                {branch.hours && <p>Horarios: {branch.hours}</p>}
                <a className="branch-phone" href={phoneHref}>
                  Llamar al {phoneDisplay}
                </a>
                <div className="branch-actions">
                  <WhatsAppLink
                    className="button btn-primary"
                    inquiry={{ branch: name }}
                    source={`branch_${branch.id || index}`}
                  >
                    Consultar por esta sede ↗
                  </WhatsAppLink>
                  {directionsUrl && (
                    <a
                      className="arrow-link"
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en Google Maps ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
