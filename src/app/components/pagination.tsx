import Link from "next/link";

const pill =
  "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-3.5 text-sm font-semibold transition";
const idle =
  "bg-white text-foreground ring-1 ring-gray-200 hover:bg-brand-soft hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark";

/** Previous / numbered / Next page links. Renders nothing for a single page. */
export default function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <StepLink href={page > 1 ? hrefFor(page - 1) : undefined}>
        <Arrow className="rotate-180" />
        Previous
      </StepLink>

      {pageItems(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={`${pill} ${item === page ? "bg-brand-dark text-white shadow-sm" : idle}`}
          >
            {item}
          </Link>
        ),
      )}

      <StepLink href={page < pageCount ? hrefFor(page + 1) : undefined}>
        Next
        <Arrow />
      </StepLink>
    </nav>
  );
}

/** Previous / Next; shown disabled when there is no page to go to. */
function StepLink({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} className={`${pill} ${idle}`}>
      {children}
    </Link>
  ) : (
    <span aria-disabled="true" className={`${pill} bg-white text-gray-400 ring-1 ring-gray-100`}>
      {children}
    </span>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`size-4 ${className}`}
    >
      <path d="M3 10h13m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// First, last, and the current page with its neighbours, with "…" between:
// 1 … 4 5 6 … 9. A gap that would hide only one page shows that page instead.
function pageItems(page: number, pageCount: number): (number | "gap")[] {
  const shown = (n: number) => n === 1 || n === pageCount || Math.abs(n - page) <= 1;
  const items: (number | "gap")[] = [];
  for (let n = 1; n <= pageCount; n++) {
    if (shown(n) || (shown(n - 1) && shown(n + 1))) items.push(n);
    else if (items.at(-1) !== "gap") items.push("gap");
  }
  return items;
}
