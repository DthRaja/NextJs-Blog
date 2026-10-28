// The blog list's filters and page live in the URL, so every view can be
// linked and shared: /blogs?category=ca&tag=popular&page=2

export interface BlogListFilters {
  /** Category slug. The API ignores one it doesn't know and lists every post. */
  category?: string;
  /** Tag slug. */
  tag?: string;
  /** 1-based page number. */
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

export function parseBlogFilters(searchParams: SearchParams): BlogListFilters {
  const page = Number(first(searchParams.page));
  return {
    category: first(searchParams.category) || undefined,
    tag: first(searchParams.tag) || undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** URL of the blog list with these filters; page 1 is left out of the URL. */
export function blogsHref({ category, tag, page = 1 }: Partial<BlogListFilters>) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blogs?${query}` : "/blogs";
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
