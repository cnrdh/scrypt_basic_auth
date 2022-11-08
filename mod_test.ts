import {
  assert as assertTrue,
  assertEquals,
  assertFalse,
} from "https://deno.land/std@0.162.0/testing/asserts.ts ";

import { basicAuthUnlessSafe, safeMethods, scryptBasicAuth } from "./mod.ts";
import { envname } from "./env.ts";
import { hash1 } from "./verify_test.ts";

const { test, env } = Deno;

test("401 response on missing password", async (): Promise<void> => {
  const request = new Request("https://deno.land");
  const { status, ok } = await scryptBasicAuth(request);
  assertFalse(ok);
  assertEquals(status, 401);
});

test("202 response when password is verified from injected users map", async (): Promise<void> => {
  const authorization = `Basic ${btoa("user1:password1")}`;
  const users = new Map<string, string>([["user1", hash1]]);
  const request = new Request("https://deno.land", {
    headers: { authorization },
  });
  const { status, ok } = await scryptBasicAuth(request, { users });
  assertTrue(ok);
  assertEquals(status, 202);
});

test("basicAuthUnlessSafe returns OK on safe methods", async (): Promise<void> => {
  const request = (method: string) =>
    new Request("https://deno.land", { method });
  for await (const method of safeMethods) {
    const { ok } = await basicAuthUnlessSafe(request(method));
    assertEquals(ok, true);
  }
});

test("basicAuthUnlessSafe returns 401 on unsafe methods [no user:password]", async (): Promise<void> => {
  const request = (method: string) =>
    new Request("https://deno.land", { method });
  for await (const method of ["DELETE", "PATCH", "POST", "PUT", "x"]) {
    const { ok } = await basicAuthUnlessSafe(request(method));
    assertFalse(ok);
  }
});

test("202 response when password is verified from users read from env", async (): Promise<void> => {
  env.set(envname, JSON.stringify([["user1", hash1]]));
  const authorization = `Basic ${btoa("user1:password1")}`;

  const request = new Request("https://deno.land", {
    headers: { authorization },
  });
  const { status, ok } = await scryptBasicAuth(request);
  assertTrue(ok);
  assertEquals(status, 202);
});

test("401 response when username is not in users map", async (): Promise<void> => {
  const authorization = `Basic ${btoa("ABC:password1")}`;

  const request = new Request("https://deno.land", {
    headers: { authorization },
  });
  const users = new Map<string, string>([["user1", hash1]]);
  const { status, ok } = await scryptBasicAuth(request, { users });
  assertFalse(ok);
  assertEquals(status, 401);
});

test("401 response when hash is invalid", async (): Promise<void> => {
  const authorization = `Basic ${btoa("user1:password1")}`;

  const request = new Request("https://deno.land", {
    headers: { authorization },
  });
  const badHash = crypto.randomUUID();
  const users = new Map<string, string>([["user1", badHash]]);
  const { status, ok } = await scryptBasicAuth(request, { users });
  assertFalse(ok);
  assertEquals(status, 401);
});
