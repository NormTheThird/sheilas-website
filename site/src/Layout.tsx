import { useState, type ReactNode } from "react";
import { site } from "./content";

// The original theme shows different menus on the home page and inner pages.
// All links render in the same teal; green is only the hover color.
// The whole ported theme lives under /archive/ (password-gated at CloudFront)
// now that the redesign is "/".
const HOME_NAV_LINKS = [
  { href: "/archive/#about", label: "Welcome" },
  { href: "/archive/#contact", label: "Contact Me" },
  { href: "/archive/#contact_map", label: "Locate Me" },
  { href: "/archive/testimonials/", label: "Testimonials" },
  { href: "/archive/faq/", label: "FAQ" },
];

const INNER_NAV_LINKS = [
  { href: "/archive/", label: "Home" },
  { href: "/archive/#about", label: "Welcome" },
  { href: "/archive/#services", label: "Services" },
  { href: "/archive/#contact", label: "Contact Us" },
  { href: "/archive/#contact_map", label: "Locate Us" },
  { href: "/archive/testimonials/", label: "Testimonials" },
  { href: "/archive/faq/", label: "FAQ" },
];

function Navbar({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  // The "Locate" link targets the map section, so drop it while the map is hidden.
  const links = (currentPath === "/archive/" ? HOME_NAV_LINKS : INNER_NAV_LINKS).filter(
    (l) => site.showMap || !l.href.endsWith("#contact_map"),
  );
  return (
    <nav className="main-menu" aria-label="Main navigation">
      <div className="container menu-inner">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-menu-list"
          onClick={() => setOpen(!open)}
        >
          <span className="visually-hidden">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <ul id="main-menu-list" className={`nav-list${open ? " open" : ""}`}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.href === currentPath ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function Layout({ currentPath, children }: { currentPath: string; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar currentPath={currentPath} />
      <section className="logo-banner">
        <a href="/archive/">
          <img src="/images/logo.jpg" alt={`${site.name} — home`} className="logo-banner-img" />
        </a>
      </section>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <ul className="social">
            {site.social.map((s) => {
              const icon = { Facebook: "/images/facebook.png", LinkedIn: "/images/linkedin.png" }[
                s.label
              ];
              return (
                <li key={s.label}>
                  <a href={s.url} rel="noopener" aria-label={s.label}>
                    {icon ? <img src={icon} alt={s.label} /> : s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="foot-line">
          <p>
            Ever grateful to <a href={site.artworkCredit.url}>{site.artworkCredit.label}</a> for
            the beautiful artwork!
          </p>
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
        </div>
      </footer>
      <a href="#" className="back-to-top" aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
