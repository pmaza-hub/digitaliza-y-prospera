/* CONFIGURACIÓN: reemplaza estos valores antes de publicar. WhatsApp en formato internacional, solo números. */
const WHATSAPP_NUMBER = "529983205196";
const BUSINESS_EMAIL = "atencion.finanza@gmail.com";
const FINANZA_URL = "https://pmaza-hub.github.io/web-Finanza/"; // Sitio oficial de FINANZA.
const BASE_MESSAGE = "Hola, me interesa conocer los servicios de Digitaliza y Próspera. Tipo de negocio: ____. Colonia/ubicación: ____. Servicio que me interesa: _____.";

/* Analítica opcional: si existe Google Tag Manager, envía eventos a dataLayer. */
function trackEvent(eventName, details = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...details });
  window.dispatchEvent(new CustomEvent("digitaliza:analytics", { detail: { event: eventName, ...details } }));
}
function makeWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function validWhatsApp() {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER) && !WHATSAPP_NUMBER.includes("X");
}
function openWhatsApp(message, service = "consulta_general") {
  trackEvent("whatsapp_click", { service });
  if (!validWhatsApp()) {
    alert("Antes de publicar, configura el número oficial de WhatsApp en la constante WHATSAPP_NUMBER del archivo script.js.");
    return;
  }
  window.open(makeWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

document.querySelectorAll(".whatsapp-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(BASE_MESSAGE);
  });
});
document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const service = link.dataset.service;
    const message = `Hola, me interesa el servicio: ${service}. Tipo de negocio: ____. Colonia/ubicación: ____. ¿Me pueden compartir qué incluye, el precio final (incluido el IVA, si aplica) y los siguientes pasos?`;
    openWhatsApp(message, service);
  });
});
const mainWhatsapp = document.getElementById("mainWhatsapp");
if (mainWhatsapp) mainWhatsapp.addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp(BASE_MESSAGE);
});

const emailLink = document.getElementById("emailLink");
if (emailLink) {
  if (BUSINESS_EMAIL) {
    emailLink.href = `mailto:${BUSINESS_EMAIL}`;
    const small = emailLink.querySelector("small");
    if (small) small.textContent = BUSINESS_EMAIL;
  } else {
    emailLink.addEventListener("click", event => {
      event.preventDefault();
      alert("Configura el correo oficial en la constante BUSINESS_EMAIL del archivo script.js antes de publicar.");
    });
  }
}
if (FINANZA_URL) {
  document.querySelectorAll('[href="#finanzas"]').forEach(link => {
    if (link.dataset.service && link.dataset.service.includes("financiera")) {
      link.href = FINANZA_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const menuBtn = document.getElementById("menuBtn");
const navlinks = document.getElementById("navlinks");
if (menuBtn && navlinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navlinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  navlinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navlinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
  }));
}

// Carrusel horizontal del catálogo de servicios digitales.
const catalogCarousel = document.querySelector(".catalog-carousel");
if (catalogCarousel) {
  const track = catalogCarousel.querySelector("#digitalizacion");
  const prev = catalogCarousel.querySelector("[data-carousel-prev]");
  const next = catalogCarousel.querySelector("[data-carousel-next]");
  if (track && prev && next) {
    const updateCarouselControls = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= maxScroll - 4;
      const status = catalogCarousel.parentElement.querySelector(".carousel-status");
      if (status) status.setAttribute("aria-label", maxScroll <= 4 ? "Todos los servicios visibles" : "Desliza o usa las flechas para explorar todos los servicios");
    };
    const scrollCards = direction => {
      const card = track.querySelector(".service-card");
      if (!card) return;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 20;
      track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    prev.addEventListener("click", () => scrollCards(-1));
    next.addEventListener("click", () => scrollCards(1));
    track.addEventListener("scroll", updateCarouselControls, { passive: true });
    window.addEventListener("resize", updateCarouselControls);
    track.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") { event.preventDefault(); scrollCards(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); scrollCards(-1); }
    });
    if ("ResizeObserver" in window) new ResizeObserver(updateCarouselControls).observe(track);
    updateCarouselControls();
  }
}

// Los enlaces legales deben apuntar a documentos reales antes del lanzamiento.
const privacyLink = document.getElementById("privacyLink");
if (privacyLink) privacyLink.addEventListener("click", event => { event.preventDefault(); alert("Añade el enlace al aviso de privacidad revisado antes de publicar."); });
const termsLink = document.getElementById("termsLink");
if (termsLink) termsLink.addEventListener("click", event => { event.preventDefault(); alert("Añade los términos y condiciones revisados antes de publicar."); });
