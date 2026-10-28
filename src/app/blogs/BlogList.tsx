import Link from "next/link";
import BlogCard from "@/src/app/components/blog-card";
import Pagination from "@/src/app/components/pagination";
import { blogsHref, type BlogListFilters } from "@/src/app/lib/filters";
import type { BlogListItem, Category } from "@/src/app/lib/types";

const pill =
  "rounded-full px-4.5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark";

export default function BlogList({
  blogs,
  categories,
  filters,
  pageCount,
}: {
  blogs: BlogListItem[];
  categories: Category[];
  filters: BlogListFilters;
  pageCount: number;
}) {
  const { category, tag, page } = filters;
  // An unknown category slug gets every post from the API, so "All" is active.
  const activeCategory = categories.find((c) => c.Slug === category);

  if (blogs.length === 0 && !category && !tag && page === 1) {
    return (
      <p className="mt-16 text-center text-muted">
        No blogs have been published yet.
      </p>
    );
  }

  // Filter links keep the other filter and go back to page 1. scroll={false}
  // keeps the page still, since the filters sit right above the list.
  return (
    <>
      {(categories.length > 0 || tag) && (
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {[{ Name: "All", Slug: undefined }, ...categories].map(({ Name, Slug }) => {
            const isActive = Slug === activeCategory?.Slug;
            return (
              <Link
                key={Slug ?? ""}
                href={blogsHref({ category: Slug, tag })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={`${pill} ${
                  isActive
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-white text-foreground ring-1 ring-gray-200 hover:bg-brand-soft hover:text-brand-dark"
                }`}
              >
                {Name}
              </Link>
            );
          })}
          {tag && (
            <Link
              href={blogsHref({ category: activeCategory?.Slug })}
              scroll={false}
              aria-label={`Remove tag filter #${tag}`}
              className={`${pill} inline-flex items-center gap-1.5 bg-brand-soft text-brand-dark ring-1 ring-brand/30 hover:bg-white`}
            >
              #{tag}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-3.5"
              >
                <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>
      )}

      {blogs.length > 0 ? (
        <>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {/* The first row is above the fold; its first card is the LCP image. */}
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.PostId}
                blog={blog}
                eager={index < 3}
                highPriority={index === 0}
              />
            ))}
          </div>
          <Pagination
            page={page}
            pageCount={pageCount}
            hrefFor={(n) => blogsHref({ ...filters, page: n })}
          />
        </>
      ) : (
        // Past the last page the API returns no posts.
        <div className="mt-16 text-center text-muted">
          <p>
            {page > 1
              ? `Page ${page} doesn't exist.`
              : "No blogs found for this filter."}
          </p>
          <Link
            href={page > 1 ? blogsHref({ ...filters, page: 1 }) : blogsHref({})}
            className="mt-3 inline-block font-semibold text-brand-dark hover:underline"
          >
            {page > 1 ? "Go to the first page" : "See all blogs"}
          </Link>
        </div>
      )}
    </>
  );
}
