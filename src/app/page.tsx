import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const beliefs = [
  { label: "One True God", href: "#" },
  { label: "Bible", href: "/bible" },
  { label: "Salvation", href: "#" },
  { label: "Holy Spirit", href: "#" },
  { label: "Baptism", href: "#" },
  { label: "Sabbath", href: "#" },
  { label: "Footwashing", href: "#" },
];

const features = [
  {
    title: "Watch Live Stream",
    text: "Join our livestream worship services from wherever you are.",
  },
  {
    title: "Meet Jesus",
    text: "Learn what made Jesus so impactful and whether what He taught is true.",
  },
  {
    title: "Our Stories",
    text: "Hear testimonies of how God has worked in the lives of believers.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-brand text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <h1 className="max-w-2xl font-heading text-4xl font-bold sm:text-5xl">
              Is Jesus in Your Boat?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90">
              We buy insurance to protect ourselves. With Jesus as Lord, we are
              insured against life&apos;s sudden storms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded bg-white px-6 py-3 font-semibold text-brand hover:bg-brand-light"
              >
                Learn More
              </a>
              <a
                href="#"
                className="rounded border border-white px-6 py-3 font-semibold hover:bg-white/10"
              >
                Find a Church
              </a>
              <a
                href="#"
                className="rounded border border-white px-6 py-3 font-semibold hover:bg-white/10"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-line p-6">
                <h2 className="font-heading text-xl font-bold text-brand">
                  {f.title}
                </h2>
                <p className="mt-3 text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-brand-light">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="font-heading text-3xl font-bold">
              Welcome to the True Jesus Church
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              The True Jesus Church was established by the Lord Jesus Christ
              through the Holy Spirit.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {beliefs.map((b) => (
                <li key={b.label}>
                  <Link
                    href={b.href}
                    className="block rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand shadow-sm hover:bg-brand hover:text-white"
                  >
                    {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
