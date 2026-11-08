"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroSlide = {
  title: string;
  text: string;
  image: StaticImageData;
  imageAlt: string;
  actions: { label: string; href: string }[];
};

const INTERVAL_MS = 5000;

// Full-width hero that cross-fades between slides every 5 seconds. Autoplay
// pauses while the pointer or keyboard focus is inside the slider, and the
// pause button stops it entirely (WCAG 2.2.2). Choosing a slide restarts the
// 5-second timer.
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const paused = stopped || hovered || focused;

  useEffect(() => {
    if (paused || slides.length < 2) return;

    const timer = setTimeout(() => setCurrent((index) => (index + 1) % slides.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [current, paused, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate overflow-hidden bg-navy text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <h1 className="sr-only">True Jesus Church</h1>

      {/* Stacked slides; the first sets the height, the rest overlay it. */}
      <div className="grid">
        {slides.map((slide, index) => {
          const active = index === current;

          return (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
              aria-hidden={!active}
              inert={!active}
              className={`relative col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                active ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="100vw"
                priority={index === 0}
                placeholder="blur"
                className="-z-10 object-cover"
              />
              {/* Darkens the image behind the text so it stays readable. */}
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy/90 via-navy/65 to-navy/20" />

              <div className="mx-auto flex min-h-112 max-w-6xl flex-col justify-center px-4 pt-20 pb-24 sm:min-h-136 sm:py-28">
                <h2 className="max-w-2xl font-heading text-4xl font-bold sm:text-5xl">{slide.title}</h2>
                <p className="mt-6 max-w-xl text-lg text-white/90">{slide.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {slide.actions.map((action, actionIndex) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={
                        actionIndex === 0
                          ? "rounded bg-white px-6 py-3 font-semibold text-brand hover:bg-brand-light"
                          : "rounded border border-white px-6 py-3 font-semibold hover:bg-white/10"
                      }
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-20">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setStopped((value) => !value)}
            aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
            className="flex size-8 items-center justify-center rounded-full border border-white/70 hover:bg-white/15"
          >
            {stopped ? (
              <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5 fill-current" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden="true">
                <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
              </svg>
            )}
          </button>

          <ul className="flex gap-2">
            {slides.map((slide, index) => (
              <li key={slide.title}>
                <button
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-current={index === current ? "true" : undefined}
                  className={`block h-2.5 rounded-full transition-all ${
                    index === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
