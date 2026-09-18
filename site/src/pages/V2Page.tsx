import { about, services, site } from "../content";
import { ContactForm } from "../ContactForm";
import { Markdown } from "../Markdown";
import "../v2.css";

// /v2 — modern wellness redesign preview. Same content and logo as the
// classic site, restyled light and minimal: white base, sage accents,
// Fraunces serif display type. The classic pages are untouched.

const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

const isTodo = (s: string) => s.startsWith("TODO");

export function V2Page() {
  return (
    <div className="v2">
      <header className="v2-header">
        <nav aria-label="Main navigation">
          <ul className="v2-nav">
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
        <section className="v2-hero">
          <div className="v2-container v2-hero-grid">
            <div>
              <p className="v2-eyebrow">Ayurvedic Yoga Therapy · {site.locationLine}</p>
              <h1 className="v2-display">
                Exhale. Peace.
                <br />
                <em>Imagine.</em> Euphoria.
              </h1>
              <p className="v2-lead">The light in me honors the light in you! Namaste!</p>
              <div className="v2-cta-row">
                <a className="v2-btn v2-btn-solid" href="#contact">
                  Book a session
                </a>
                <a className="v2-btn v2-btn-ghost" href="#about">
                  Meet Sheila
                </a>
              </div>
            </div>
            <div className="v2-hero-logo">
              <img src="/images/logo.jpg" alt={site.name} />
            </div>
          </div>
        </section>

        {/* Whitman quote band */}
        <section className="v2-quote-band" aria-label="Quote">
          <div className="v2-container">
            <blockquote>
              <p>“{about.quote}”</p>
              <cite>— {about.quoteAuthor}</cite>
            </blockquote>
          </div>
        </section>

        {/* About */}
        <section id="about" className="v2-section">
          <div className="v2-container v2-about-grid">
            <div className="v2-about-photo">
              <img src={about.photo} alt="Sheila Norman" />
            </div>
            <div>
              <h2 className="v2-h2">{about.heading}</h2>
              <Markdown text={about.bio} className="v2-bio" />
              <div className="v2-podcast">
                <p className="v2-podcast-label">{site.podcastBlurb}</p>
                <audio controls preload="none" src={site.podcastAudioUrl}>
                  Your browser does not support the audio element.{" "}
                  <a href={site.podcastAudioUrl}>Download the interview</a>.
                </audio>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="v2-section v2-section-sage">
          <div className="v2-container">
            <h2 className="v2-h2">{services.heading}</h2>
            <p className="v2-section-intro">{services.intro}</p>
            <ul className="v2-cards">
              {services.services.map((s) => (
                <li key={s.name} className="v2-card">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  {(!isTodo(s.duration) || !isTodo(s.price)) && (
                    <p className="v2-card-meta">
                      {!isTodo(s.duration) && s.duration}
                      {!isTodo(s.duration) && !isTodo(s.price) && " · "}
                      {!isTodo(s.price) && s.price}
                    </p>
                  )}
                  {s.stripePaymentLink && (
                    <a className="v2-btn v2-btn-solid" href={s.stripePaymentLink}>
                      Book / Pay
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="v2-section">
          <div className="v2-container">
            <h2 className="v2-h2">let's get in touch</h2>
            <p className="v2-section-intro">{site.tagline}</p>
            <div className="v2-contact-grid">
              <div className="v2-contact-details">
                <h3>{site.name}</h3>
                <p>
                  <a href={`tel:+1${site.phone.replace(/\D/g, "")}`}>{site.phone}</a>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                {/* hidden while empty; returns when locations are added via the CMS */}
                {site.communityLocations.length > 0 && (
                  <>
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
                  </>
                )}
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
              <div className="v2-contact-form">
                <ContactForm buttonClass="v2-btn v2-btn-solid" />
              </div>
            </div>
            {site.mapEmbedUrl && (
              <div className="v2-map">
                <iframe src={site.mapEmbedUrl} title="Map" loading="lazy" allowFullScreen />
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="v2-footer">
        <img src="/images/logo.jpg" alt="" className="v2-footer-logo" />
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
