// lucide-react dropped brand/logo icons a while back, so these two are
// hand-rolled — standard glyphs, currentColor fill so they inherit
// surrounding text color exactly like the lucide icons used elsewhere.

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.5 8.5h-2c-.55 0-1 .45-1 1v2h3l-.4 3h-2.6v7h-3v-7H7.5v-3h1.9V9c0-2.2 1.3-3.8 3.5-3.8h2.6z"
        fill="currentColor"
      />
    </svg>
  );
}
