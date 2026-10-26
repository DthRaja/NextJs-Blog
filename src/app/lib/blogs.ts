import { cache } from "react";
import ServerApi from "@/src/utils/Server";
import convertData from "@/src/utils/convartData";
import type { BlogDetail, BlogListResponse } from "./types";

// Data layer for the blog pages. Both functions return null when the API
// call fails or the result can't be parsed. API failures are logged by
// ServerApi; parse failures are logged here. All of it lands in the server
// console (these run on the server).

export async function getBlogList(): Promise<BlogListResponse | null> {
  const api = new ServerApi({ spName: "SPClientAnonymous", mode: 60 });
  const res = await api.request({ PageNo: 1, CategoryId: 0 });
  if (!res.isSuccess) return null;
  return parseResult<BlogListResponse>(res.result, "getBlogList");
}

// cache() lets generateMetadata and the page share one API call per request.
export const getBlogBySlug = cache(
  async (slug: string): Promise<BlogDetail | null> => {
    const api = new ServerApi({ spName: "SPClientAnonymous", mode: 61 });
    const res = await api.request({ BlogSlug: slug });
    if (!res.isSuccess) return null;
    return parseResult<BlogDetail>(res.result, `getBlogBySlug(${slug})`);
  },
);

// convertData returns false when it can't parse. A literal "null" result is
// valid (unknown slug / no data), so only the false case is an error.
function parseResult<T>(result: unknown, source: string): T | null {
  const data = convertData(result);
  if (data === false) {
    console.error(`[blogs] ${source}: could not parse API result`, {
      resultType: typeof result,
      preview: typeof result === "string" ? result.slice(0, 200) : result,
    });
    return null;
  }
  if (data === null || data === undefined) {
    console.warn(`[blogs] ${source}: API returned no data`);
    return null;
  }
  return data as T;
}
