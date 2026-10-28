import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBlogBySlug } from "@/src/app/lib/blogs";
import { blogsHref } from "@/src/app/lib/filters";
import { mediaUrl, readingTime } from "@/src/app/lib/format";
import { SectionType, type BlogSection } from "@/src/app/lib/types";

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog not found" };

  const description = blog.MetaDescription || blog.Excerpt;
  const image =
    blog.CoverMediaUrl ??
    blog.BlogSection?.find((section) => section.DocumentUrl)?.DocumentUrl;

  return {
    title: blog.Title,
    description,
    keywords: blog.MetaKeyWords || undefined,
    openGraph: {
      title: blog.Title,
      description,
      images: image ? [mediaUrl(image)] : undefined,
    },
  };
}

export default function BlogDetailsPage({
  params,
}: PageProps<"/blogs/[slug]">) {
  // params and the API call are request-time data, so the post streams in
  // behind this fallback.
  return (
    <main className="flex-1">
      <Suspense fallback={<BlogDetailsSkeleton />}>
        <BlogDetails params={params} />
      </Suspense>
    </main>
  );
}

async function BlogDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(decodeURIComponent(slug));
  if (!blog) notFound();

  const sections = [...(blog.BlogSection ?? [])].sort(
    (a, b) => a.SortedOrder - b.SortedOrder,
  );
  const minutes = readingTime(sections.map((s) => s.HtmlBody).join(" "));
  const categories = blog.BlogCategory ?? [];
  const tags = blog.BlogTags ?? [];

  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto max-w-340 px-4 pb-16 pt-5 sm:px-6 lg:px-9">
          <BackLink />

          <div
            className={`mt-8 grid items-start gap-10 ${blog.CoverMediaUrl ? "lg:grid-cols-2" : "max-w-4xl"}`}
          >
            <div>
              <p className="font-body text-[15px] font-semibold text-muted">
                {blog.ScheduledOn || blog.CreatedOn} · {minutes} min read
              </p>
              <h1 className="mt-4 wrap-break-word font-display text-4xl font-medium leading-[1.2] tracking-tight text-foreground sm:text-[44px]">
                {blog.Title}
              </h1>
              {blog.Excerpt && (
                <p className="mt-6 font-body text-lg leading-[1.7] text-muted">
                  {blog.Excerpt}
                </p>
              )}

              {(categories.length > 0 || tags.length > 0) && (
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {/* Each chip opens the blog list filtered by it. */}
                  {categories.map((category) => (
                    <Link
                      key={`c-${category.CategoryId}`}
                      href={blogsHref({ category: category.Slug })}
                      className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                    >
                      {category.Name}
                    </Link>
                  ))}
                  {tags.map((tag) => (
                    <Link
                      key={`t-${tag.TagId}`}
                      href={blogsHref({ tag: tag.Slug })}
                      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-dark ring-1 ring-brand/30 transition hover:bg-brand-soft"
                    >
                      #{tag.Name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {blog.CoverMediaUrl && (
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-800/80 shadow-sm">
                <Image
                  src={mediaUrl(blog.CoverMediaUrl)}
                  alt=""
                  fill
                  preload
                  sizes="(min-width: 1024px) 650px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-340 px-4 pb-20 pt-5 sm:px-6 lg:px-9">
        <article className="rounded-3xl border border-gray-200 bg-white px-5 py-7 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:px-10 sm:py-10">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-brand-dark">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M2 5.5C4.2 4.4 7.4 4.3 11 6v13.5c-3.6-1.7-6.8-1.6-9-.5V5.5Zm20 0c-2.2-1.1-5.4-1.2-9 .5v13.5c3.6-1.7 6.8-1.6 9-.5V5.5Z" />
              </svg>
              Article content
            </h2>
            <span className="text-sm font-medium text-muted">
              {minutes} minute read
            </span>
          </div>

          {sections.length > 0 ? (
            <div className="mt-8 space-y-10">
              {sections.map((section) => (
                <SectionBlock key={section.ID} section={section} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-muted">This article has no content yet.</p>
          )}
        </article>
      </div>
    </>
  );
}

function SectionBlock({ section }: { section: BlogSection }) {
  const html = section.HtmlBody?.trim();

  // The API doesn't send image dimensions: width/height only set the
  // placeholder ratio, and h-auto keeps each image's real ratio once loaded.
  const image = section.DocumentUrl ? (
    <Image
      src={mediaUrl(section.DocumentUrl)}
      alt=""
      width={1200}
      height={675}
      sizes={html ? "(min-width: 768px) 640px, 100vw" : "(min-width: 1360px) 1280px, 100vw"}
      className="h-auto w-full rounded-2xl border border-gray-200"
    />
  ) : null;

  const text = html ? (
    <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
  ) : null;

  if (image && text) {
    const textFirst = section.SectionType === SectionType.TextImage;
    return (
      <div className="grid items-center gap-8 md:grid-cols-2">
        {textFirst ? text : image}
        {textFirst ? image : text}
      </div>
    );
  }

  return image ?? text;
}

function BackLink() {
  return (
    <Link
      href="/blogs"
      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-foreground"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
      >
        <path d="M17 10H4m4-4-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to all blogs
    </Link>
  );
}

function BlogDetailsSkeleton() {
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto max-w-340 px-4 pb-16 pt-5 sm:px-6 lg:px-9">
          <BackLink />
          <div aria-hidden="true" className="mt-8 grid animate-pulse gap-10 lg:grid-cols-2">
            <div>
              <div className="h-4 w-48 rounded bg-white/70" />
              <div className="mt-5 h-10 w-4/5 rounded bg-white/70" />
              <div className="mt-6 h-4 w-full rounded bg-white/60" />
              <div className="mt-2 h-4 w-2/3 rounded bg-white/60" />
            </div>
            <div className="aspect-video rounded-2xl bg-white/60" />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-340 px-4 pb-20 pt-5 sm:px-6 lg:px-9">
        <div
          aria-hidden="true"
          className="h-96 animate-pulse rounded-3xl border border-gray-200 bg-white"
        />
      </div>
    </>
  );
}
