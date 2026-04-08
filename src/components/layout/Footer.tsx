import { Logo, LogoImage } from "@/components/logo";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
} from "lucide-react";
import Link from "next/link";

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
      title: "Explore",
      links: [
        { text: "All Books", url: "/catalog/book" },
        { text: "Categories", url: "/catalog/categories" },
        { text: "Library Journal", url: "/blogs" },
        { text: "Membership Plans", url: "/our-plans" },
      ],
    },
    {
      title: "Navigation",
      links: [
        { text: "Home", url: "/" },
        { text: "About Us", url: "/about" },
        { text: "Contact", url: "/contact" },
        { text: "FAQs", url: "/#faq" },
      ],
    },
    {
      title: "User Area",
      links: [
        { text: "My Dashboard", url: "/dashboard" },
        { text: "Borrowing History", url: "/dashboard/my-borrowings" },
        { text: "Membership", url: "/dashboard/my-membership" },
        { text: "Profile Settings", url: "/dashboard/profile" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} BookNest LMS. All rights reserved.`,
  bottomLinks = [
    { text: "Terms of Service", url: "#" },
    { text: "Privacy", url: "#" },
    { text: "Support", url: "/contact" },
  ],
}: Footer2Props) => {
  const socials = [
    { icon: Facebook, url: "#", color: "hover:text-blue-500" },
    { icon: Twitter, url: "#", color: "hover:text-sky-400" },
    { icon: Instagram, url: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, url: "#", color: "hover:text-blue-700" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "123 Library Plaza, Wisdom City, NY 10001" },
    { icon: Phone, text: "01780551403", url: "tel:01780551403" },
    { icon: Mail, text: "shakhawathossen188@gmail.com", url: "mailto:shakhawathossen188@gmail.com" },
  ];

  return (
    <section className={cn("pt-24 pb-12 px-5 lg:px-0 bg-muted/30 dark:bg-zinc-950/30 border-t border-border", className)}>
      <div className="container mx-auto">
        <footer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 lg:gap-8">
            <div className="md:col-span-1 lg:col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <Logo url="/">
                  <LogoImage
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-16 dark:invert"
                  />
                </Logo>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-xs font-medium">{tagline}</p>
              
              <div className="flex gap-3">
                {socials.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a 
                      key={idx} 
                      href={social.url} 
                      className={cn("p-2.5 rounded-2xl bg-background border border-border shadow-sm transition-all duration-300 transform hover:-translate-y-1", social.color)}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <h3 className="mb-8 font-black uppercase tracking-[0.2em] text-[10px] text-blue-600">Contact Us</h3>
                <ul className="space-y-6">
                  {contactInfo.map((info, idx) => {
                    const Icon = info.icon;
                    return (
                      <li key={idx} className="flex gap-4 text-sm font-bold items-start group">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        {info.url ? (
                          <a href={info.url} className="text-muted-foreground leading-snug hover:text-blue-600 transition-colors">
                            {info.text}
                          </a>
                        ) : (
                          <span className="text-muted-foreground leading-snug">{info.text}</span>
                        )}
                      </li>
                    ) 
                  })}
                </ul>
            </div>

            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-8 font-black uppercase tracking-[0.2em] text-[10px] text-blue-600">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-bold text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      <Link href={link.url}>{link.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold text-muted-foreground">
            <p className="tracking-tight">{copyright}</p>
            <ul className="flex gap-8">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-blue-600 transition-colors">
                  <Link href={link.url}>{link.text}</Link>
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
