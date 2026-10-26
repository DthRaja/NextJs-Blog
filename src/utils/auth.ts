// import { jwtDecode } from "jwt-decode";
// import { ApiResponse } from "./Server";

// export default class Auth {
//   // async setCookie(data: ICookieModel): Promise<ApiResponse> {
//   //   const res = await fetch("/api/cookie/set-cookie", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(data),
//   //   });
//   //   const json = await res.json();
//   //   return json;
//   // }

//   async getJWTToken(): Promise<string | undefined> {
//     const res = await fetch("/api/cookie/get-cookie?name=authtoken");
//     if (res.ok) {
//       const json: ApiResponse = await res.json();
//       return json.result?.value ?? "";
//     } else {
//       return undefined;
//     }
//   }

//   async authJWTDecode(): Promise<IUserModel | undefined> {
//     const token = await this.getJWTToken();
//     if (token) {
//       const user: IUserModel = jwtDecode(token);
//       return user;
//     } else {
//       return undefined;
//     }
//   }

//   async authenticationCheck(): Promise<boolean> {
//     const token = await this.getJWTToken();
//     if (token) {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/auth/authentication`,
//         {
//           method: "POST",
//           headers: {
//             accept: "text/plain",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       return await res.json();
//     } else {
//       return false;
//     }
//   }
// }

// export interface ICookieModel {
//   name: string;
//   value: string;
//   httpOnly?: boolean;
//   secure?: boolean;
//   sameSite?: string;
//   maxAge?: number;
//   path?: string;
//   domain?: string;
// }

// export interface IUserModel {
//   FirstName: string;
//   LastName: string;
//   nameid: string;
//   FranchiseId: string;
//   Mobile: string;
//   WhatsApp: string;
//   email: string;
//   role: string;
//   nbf: number;
//   exp: number;
//   iat: number;
// }
