export function SiteFooter() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <p>Copyright © True Jesus Church · All Rights Reserved</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Find a Church</a>
          <a href="#" className="hover:text-white">Get in Touch</a>
        </div>
      </div>
    </footer>
  );
}
