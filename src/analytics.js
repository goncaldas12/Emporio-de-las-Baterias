export const config = window.SITE_CONFIG || {};
export const consentKey = "emporio-cookie-consent";

export function loadAnalytics() {
  const ids = [config.ga4Id, config.googleAdsId].filter((id) =>
    /^(G-[A-Z0-9]+|AW-[0-9]+)$/.test(id || ""),
  );
  if (!ids.length || window.__analyticsLoaded) return;
  window.__analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  ids.forEach((id) => window.gtag("config", id));
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`;
  document.head.append(script);
}

export function track(name, params) {
  if (
    localStorage.getItem(consentKey) === "yes" &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", name, params);
  }
}
