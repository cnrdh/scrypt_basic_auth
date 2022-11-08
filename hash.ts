import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
if (import.meta.main) {
  const [username, password] = Deno.args;
  const tuple = [username, hash(password)];
  console.log(JSON.stringify(tuple));
}
