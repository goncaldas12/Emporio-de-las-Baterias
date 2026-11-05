import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Header, Footer, ConsentBanner } from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Finder from "./pages/Finder.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Privacy from "./pages/Privacy.jsx";
import { consentKey, loadAnalytics } from "./analytics.js";
import "./styles.css";

const pages = {
  index: Home,
  baterias: Products,
  buscador: Finder,
  contacto: Contact,
  nosotros: About,
  privacidad: Privacy,
};

function App() {
  // Supports both the original .html URLs and Vercel's existing clean URLs.
  const page =
    window.location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/\.html$/, "") || "index";
  const Page = pages[page] || Home;
  const [consent, setConsent] = useState(() =>
    localStorage.getItem(consentKey),
  );

  useEffect(() => {
    if (consent === "yes") loadAnalytics();
  }, [consent]);

  function chooseConsent(value) {
    localStorage.setItem(consentKey, value);
    setConsent(value);
  }

  function resetConsent() {
    localStorage.removeItem(consentKey);
    setConsent(null);
  }

  return (
    <>
      <Header page={page} />
      <Page onResetConsent={resetConsent} />
      <Footer />
      <ConsentBanner visible={!consent} onChoose={chooseConsent} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
