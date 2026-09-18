import { about, faq, services, site, testimonials } from "../content";
import { ContactForm } from "../ContactForm";
import { Markdown } from "../Markdown";
import "../v3.css";

// /v3 — modern wellness redesign preview. Same content as the classic site,
// reimagined with warm natural colors (terracotta, sage, cream), serif
// display type and organic shapes. The classic pages are untouched.

const NAV = [
  { href: "#about", label: "About" },
  { href: "#offerings", label: "Offerings" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

const isTodo = (s: string) => s.startsWith("TODO");

// Short quotes that read well as cards; the featured quote stands alone.
const FEATURED_AUTHOR = "Dorothy";
const CARD_AUTHORS = ["Julie", "Amber", "Sam"];

export function V3Page() {
  const featured = testimonials.testimonials.find((t) => t.author === FEATURED_AUTHOR);
  const cards = testimonials.testimonials.filter((t) => CARD_AUTHORS.includes(t.author));

  return (
    <div className="v3">
      <header className="v3-header">
        <a className="v3-wordmark" href="#top">
          Yes <em>Yoga</em> One
        </a>
        <nav aria-label="Main navigation">
          <ul className="v3-nav">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="v3-btn v3-btn-solid v3-header-cta" href="#contact">
          Get in touch
        </a>
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
              <p className="v3-lead">
                Yoga and Ayurvedic practices tailored to you — individually, with a partner, or
                in a group. The light in me honors the light in you.
              </p>
              <div className="v3-cta-row">
                <a className="v3-btn v3-btn-solid" href="#contact">
                  Book a session
                </a>
                <a className="v3-btn v3-btn-ghost" href="#about">
                  Meet Sheila
                </a>
              </div>
            </div>
            <div className="v3-hero-photo">
              <img src={about.photo} alt="Sheila Norman" />
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
              <p className="v3-eyebrow">{about.heading}</p>
              <h2 className="v3-h2">
                Guided by nature's <em>cycles</em>, tailored to yours
              </h2>
              <Markdown text={about.bio} className="v3-bio" />
              <div className="v3-podcast">
                <p className="v3-podcast-label">Listen · {site.podcastBlurb}</p>
                <audio controls preload="none" src={site.podcastAudioUrl}>
                  Your browser does not support the audio element.{" "}
                  <a href={site.podcastAudioUrl}>Download the interview</a>.
                </audio>
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section id="offerings" className="v3-section v3-section-sage">
          <div className="v3-container">
            <p className="v3-eyebrow">{services.heading}</p>
            <h2 className="v3-h2">
              Ways to <em>practice</em> together
            </h2>
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
                  {s.stripePaymentLink ? (
                    <a className="v3-btn v3-btn-solid" href={s.stripePaymentLink}>
                      Book / Pay
                    </a>
                  ) : (
                    <a className="v3-card-link" href="#contact">
                      Ask about this →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="v3-section">
          <div className="v3-container">
            <p className="v3-eyebrow">{testimonials.heading}</p>
            <h2 className="v3-h2">
              Kind words from <em>students</em>
            </h2>
            {featured && (
              <blockquote className="v3-featured-quote">
                <p>“{featured.quote}”</p>
                <cite>
                  — {featured.author}
                  {featured.context ? `, ${featured.context}` : ""}
                </cite>
              </blockquote>
            )}
            <ul className="v3-cards v3-quote-cards">
              {cards.map((t) => (
                <li key={t.author} className="v3-card">
                  <p>“{t.quote}”</p>
                  <cite>
                    — {t.author}
                    {t.context ? `, ${t.context}` : ""}
                  </cite>
                </li>
              ))}
            </ul>
            <p className="v3-more-link">
              <a href="/testimonials/">Read all testimonials →</a>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="v3-section v3-section-sand">
          <div className="v3-container v3-narrow">
            <p className="v3-eyebrow">Questions</p>
            <h2 className="v3-h2">
              Frequently asked, <em>gently</em> answered
            </h2>
            {faq.faq.map((item) => (
              <details key={item.question} className="v3-faq">
                <summary>{item.question}</summary>
                <div className="v3-faq-answer">
                  <Markdown text={item.answer} />
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="v3-section v3-section-clay">
          <div className="v3-container">
            <p className="v3-eyebrow">Contact</p>
            <h2 className="v3-h2">
              Let's get in <em>touch</em>
            </h2>
            <p className="v3-section-intro">{site.tagline}</p>
            <div className="v3-contact-grid">
              <div className="v3-contact-details">
                <h3>{site.name}</h3>
                <p>
                  <a href={`tel:+1${site.phone.replace(/\D/g, "")}`}>{site.phone}</a>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <h3>In the community</h3>
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
                          Find us on {s.label}
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
        <p className="v3-wordmark-footer">
          Yes <em>Yoga</em> One
        </p>
        <p>
          Ever grateful to <a href={site.artworkCredit.url}>{site.artworkCredit.label}</a> for the
          beautiful artwork
        </p>
        <p>
          © {new Date().getFullYear()} {site.legalName} · <a href="/">Classic site</a>
        </p>
      </footer>
    </div>
  );
}
