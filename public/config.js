// Completá únicamente datos públicos del negocio. Nunca guardes contraseñas acá.
window.SITE_CONFIG = {
  phone: "+5491123724111",
  phoneDisplay: "+54 9 11 2372-4111",
  whatsapp: "5491123724111",
  address: "", // Dirección confirmada del local
  hours: "9 a 18",
  googleMapsUrl: "",
  // En cada sede, pegá en googleMapsEmbedUrl el src del iframe de Google Maps:
  // Google Maps > Compartir > Insertar un mapa > Copiar HTML.
  // Ejemplo del formato: https://www.google.com/maps/embed?pb=...
  branches: [
    {
      id: "sede-1",
      name: "Sucursal Merlo",
      address: "",
      hours: "9 a 18",
      googleMapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52504.54752935714!2d-58.78380775451663!3d-34.66646425098076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbff3ac39d213%3A0x85d4cfc46e721359!2sEL%20EMPORIO%20DE%20LAS%20BATERIAS!5e0!3m2!1ses-419!2sar!4v1793919798860!5m2!1ses-419!2sar",
      googleMapsUrl: "https://www.google.com/maps?cid=9643561144680584025",
    },
    {
      id: "sede-2",
      name: "Sucursal Moreno",
      address: "",
      hours: "9 a 18",
      googleMapsEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42485.44266889387!2d-58.80483769334527!3d-34.67711142942408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9500915dfb31%3A0x2dc0f2d499043135!2sEL%20EMPORIO%20DE%20LAS%20BATERIAS%20Sucursal%20Moreno!5e0!3m2!1ses-419!2sar!4v1793919840766!5m2!1ses-419!2sar",
      googleMapsUrl: "https://www.google.com/maps?cid=3296901922149380405",
    },
  ],
  ga4Id: "", // Ej.: G-XXXXXXXXXX
  googleAdsId: "", // Ej.: AW-XXXXXXXXX
  googleAdsConversionLabel: "",
};
