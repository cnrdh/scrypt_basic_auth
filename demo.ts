import { scryptBasicAuth } from "./mod.ts";
import { hash1 } from "./verify_test.ts";
import { serve } from "https://deno.land/std@0.162.0/http/server.ts";

const authenticatedResponse = (request: Request) =>
  new Response(`Scrypt basic auth is great 👏 here at ${request.url}`);

const scryptProtected = async (request: Request): Promise<Response> => {
  const users = new Map<string, string>([["user1", hash1]]);

  const response = await scryptBasicAuth(request, { users });
  if (!response.ok) {
    return response;
  }
  return authenticatedResponse(request);
};
serve(scryptProtected);
