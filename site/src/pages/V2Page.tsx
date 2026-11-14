import { about, faq, site, testimonials } from "../content";
import { ContactForm } from "../ContactForm";
import { Markdown } from "../Markdown";
import "../v2.css";

// /v2 — a version of the site for someone who has never done yoga and does
// not know what Ayurveda is: a person with a sore back, stress or poor sleep
// who is wondering whether to get in touch. Problem first, plain words,
// bigger type, phone number up front. Same content files as the main site.

const NAV = [
  { href: "#help", label: "How it helps" },
  { href: "#expect", label: "What to expect" },
  { href: "#about", label: "About Sheila" },
  { href: "#questions", label: "Questions" },
  { href: "#contact", label: "Contact" },
];

const CONCERNS = [
  {
    title: "A sore, stiff back",
    text: "Slow, careful stretching that works with your body as it is today, on a mat, on a chair, or lying down. Nothing you cannot do.",
  },
  {
    title: "Stress and worry",
    text: "Simple breathing exercises you can learn in one visit and use anywhere: at your desk, in the car, or at three in the morning.",
  },
  {
    title: "Trouble sleeping",
    text: "A short wind-down routine for the evening, and small changes to your day that make sleep come easier.",
  },
  {
    title: "Stiff joints and aches",
    text: "Gentle movement that loosens hips, knees, shoulders and hands, with every pose adjusted so it works for you.",
  },
  {
    title: "Getting back on your feet",
    text: "After an illness, surgery or a hard year, a patient and private way to rebuild strength, balance and confidence.",
  },
  {
    title: "“I’d feel silly in a class”",
    text: "This is one-on-one. There is no class to keep up with, no one watching, and no special clothes. Mats are provided.",
  },
];

const STEPS = [
  {
    title: "First, you talk",
    text: "Your first visit is mostly a conversation: what hurts, what your days look like, how you sleep, what you would like to be different. It takes about an hour to an hour and a half.",
  },
  {
    title: "Then you try a few simple things",
    text: "Some gentle stretches, a breathing exercise, a few minutes of real rest. Everything is shown step by step and changed to suit you. If something does not feel right, you say so and it changes.",
  },
  {
    title: "You go home with a short routine",
    text: "A handful of things that take five or ten minutes a day. The goal is not to turn you into a yoga person. It is to help you feel better and stay that way.",
  },
];

const TERMS = [
  {
    term: "Yoga",
    plain:
      "Stretching, breathing and relaxing, done slowly and carefully. It does not require flexibility, fitness, or any particular beliefs.",
  },
  {
    term: "Yin yoga",
    plain:
      "The gentlest kind. Poses are held for a few quiet minutes, mostly sitting or lying down, which is why it suits stiff joints and tired bodies.",
  },
  {
    term: "Ayurveda",
    plain:
      "An old, common-sense approach to daily habits: when you sleep, what and when you eat, how you start and end your day. Sheila uses it to fit the advice to you rather than giving everyone the same plan.",
  },
  {
    term: "BodyTalk Access",
    plain:
      "You lie down and rest while Sheila uses light touch and gentle tapping over the head and heart. People find it very relaxing. It takes about half an hour.",
  },
];

// Verbatim excerpts from content/testimonials.json, chosen for people who
// were in pain, skeptical, or new to all of this.
const STORIES: { author: string; parts: string[] }[] = [
  {
    author: "Mary",
    parts: [
      "Since I started yoga I have developed arthritis in my neck, hands, back, hips, knees, and feet. I've had to modify some of the poses but it still works well for me. I can feel the joints loosening and relaxing, so I get some relief from the stiffness and aches, especially in my feet.",
      "She is gentle, patient, and knowledgeable.",
    ],
  },
  {
    author: "Laurie",
    parts: [
      "I had some reservations about trying yoga, because I was very unfamiliar with the names of poses, and had poor balance from radiation therapy on my brain.",
      "I would definitely recommend Sheila to anyone, young or old, with physical issues and limitations, because she will show you exactly what works for each individual based on their needs and the benefits they want to receive.",
    ],
  },
  {
    author: "Jake",
    parts: [
      "I had a couple reservations, seemed like some hippy stoner kind of thing.",
      "I do enjoy the benefits of it tho, always felt better physically after a session.",
    ],
  },
  {
    author: "Tonya",
    parts: [
      "My pain caused me to not want to do anything but with Yoga I was able to let go and feel better with practice.",
    ],
  },
];

const QUESTION_PREFIXES = [
  "I have heard about the benefits of yoga",
  "Do I need to bring a mat",
  "I want to take a lunch time yoga break",
  "What can I expect in my assessment",
  "What can I expect in a BodyTalk",
  "What sort of training do you have",
];

function storyFor(author: string) {
  return testimonials.testimonials.find((t) => t.author === author);
}

