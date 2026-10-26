import { cache } from "react";
import ServerApi from "@/src/utils/Server";
import convertData from "@/src/utils/convartData";
import type { BlogDetail, BlogListResponse } from "./types";

// Data layer for the blog pages. Both functions return null when the API
// call fails or the result can't be parsed.

export async function getBlogList(): Promise<BlogListResponse | null> {
  const api = new ServerApi({ spName: "SPClientAnonymous", mode: 60 });
  const res = await api.request({ PageNo: 1, CategoryId: 0 });
  if (!res.isSuccess) return null;
  return convertData(res.result) || null;
}

// cache() lets generateMetadata and the page share one API call per request.
export const getBlogBySlug = cache(
  async (slug: string): Promise<BlogDetail | null> => {
    const api = new ServerApi({ spName: "SPClientAnonymous", mode: 61 });
    const res = await api.request({ BlogSlug: slug });
    if (!res.isSuccess) return null;
    // An unknown slug comes back as a "null" result.
    return convertData(res.result) || null;
  },
);
