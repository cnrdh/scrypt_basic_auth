export const envname = "scrypt_basic_auth_users";

export const hasEnvPermission = async (
  variable: string = envname,
): Promise<boolean> => {
  const { state } = await Deno.permissions.query({
    name: "env",
    variable,
  });
  return "granted" === state;
};

export const getEnvUsers = (envname: string): Map<string, string> => {
  const str = Deno.env.get(envname);
  return str?.trim().startsWith("[[")
    ? new Map<string, string>(JSON.parse(str))
    : new Map();
};
