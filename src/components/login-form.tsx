// Email/password sign-in form, shared by the /login page and the header's
// login panel. `idPrefix` keeps input ids unique when both are on one page.
// Sign-in isn't wired up yet: the form has no action.
export function LoginForm({ idPrefix = "login" }: { idPrefix?: string }) {
  const inputClass = "rounded border border-line px-3 py-2 focus:border-brand focus:outline-none";
  const labelClass = "font-heading text-sm font-semibold";

  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-email`} className={labelClass}>
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-password`} className={labelClass}>
          Password
        </label>
        <input
          id={`${idPrefix}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded bg-brand px-6 py-3 font-heading font-semibold text-white hover:bg-brand-dark"
      >
        Login
      </button>
    </form>
  );
}
