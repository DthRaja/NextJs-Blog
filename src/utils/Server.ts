import { unstable_rethrow } from "next/navigation";

export interface ApiResponse {
  statusCode?: number;
  isSuccess?: boolean;
  errorMessages?: Array<string>;
  result: any | undefined;
  error?: any;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

type ServerParams =
  | {
      withAuth: true;
      spName: string;
      mode: number;
      token: string;
    }
  | {
      withAuth?: false;
      spName: string;
      mode: number;
    };

export default class ServerApi {
  private uri: string;
  private withAuth: boolean;
  private token?: string;
  private reqBody: any = {};

  constructor(params: ServerParams) {
    this.uri = params.withAuth
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AuthDataGet/ExecuteJson/${params.spName}/${params.mode}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AnonymousDataGet/ExecuteJson/${params.spName}/${params.mode}`;

    this.withAuth = !!params.withAuth;
    this.token = params.withAuth ? params.token : undefined;
  }

  private async getOrigin(): Promise<string> {
    if (typeof window === "undefined") {
      // The API only accepts registered origins and picks the site from it.
      // Set API_ORIGIN to use one when serving from an address the API doesn't
      // know (LAN IP, preview URL, ...); otherwise the request's own host is used.
      if (process.env.API_ORIGIN) return process.env.API_ORIGIN;

      const { headers } = await import("next/headers");

      const h = await headers();

      const host = h.get("host");

      const protocol = h.get("x-forwarded-proto") || "http";

      return `${protocol}://${host}`;
    }

    return window.location.origin;
  }

  // Never throws: every failure (network, CORS/permission, non-JSON body) comes
  // back as { isSuccess: false } and is logged, so callers only null-check.
  async request(reqBody?: any): Promise<ApiResponse> {
    this.reqBody = reqBody ?? {};

    const origin = await this.getOrigin();

    let res: Response;
    try {
      res = await fetch(this.uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          ...(typeof window === "undefined"
            ? {
                Origin: origin,
              }
            : {}),

          ...(this.withAuth &&
            this.token && {
              Authorization: `Bearer ${this.token}`,
            }),
        },

        body: !!reqBody ? JSON.stringify(reqBody) : "{}",
        cache: "no-store",
      });
    } catch (error) {
      // no-store fetches throw a framework signal to opt the route into
      // dynamic rendering; that must reach Next, not be treated as a failure.
      unstable_rethrow(error);
      return this.fail(
        { origin, error },
        "Network error: the API could not be reached",
      );
    }

    if (res.status === 401) {
      return this.fail({ origin, statusCode: 401 }, "Unauthorized Access");
    }

    let body: ApiResponse;
    try {
      body = await res.json();
    } catch (error) {
      return this.fail(
        { origin, statusCode: res.status, error },
        `API returned a non-JSON response (HTTP ${res.status})`,
      );
    }

    if (!body?.isSuccess) {
      // e.g. 403 "You do not have enough permission to access the api!"
      // when the Origin sent above isn't allowed by the API.
      console.error("[ServerApi] API reported failure", {
        url: this.uri,
        origin,
        httpStatus: res.status,
        statusCode: body?.statusCode,
        errorMessages: body?.errorMessages,
        request: this.reqBody,
      });
    }

    return body ?? { isSuccess: false, result: undefined };
  }

  private fail(
    details: { origin: string; statusCode?: number; error?: unknown },
    message: string,
  ): ApiResponse {
    console.error(`[ServerApi] ${message}`, {
      url: this.uri,
      request: this.reqBody,
      ...details,
    });

    return {
      statusCode: details.statusCode,
      errorMessages: [message],
      isSuccess: false,
      error: details.error,
      result: undefined,
    };
  }

  async refetch(): Promise<ApiResponse> {
    return await this.request(this.reqBody);
  }
}
