import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { type HeroSlide, HeroSlider } from "@/components/hero-slider";
import { SiteHeader } from "@/components/site-header";
import bibleImage from "../../public/hero/bible.jpg";
import boatImage from "../../public/hero/boat.jpg";
import communityImage from "../../public/hero/community.jpg";
import lightImage from "../../public/hero/light.jpg";
import liveStreamImage from "../../public/hero/live-stream.jpg";

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

// Photos are from Unsplash (free Unsplash License): boat by Hongjin Wang,
// Bible by Christopher Stites, camera by Rob Pinney, clouds by Daniel Páscoa,
// silhouettes by Annie Williams.
const heroSlides: HeroSlide[] = [
  {
    title: "Is Jesus in Your Boat?",
    text: "We buy insurance to protect ourselves. With Jesus as Lord, we are insured against life's sudden storms.",
    image: boatImage,
    imageAlt: "A small boat alone on calm open water",
    actions: [
      { label: "Learn More", href: "#" },
      { label: "Find a Church", href: "#" },
      { label: "Get in Touch", href: "#" },
    ],
  },
  {
    title: "Read the Holy Bible",
    text: "Read the Scriptures online in the King James Version, NIV or NASB.",
    image: bibleImage,
    imageAlt: "An open Bible in warm sunlight",
    actions: [{ label: "Open the Bible", href: "/bible" }],
  },
  {
    title: "Watch Live Stream",
    text: "Join our livestream worship services from wherever you are.",
    image: liveStreamImage,
    imageAlt: "A video camera monitor set up to film",
    actions: [{ label: "Watch Now", href: "#" }],
  },
  {
    title: "Meet Jesus",
    text: "Learn what made Jesus so impactful and whether what He taught is true.",
    image: lightImage,
    imageAlt: "Sunlight breaking through clouds",
    actions: [{ label: "Learn More", href: "#" }],
  },
  {
    title: "Our Stories",
    text: "Hear testimonies of how God has worked in the lives of believers.",
    image: communityImage,
    imageAlt: "Friends watching the sunrise together, seen from behind",
    actions: [{ label: "Read Stories", href: "#" }],
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <HeroSlider slides={heroSlides} />

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
