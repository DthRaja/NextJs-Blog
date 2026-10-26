// Shapes returned by the blog API (SPClientAnonymous). The API drops keys
// whose value would be empty, so those are marked optional.

export interface Category {
  CategoryId: number;
  Name: string;
  Slug: string;
}

export interface Tag {
  TagId: number;
  Name: string;
  Slug: string;
}

/** Fields shared by the list (mode 60) and detail (mode 61) responses. */
interface BlogBase {
  PostId: number;
  Title: string;
  Slug: string;
  Excerpt: string;
  IsAllowComments: boolean;
  CoverMediaId?: number;
  /** Cover image URL. May contain raw spaces; pass it through mediaUrl(). */
  CoverMediaUrl?: string;
  MetaDescription?: string;
  MetaKeyWords?: string;
  PageKeyWords?: string;
  /** Publish date, already formatted by the API: "21 Aug 2025, 09:55 PM".
   *  Missing on some posts; fall back to CreatedOn. */
  ScheduledOn?: string;
  CreatedOn: string;
  Status: string;
}

/** One post in the blog list (mode 60). */
export interface BlogListItem extends BlogBase {
  /** Category name. Missing when the post has no category. */
  BlogCategory?: string;
}

/** Response of SPClientAnonymous/60. */
export interface BlogListResponse {
  NoOfPages: number;
  Categories?: Category[];
  BlogList?: BlogListItem[];
}

/** Values of BlogSection.SectionType. */
export const SectionType = {
  /** Image only */
  Image: 0,
  /** Image, then text */
  ImageText: 1,
  /** Text, then image */
  TextImage: 2,
  /** HTML only */
  Text: 3,
} as const;

/** One content block of a post. Sections render in SortedOrder. */
export interface BlogSection {
  ID: number;
  SectionType: number;
  /** HTML body. Empty string for image-only sections. */
  HtmlBody: string;
  DocumentId?: number;
  DocumentUrl?: string;
  SortedOrder: number;
}

/** Response of SPClientAnonymous/61 (a single post). */
export interface BlogDetail extends BlogBase {
  BlogSection?: BlogSection[];
  BlogTags?: Tag[];
  BlogCategory?: Category[];
}
