/** CMS media URLs can contain raw spaces (the tenant's folder name). */
export function mediaUrl(url: string) {
  return url.replaceAll(" ", "%20");
}

/** Estimated reading time in minutes, based on ~200 words per minute. */
export function readingTime(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
