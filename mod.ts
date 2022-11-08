import { envname, getEnvUsers, hasEnvPermission } from "./env.ts";
import { accepted, unauthorized } from "./response.ts";
import { Verifier, verify as scryptVerify } from "./verify.ts";
interface Maplike {
  get(name: string): string | undefined;
}
interface Requestlike {
  headers: Maplike;
  method: string;
}
interface AlwaysAccept {
  (request: Request | Requestlike): boolean;
}
export const safeMethods = new Set<string>(["GET", "HEAD", "OPTIONS"]);

export const extractUsernamePassword = (
  request: Request | Requestlike,
): Array<string> | undefined => {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    const match = authorization.match(/^Basic\s+(.*)$/);
    if (match) {
      return atob(match[1]).split(":");
    }
  }
};
export type ScryptBasicAuthOptions = {
  verify?: Verifier;
  realm?: string;
  users?: Map<string, string>;
  accept?: AlwaysAccept;
};
export const scryptBasicAuth = async (
  request: Request | Requestlike,
  { users, realm = "Login required", verify = scryptVerify, accept }:
    ScryptBasicAuthOptions = {},
): Promise<Response> => {
  if (accept && accept(request)) {
    return accepted();
  }

  if (undefined === users) {
    if (await hasEnvPermission(envname)) {
      users = getEnvUsers(envname);
    }
  }

  if (users && users?.size > 0) {
    try {
      const tuple = extractUsernamePassword(request);
      if (tuple) {
        const [username, password] = tuple;
        if (username && password && users.has(username)) {
          const hash = users.get(username);
          if (hash) {
            if (true === await verify(password, hash)) {
              return accepted();
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      return unauthorized({ realm });
    }
  }
  return unauthorized({ realm });
};

export const acceptSafe = (request: Request | Requestlike) =>
  safeMethods.has(request.method);
export const basicAuthUnlessSafe = (
  request: Request | Requestlike,
  options: ScryptBasicAuthOptions = {},
): Promise<Response> =>
  scryptBasicAuth(request, { ...options, accept: acceptSafe });
