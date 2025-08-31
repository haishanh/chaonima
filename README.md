<img width="128" height="128" alt="chaonima logo" src="https://github.com/user-attachments/assets/88a087bb-e96c-4676-87d6-4364cb0ff869" />

# chaonima

## Install

 <a href="https://chromewebstore.google.com/detail/chaonima-%E5%90%B5%E6%B3%A5%E9%A9%AC/hpjdgebpmeghdajniclmlfkbablmmnhc">Chrome Web Store</a>


## Development

- __`packages/ext`__, browser extension code, the extension is built using [WXT](https://wxt.dev/).
- __`packages/api`__, a simple backend service built with Deno. The service is running on [Deno Deploy Classic](https://docs.deno.com/deploy/manual/).
- __`packages/preview`__, Vite based React app for preview components for the extension.

Some quick commands to get started:

```sh
# install deps
bun install

bun run -F ext dev
bun run -F preview dev
```
