import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/src/app/lib/format";
import type { BlogListItem } from "@/src/app/lib/types";

export default function BlogCard({
  blog,
  eager = false,
  highPriority = false,
}: {
  blog: BlogListItem;
  /** Load the cover right away instead of lazily (cards above the fold). */
  eager?: boolean;
  /** Fetch the cover first: the likely LCP image. */
  highPriority?: boolean;
}) {
  return (
    <Link
      href={`/blogs/${blog.Slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] ring-1 ring-gray-900/5 transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(16,24,40,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-hero">
        {blog.CoverMediaUrl ? (
          <Image
            src={mediaUrl(blog.CoverMediaUrl)}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            fetchPriority={highPriority ? "high" : "auto"}
            // Card widths in the BlogList grid (gutters and gaps subtracted)
            sizes="(min-width: 1280px) 387px, (min-width: 1024px) calc((100vw - 120px) / 3), (min-width: 640px) calc((100vw - 76px) / 2), calc(100vw - 32px)"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-brand/30">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-16">
              <path d="M2 5.5C4.2 4.4 7.4 4.3 11 6v13.5c-3.6-1.7-6.8-1.6-9-.5V5.5Zm20 0c-2.2-1.1-5.4-1.2-9 .5v13.5c3.6-1.7 6.8-1.6 9-.5V5.5Z" />
            </svg>
          </div>
        )}
        {blog.BlogCategory && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {blog.BlogCategory}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <p className="flex items-center gap-2 font-body text-[13px] font-semibold text-muted">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-4 text-brand"
          >
            <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
            <path d="M3 8.5h14M7 2.5v4M13 2.5v4" strokeLinecap="round" />
          </svg>
          {blog.ScheduledOn || blog.CreatedOn}
        </p>
        <h2 className="mt-2.5 line-clamp-2 wrap-break-word text-xl font-semibold leading-snug text-foreground transition group-hover:text-brand-dark">
          {blog.Title}
        </h2>
        <p className="mt-3 line-clamp-3 wrap-break-word font-body text-[15px] leading-6 text-muted">
          {blog.Excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-bold text-brand-dark">
          Read more
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4 transition group-hover:translate-x-1"
          >
            <path d="M3 10h13m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/5"
    >
      <div className="aspect-16/10 bg-hero" />
      <div className="px-5 pb-6 pt-5">
        <div className="h-3.5 w-36 rounded bg-gray-200" />
        <div className="mt-4 h-5 w-4/5 rounded bg-gray-200" />
        <div className="mt-4 space-y-2">
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 w-2/3 rounded bg-gray-100" />
        </div>
        <div className="mt-7 h-4 w-24 rounded bg-gray-100" />
      </div>
    </div>
  );
}
