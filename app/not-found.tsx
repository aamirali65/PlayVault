import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl">🕹️</div>
      <h1 className="font-sora text-4xl font-bold">Game Over!</h1>
      <p className="mt-3 text-lg text-text-muted">Page Not Found</p>
      <p className="mt-1 max-w-md text-sm text-text-muted">
        The page you are looking for does not exist or has been moved.
        Better luck next time!
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-7 text-sm font-medium text-background transition-all hover:brightness-110 active:scale-[0.97]"
      >
        Go Home
      </Link>
    </div>
  );
}
