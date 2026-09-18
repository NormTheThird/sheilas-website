import type { FormEvent } from "react";
import { site } from "./content";

// With a Formspree form ID the form posts there; until one is configured,
// submitting opens the visitor's email app with the message pre-filled.
export function ContactForm({ buttonClass = "main-btn" }: { buttonClass?: string }) {
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
          <input type="text" name="name" placeholder="Your name" required aria-label="Your name" />
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            required
            aria-label="Your email address"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your phone number"
            aria-label="Your phone number"
          />
        </div>
        <div className="col-half">
          <textarea
            name="message"
            placeholder="Your message"
            required
            aria-label="Your message"
          />
        </div>
      </div>
      <button type="submit" className={buttonClass}>
        Send
      </button>
    </form>
  );
}
