"use client";

import Link from "next/link";
import { type MouseEvent, useRef } from "react";
import { LoginForm } from "./login-form";

// Header "Login" button that slides in a sign-in panel from the right. It is a
// real link to /login, so it still works before JavaScript loads or when
// opened in a new tab. The native <dialog> handles focus, Esc and the backdrop.
export function LoginPanel() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, new window) follow the link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    event.preventDefault();
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    // showModal() focuses the first button (Close); start on the email field.
    document.getElementById("login-panel-email")?.focus();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Link
        href="/login"
        onClick={open}
        aria-haspopup="dialog"
        className="rounded bg-brand px-4 py-2 font-heading text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Login
      </Link>

      <dialog
        ref={dialogRef}
        aria-labelledby="login-panel-title"
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        // A click on the dialog element itself (not its content) is a click on
        // the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-sm bg-white p-0 text-navy shadow-xl transition-transform duration-200 ease-out backdrop:bg-black/40 starting:open:translate-x-full"
      >
        <div className="flex h-full flex-col p-8">
          <div className="flex items-center justify-between">
            <h2 id="login-panel-title" className="font-heading text-2xl font-bold">
              Login
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-2 rounded p-2 text-2xl leading-none text-muted hover:text-brand"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-muted">Sign in to your account.</p>

          <div className="mt-8">
            <LoginForm idPrefix="login-panel" />
          </div>
        </div>
      </dialog>
    </>
  );
}
