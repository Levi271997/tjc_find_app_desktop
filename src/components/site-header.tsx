import Image from "next/image";
import Link from "next/link";
import { LoginPanel } from "./login-panel";

const navItems = [
  { label: "Live Stream", href: "#" },
  { label: "Believe", href: "#" },
  { label: "Bible", href: "/bible" },
  { label: "Media", href: "#" },
  { label: "Publications", href: "#" },
  { label: "About", href: "#" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" aria-label="True Jesus Church home">
          <Image
            src="/tjc-logo.png"
            alt="International Assembly of True Jesus Church"
            width={505}
            height={65}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 font-heading text-sm font-semibold md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            ))}
          </nav>
          <LoginPanel />
        </div>
      </div>
    </header>
  );
}
