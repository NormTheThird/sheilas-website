import { about, services, site } from "../content";
import { ContactForm } from "../ContactForm";
import { Markdown } from "../Markdown";
import "../v3.css";

// /v3 — modern wellness redesign preview. Same content and logo as the
// classic site, restyled light and minimal: white base, sage accents,
// Fraunces serif display type. The classic pages are untouched.

const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

const isTodo = (s: string) => s.startsWith("TODO");

export function V3Page() {
  return (
    <div className="v3">
      <header className="v3-header">
        <nav aria-label="Main navigation">
          <ul className="v3-nav">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="v3-hero">
          <div className="v3-container v3-hero-grid">
            <div>
              <p className="v3-eyebrow">Ayurvedic Yoga Therapy · {site.locationLine}</p>
              <h1 className="v3-display">
                Exhale. Peace.
                <br />
                <em>Imagine.</em> Euphoria.
              </h1>
              <p className="v3-lead">The light in me honors the light in you! Namaste!</p>
              <div className="v3-cta-row">
                <a className="v3-btn v3-btn-solid" href="#contact">
                  Book a session
                </a>
                <a className="v3-btn v3-btn-ghost" href="#about">
                  Meet Sheila
                </a>
              </div>
            </div>
            <div className="v3-hero-logo">
              <img src="/images/logo.jpg" alt={site.name} />
            </div>
          </div>
        </section>

        {/* Whitman quote band */}
        <section className="v3-quote-band" aria-label="Quote">
          <div className="v3-container">
            <blockquote>
              <p>“{about.quote}”</p>
              <cite>— {about.quoteAuthor}</cite>
            </blockquote>
          </div>
        </section>

        {/* About */}
        <section id="about" className="v3-section">
          <div className="v3-container v3-about-grid">
            <div className="v3-about-photo">
              <img src={about.photo} alt="Sheila Norman" />
            </div>
            <div>
              <h2 className="v3-h2">{about.heading}</h2>
              <Markdown text={about.bio} className="v3-bio" />
              <div className="v3-podcast">
                <p className="v3-podcast-label">{site.podcastBlurb}</p>
                <audio controls preload="none" src={site.podcastAudioUrl}>
                  Your browser does not support the audio element.{" "}
                  <a href={site.podcastAudioUrl}>Download the interview</a>.
                </audio>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="v3-section v3-section-sage">
          <div className="v3-container">
            <h2 className="v3-h2">{services.heading}</h2>
            <p className="v3-section-intro">{services.intro}</p>
            <ul className="v3-cards">
              {services.services.map((s) => (
                <li key={s.name} className="v3-card">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  {(!isTodo(s.duration) || !isTodo(s.price)) && (
                    <p className="v3-card-meta">
                      {!isTodo(s.duration) && s.duration}
                      {!isTodo(s.duration) && !isTodo(s.price) && " · "}
                      {!isTodo(s.price) && s.price}
                    </p>
                  )}
                  {s.stripePaymentLink && (
                    <a className="v3-btn v3-btn-solid" href={s.stripePaymentLink}>
                      Book / Pay
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="v3-section">
          <div className="v3-container">
            <h2 className="v3-h2">let's get in touch</h2>
            <p className="v3-section-intro">{site.tagline}</p>
            <div className="v3-contact-grid">
              <div className="v3-contact-details">
                <h3>{site.name}</h3>
                <p>
                  <a href={`tel:+1${site.phone.replace(/\D/g, "")}`}>{site.phone}</a>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <h3>Locations in the community</h3>
                <ul>
                  {site.communityLocations.map((loc) => (
                    <li key={loc.url}>
                      <a href={loc.url} rel="noopener">
                        {loc.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {site.social.map(
                  (s) =>
                    s.url !== "#" && (
                      <p key={s.label}>
                        <a href={s.url} rel="noopener">
                          {s.label}
                        </a>
                      </p>
                    ),
                )}
              </div>
              <div className="v3-contact-form">
                <ContactForm buttonClass="v3-btn v3-btn-solid" />
              </div>
            </div>
            {site.mapEmbedUrl && (
              <div className="v3-map">
                <iframe src={site.mapEmbedUrl} title="Map" loading="lazy" allowFullScreen />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="v3-footer">
        <img src="/images/logo.jpg" alt="" className="v3-footer-logo" />
        <p>
          Ever grateful to <a href={site.artworkCredit.url}>{site.artworkCredit.label}</a> for the
          beautiful artwork!
        </p>
        <p>
          © {new Date().getFullYear()} {site.legalName} · <a href="/">Classic site</a>
        </p>
      </footer>
    </div>
  );
}
