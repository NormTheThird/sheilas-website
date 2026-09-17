import type { FormEvent } from "react";
import { about, services, site } from "../content";
import { Markdown } from "../Markdown";

function Separator() {
  return <div className="separator" aria-hidden="true" />;
}

// With a Formspree form ID the form posts there; until one is configured,
// submitting opens the visitor's email app with the message pre-filled.
function ContactForm() {
  const hasFormspree = Boolean(site.formspreeFormId);

  function submitViaEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      "",
      String(data.get("message")),
    ].join("\n");
    const subject = `Website message from ${data.get("name")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      className="contact-form"
      action={hasFormspree ? `https://formspree.io/f/${site.formspreeFormId}` : undefined}
      method={hasFormspree ? "POST" : undefined}
      onSubmit={hasFormspree ? undefined : submitViaEmail}
    >
      <div className="row">
        <div className="col-half form-fields">
          <input type="text" name="name" placeholder="Name *" required aria-label="Name" />
          <input type="email" name="email" placeholder="Email *" required aria-label="Email" />
          <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" />
        </div>
        <div className="col-half">
          <textarea name="message" placeholder="Message *" required aria-label="Message" />
        </div>
      </div>
      <button type="submit" className="main-btn">
        Send
      </button>
    </form>
  );
}

export function HomePage() {
  const activeServices = services.services.filter((s) => s.active);
  return (
    <>
      <h1 className="visually-hidden">
        {site.name} — Ayurvedic Yoga Therapy, {site.locationLine}
      </h1>

      {/* Welcome + About — gray section, aquamarine headings, white italic text */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="heading">Welcome</h2>
          <Separator />
          <blockquote className="welcome-quote">
            <p>“{about.quote}”</p>
            <p>–{about.quoteAuthor}</p>
          </blockquote>
          <Separator />
          <div className="row about-row">
            <div className="col-half">
              <img src={about.photo} alt="Sheila Norman" className="about-photo" />
            </div>
            <div className="col-half">
              <h3 className="sub-heading">{about.heading}</h3>
              <Markdown text={about.bio} className="about-bio" />
              <p>{site.podcastBlurb}</p>
              <audio controls preload="none" src={site.podcastAudioUrl}>
                Your browser does not support the audio element.{" "}
                <a href={site.podcastAudioUrl}>Download the interview</a>.
              </audio>
              <p className="locations-intro">Locations in the community:</p>
              <p className="community-links">
                {site.communityLocations.map((loc) => (
                  <span key={loc.url}>
                    <a href={loc.url} rel="noopener">
                      {loc.url.replace(/^https?:\/\//, "")}
                    </a>
                    <br />
                  </span>
                ))}
              </p>
              <p>PH: {site.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</p>
            </div>
          </div>
        </div>
      </section>

      {activeServices.length > 0 && (
        <section id="services" className="services-section">
          <div className="container">
            <h2 className="heading">{services.heading}</h2>
            <Separator />
            <p>{services.intro}</p>
            <ul className="service-list">
              {activeServices.map((s) => (
                <li key={s.name} className="service-card">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <p className="service-meta">
                    {s.duration} · {s.price}
                  </p>
                  {s.stripePaymentLink && (
                    <a className="main-btn" href={s.stripePaymentLink}>
                      Book / Pay
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Booking widget slot: when Sheila picks a provider (Acuity / Calendly /
          Momence), set bookingEmbedUrl in content/site.json. */}
      {site.bookingEmbedUrl && (
        <section id="booking" className="booking-section">
          <div className="container">
            <h2 className="heading">Book a session</h2>
            <Separator />
            <iframe src={site.bookingEmbedUrl} title="Book a session" className="booking-embed" />
          </div>
        </section>
      )}

      {/* Contact — skyline background, matching the original #contact section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="heading">let's get in touch</h2>
          <Separator />
          <p className="tagline">{site.tagline}</p>
          <ContactForm />
          <div className="contact-card">
            <h3 className="contact-card-heading">{site.name}</h3>
            <ul>
              <li>{site.phone}</li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>
        </div>
        {/* Full-width map, as on the original site */}
        <div id="contact_map" className="map-slot">
          {site.mapEmbedUrl && (
            <iframe src={site.mapEmbedUrl} title="Map" loading="lazy" allowFullScreen />
          )}
        </div>
      </section>
    </>
  );
}
