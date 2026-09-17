import { faq } from "../content";
import { Markdown } from "../Markdown";

// Accordion like the original Bootstrap panels — <details> keeps it working
// without JavaScript.
export function FaqPage() {
  return (
    <section className="faq-section">
      <div className="container">
        <h1 className="page-heading">{faq.heading}</h1>
        <div className="faq-accordion">
          {faq.faq.map((item) => (
            <details key={item.question} className="faq-panel">
              <summary>{item.question}</summary>
              <div className="faq-answer">
                <Markdown text={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
