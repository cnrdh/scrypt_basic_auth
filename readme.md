# scrypt_basic_auth

[Basic HTTP authentication](https://www.rfc-editor.org/rfc/rfc7617) for
[Deno](https://deno.land), featuring
[scrypt](https://www.rfc-editor.org/rfc/rfc7914) verification of hashed
passwords

Features:

- Written in TypeScript
- 100% test coverage
- Hash verification in WebAssembly via https://deno.land/x/scrypt

[Demo](https://scrypt-basic-auth.deno.dev/) [`user1` / `password1`]

## Use

### Basic :)

Allowed users are read from the environment variable `scrypt_basic_auth_users`:

```js
import { scryptBasicAuth } from "https://deno.land/x/scrypt_basic_auth@1.0.1/mod.ts";

const scryptProtected = (request) => {
  const response = await scryptBasicAuth(request);
  if (!response.ok) {
    return response;
  }
  // Continue with authenticated user
  return new Response("Authenticated");
};
Deno.serve(scryptProtected);
```

### Advanced configuration

The `scryptBasicAuth` handler function is highly configurable. You may for
example inject a custom verifier:

```js
import { verify as argon2Verify } from "https://deno.land/x/argon2@v0.9.2/lib/mod.ts";

const options = {
  verify: async (password, hash) => await argon2Verify(hash, password),
};
const response = await scryptBasicAuth(request, options);
```

## Users and hash generation

### Env format

The `scrypt_basic_auth_users` env variable must store users as a JSON array of
[username, hash] tuples.

```bash
export scrypt_basic_auth_users='[["username","c2N…"]]'
```

To obtain a tuple, run:

```sh
$ deno run hash.ts user1 password1
["user1","c2…"]
```

## Test

```sh
$ deno task test
```

## License

[scrypt_basic_auth](https://github.com/cnrdh/scrypt_basic_auth) is
[MIT](https://github.com/cnrdh/scrypt_basic_auth/blob/main/LICENSE) licensed and
contains portions of code from
[kt3k/basic_auth](https://github.com/kt3k/basic_auth) (also MIT).