export function V2Page() {
  const phoneHref = `tel:+1${site.phone.replace(/\D/g, "")}`;
  const questions = faq.faq.filter(
    (q) => q.answer && QUESTION_PREFIXES.some((p) => q.question.startsWith(p)),
  );

  return (
    <div className="v2">
      <header className="v2-header">
        <div className="v2-header-inner">
          <a href="#top" className="v2-brand">
            {site.name}
          </a>
          <nav aria-label="Main navigation">
            <ul className="v2-nav">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="v2-header-phone" href={phoneHref}>
            Call {site.phone}
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero: the problem first, then the reassurance */}
        <section className="v2-hero">
          <div className="v2-container v2-hero-grid">
            <div>
              <p className="v2-eyebrow">Gentle, one-on-one help in {site.locationLine}</p>
              <h1 className="v2-h1">
                Sore back? Stressed out?
                <br />
                Not sleeping well?
              </h1>
              <p className="v2-lead">
                Sheila Norman teaches simple stretching, breathing and relaxation to people who
                have never done yoga. No experience, no flexibility and no special clothes needed.
                Just you, at your own pace.
              </p>
              <div className="v2-cta-row">
                <a className="v2-btn v2-btn-solid" href={phoneHref}>
                  Call {site.phone}
                </a>
                <a className="v2-btn v2-btn-ghost" href="#contact">
                  Send a message
                </a>
              </div>
              <p className="v2-hero-note">
                Not sure what to say? Just tell her what is bothering you.
              </p>
            </div>
            <div className="v2-hero-photo">
              <img src={about.photo} alt="Sheila Norman" width="640" height="800" />
              <p className="v2-hero-caption">Sheila Norman, teaching since 2011</p>
            </div>
          </div>
        </section>

        {/* Concerns */}
        <section id="help" className="v2-section">
          <div className="v2-container">
            <h2 className="v2-h2">Does any of this sound like you?</h2>
            <p className="v2-intro">
              Most people who come to Sheila are not looking for yoga. They are looking for relief.
              Here is what she helps with most often.
            </p>
            <div className="v2-cards">
              {CONCERNS.map((c) => (
                <div key={c.title} className="v2-card">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What to expect */}
        <section id="expect" className="v2-section v2-section-tint">
          <div className="v2-container">
            <h2 className="v2-h2">What a visit is actually like</h2>
            <ol className="v2-steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="v2-step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="v2-fineprint">
              Sheila is a certified yoga teacher and Ayurvedic yoga therapist, not a doctor. She does
              not diagnose or treat medical conditions, and she will happily work alongside whatever
              care you already have.
            </p>
          </div>
        </section>

        {/* Plain-English glossary */}
        <section className="v2-section">
          <div className="v2-container v2-narrow">
            <h2 className="v2-h2">The words you will hear, in plain English</h2>
            <dl className="v2-terms">
              {TERMS.map((t) => (
                <div key={t.term} className="v2-term">
                  <dt>{t.term}</dt>
                  <dd>{t.plain}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Stories */}
        <section id="stories" className="v2-section v2-section-tint">
          <div className="v2-container">
            <h2 className="v2-h2">From people who were not so sure either</h2>
            <div className="v2-stories">
              {STORIES.map((s) => {
                const source = storyFor(s.author);
                // only show excerpts that really appear in the testimonial
                const parts = s.parts.filter((p) => source?.quote.includes(p));
                if (!source || parts.length === 0) return null;
                return (
                  <blockquote key={s.author} className="v2-story">
                    <p>{parts.map((p, i) => (i === 0 ? `“${p}` : ` … ${p}`)).join("")}&rdquo;</p>
                    <cite>
                      &mdash; {source.author}
                      {source.context ? `, ${source.context}` : ""}
                    </cite>
                  </blockquote>
                );
              })}
            </div>
          </div>
        </section>

        {/* About, short */}
        <section id="about" className="v2-section">
          <div className="v2-container v2-about-grid">
            <div className="v2-about-photo">
              <img src={about.photo} alt="Sheila Norman" width="640" height="800" />
            </div>
            <div>
              <h2 className="v2-h2">About Sheila</h2>
              <p>
                Sheila Norman has taught yoga since 2011. Much of her work has been with people over
                fifty at a retirement community fitness club and with veterans at the VA Medical
                Center, which is why her sessions are slow, practical and adjusted to the person in
                front of her.
              </p>
              <p>
                She is a certified yoga teacher, a certified yin yoga teacher, and trained in
                Ayurvedic Yoga Therapy through the California College of Ayurveda. She also offers
                BodyTalk Access, a relaxing light-touch session.
              </p>
              <details className="v2-more">
                <summary>Read Sheila&rsquo;s full story and training</summary>
                <Markdown text={about.bio} className="v2-bio" />
              </details>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section id="questions" className="v2-section v2-section-tint">
          <div className="v2-container v2-narrow">
            <h2 className="v2-h2">Questions people ask before their first visit</h2>
            {questions.map((item) => (
              <details key={item.question} className="v2-faq">
                <summary>{item.question}</summary>
                <div className="v2-faq-answer">
                  <Markdown text={item.answer} />
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="v2-section v2-contact">
          <div className="v2-container">
            <div className="v2-contact-grid">
              <div>
                <h2 className="v2-h2">Get in touch</h2>
                <p className="v2-intro">
                  A phone call or a short note is all it takes. Tell Sheila what is going on and she
                  will tell you honestly whether she can help.
                </p>
                <p className="v2-contact-phone">
                  <a href={phoneHref}>{site.phone}</a>
                </p>
                <p className="v2-contact-email">
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <p className="v2-contact-where">{site.locationLine}</p>
              </div>
              <div className="v2-contact-form">
                <ContactForm buttonClass="v2-btn v2-btn-solid" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="v2-footer">
        <p>
          Ever grateful to <a href={site.artworkCredit.url}>{site.artworkCredit.label}</a> for the
          beautiful artwork.
        </p>
        <p>
          &copy; {new Date().getFullYear()} {site.legalName} &middot; <a href="/">Current site</a>{" "}
          &middot; <a href="/archive/">Classic site (archive)</a>
        </p>
      </footer>
    </div>
  );
}
