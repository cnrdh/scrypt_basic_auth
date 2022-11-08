import {
  assertEquals,
} from "https://deno.land/std@0.162.0/testing/asserts.ts ";

import { verify } from "./verify.ts";

export const hash1 =
  "c2NyeXB0AAwAAAAIAAAAATpP+fdQAryDiRmCmcoOrZa2mZ049KdbA/ofTTrATQQ+m0L/gR811d0WQyip6p2skXVEMz2+8U+xGryFu2p0yzfCxYLUrAaIzaZELkN2M6k0";
Deno.test("verify is true on correct password (verified with scrypt)", (): void => {
  assertEquals(verify("password1", hash1), true);
});

Deno.test("verify is false on wrong password (verified with scrypt)", (): void => {
  assertEquals(verify("1", hash1), false);
});
