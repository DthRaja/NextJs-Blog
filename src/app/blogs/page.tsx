import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCardSkeleton } from "@/src/app/components/blog-card";
import { getBlogList } from "@/src/app/lib/blogs";
import {
  blogsHref,
  parseBlogFilters,
  type BlogListFilters,
} from "@/src/app/lib/filters";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Latest Blogs",
};

const HOME_URL = "https://abhimanyyuagarrwal.com/";

export default async function BlogsPage({ searchParams }: PageProps<"/blogs">) {
  const filters = parseBlogFilters(await searchParams);

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

      {/* The list streams in behind this fallback while the header above is
          already on screen. The key changes with the filters and page, so
          switching them shows the skeleton instead of leaving the old list
          up with no sign that anything is loading. */}
      <Suspense key={blogsHref(filters)} fallback={<BlogListSkeleton />}>
        <Blogs filters={filters} />
      </Suspense>
    </main>
  );
}

async function Blogs({ filters }: { filters: BlogListFilters }) {
  const data = await getBlogList(filters);

  if (!data) {
    return (
      <p className="mt-16 text-center text-muted">
        We couldn&apos;t load the blogs right now. Please try again later.
      </p>
    );
  }

  return (
    <BlogList
      blogs={data.BlogList ?? []}
      categories={data.Categories ?? []}
      filters={filters}
      pageCount={data.NoOfPages}
    />
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
