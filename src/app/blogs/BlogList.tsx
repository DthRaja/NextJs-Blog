"use client";

import { useState } from "react";
import BlogCard from "@/src/app/components/blog-card";
import type { BlogListItem, Category } from "@/src/app/lib/types";

const ALL = "All";

export default function BlogList({
  blogs,
  categories,
}: {
  blogs: BlogListItem[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  if (blogs.length === 0) {
    return (
      <p className="mt-16 text-center text-muted">
        No blogs have been published yet.
      </p>
    );
  }

  // The API ignores CategoryId, so filtering happens here by category name.
  const visibleBlogs =
    activeCategory === ALL
      ? blogs
      : blogs.filter((blog) => blog.BlogCategory === activeCategory);

  return (
    <>
      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {[ALL, ...categories.map((category) => category.Name)].map((name) => {
            const isActive = name === activeCategory;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(name)}
                className={`cursor-pointer rounded-full px-4.5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-white text-foreground ring-1 ring-gray-200 hover:bg-brand-soft hover:text-brand-dark"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {visibleBlogs.length > 0 ? (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {/* The first row is above the fold; its first card is the LCP image. */}
          {visibleBlogs.map((blog, index) => (
            <BlogCard
              key={blog.PostId}
              blog={blog}
              eager={index < 3}
              highPriority={index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">
          No blogs found in this category.
        </p>
      )}
    </>
  );
}
