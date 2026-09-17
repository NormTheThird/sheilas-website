import { testimonials } from "../content";

// Matches the original page: no visible heading, just a centered column of
// quotes with authors underneath.
export function TestimonialsPage() {
  return (
    <section className="testimonials-section">
      <h1 className="visually-hidden">{testimonials.heading}</h1>
      <div className="container">
        {testimonials.testimonials.map((t) => (
          <blockquote key={t.author + t.quote.slice(0, 20)} className="testimonial">
            <p>{t.quote}</p>
            <small>
              {t.author}
              {t.context ? `, ${t.context}` : ""}
            </small>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
