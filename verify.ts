import {
  verify as scryptVerify,
} from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

export interface Verifier {
  (password: string, hash: string): boolean | Promise<boolean>;
}
export const verify = (
  password: string,
  hash: string,
): boolean | Promise<boolean> => scryptVerify(password, hash);
