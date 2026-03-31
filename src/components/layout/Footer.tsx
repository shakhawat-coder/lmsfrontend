import { Logo, LogoImage, LogoText } from "@/components/logo";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "/logo.png",
    alt: "BookNest",
    title: "BookNest",
    url: "/",
  },
  className,
  tagline = "Your gateway to knowledge and discovery.",
  menuItems = [
    {
      title: "Catalog",
      links: [
        { text: "Search Books", url: "/catalog/search" },
        { text: "Browse Categories", url: "/catalog/categories" },
        { text: "New Arrivals", url: "/catalog/new-arrivals" },
        { text: "Popular Books", url: "/catalog/popular" },
        { text: "Advanced Search", url: "/catalog/advanced" },
      ],
    },
    {
      title: "Services",
      links: [
        { text: "Membership Plans", url: "/our-plan" },
        { text: "Borrowing", url: "/services/borrowing" },
        { text: "Renewals", url: "/services/renewals" },
        { text: "Reservations", url: "/services/reservations" },
        { text: "Interlibrary Loan", url: "/services/interlibrary" },
        { text: "Digital Resources", url: "/services/digital" },
      ],
    },
    {
      title: "About",
      links: [
        { text: "Library Hours", url: "/about/hours" },
        { text: "Contact Us", url: "/about/contact" },
        { text: "Location & Directions", url: "/about/location" },
        { text: "Library History", url: "/about/history" },
        { text: "Staff Directory", url: "/about/staff" },
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Help Center", url: "/support/help" },
        { text: "FAQs", url: "/support/faqs" },
        { text: "Contact Support", url: "/support/contact" },
        { text: "System Status", url: "/support/status" },
        { text: "Feedback", url: "/support/feedback" },
      ],
    },
  ],
  copyright = "© 2024 Library Management System. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section className={cn("pt-20 pb-5", className)}>
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo url="https://shadcnblocks.com">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-20 dark:invert"
                  />
                   </Logo>
              </div>
              <p className="mt-10">{tagline}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
