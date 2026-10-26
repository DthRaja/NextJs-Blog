import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-foreground">
        Blog not found
      </h1>
      <p className="mt-3 text-muted">
        The article you are looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/blogs"
        className="mt-8 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-white hover:bg-foreground"
      >
        Back to all blogs
      </Link>
    </main>
  );
}
