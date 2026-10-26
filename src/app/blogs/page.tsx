import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCardSkeleton } from "@/src/app/components/blog-card";
import { getBlogList } from "@/src/app/lib/blogs";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Latest Blogs",
};

const HOME_URL = "https://abhimanyyuagarrwal.com/";

export default function BlogsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <a
        href={HOME_URL}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-gray-200 transition hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-4"
        >
          <path
            d="M3 9.5 10 3.5l7 6V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1V9.5Z"
            strokeLinejoin="round"
          />
        </svg>
        Home
      </a>

      <header className="mt-4 text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-foreground">
          Latest <span className="text-brand-dark">Blogs</span>
        </h1>
        <p className="mt-4 text-[17px] text-muted">
          Explore our latest articles, insights and updates from the CA domain.
        </p>
      </header>

      {/* The API call reads request headers, so it runs at request time and
          streams in behind this fallback while the header above prerenders. */}
      <Suspense fallback={<BlogListSkeleton />}>
        <Blogs />
      </Suspense>
    </main>
  );
}

async function Blogs() {
  const data = await getBlogList();

  if (!data) {
    return (
      <p className="mt-16 text-center text-muted">
        We couldn&apos;t load the blogs right now. Please try again later.
      </p>
    );
  }

  return (
    <BlogList blogs={data.BlogList ?? []} categories={data.Categories ?? []} />
  );
}

function BlogListSkeleton() {
  return (
    <>
      <div aria-hidden="true" className="mt-10 flex animate-pulse justify-center gap-2.5">
        <div className="h-10 w-16 rounded-full bg-white" />
        <div className="h-10 w-28 rounded-full bg-white" />
        <div className="h-10 w-32 rounded-full bg-white" />
      </div>
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <BlogCardSkeleton />
        <BlogCardSkeleton />
        <BlogCardSkeleton />
      </div>
    </>
  );
}
