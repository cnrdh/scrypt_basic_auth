type AcceptedOptions = {
  status?: number;
  statusText?: string;
};
export const accepted = (
  { status = 202, statusText = "Accepted" }: AcceptedOptions = {},
): Response =>
  new Response(undefined, {
    status,
    statusText,
  });
type UnauthorizedOptions = {
  realm?: string;
  status?: number;
  statusText?: string;
};
export const unauthorized = (
  { realm, status = 401, statusText = "Unauthorized" }: UnauthorizedOptions =
    {},
): Response =>
  new Response(`${status} ${statusText}`, {
    status,
    statusText,
    headers: {
      "www-authenticate": `Basic realm="${realm}" charset="UTF-8"`,
    },
  });
