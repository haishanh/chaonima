export async function fetchTextStream(
  url: string,
  init: RequestInit & {
    onmessage: (a: string) => void;
  },
) {
  const res = await fetch(url, init);
  const decoder = new TextDecoder("utf-8");
  // @ts-expect-error res.body is actually a async iterable - it's jut the type is not up to date
  // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#async_iteration
  for await (const c of res.body) {
    const decoded = decoder.decode(c, { stream: true });
    init.onmessage(decoded);
  }
}
