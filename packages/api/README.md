## Development

Make sure you have Deno installed already.

> [!NOTE]
> We are using Deno here since this service will be deployed to [Deno Deploy Classic](https://docs.deno.com/deploy/manual/). And we obviously want to use Deno for development as well.

Create a `.env` file with below fields filled:

```sh
GEMINI_API_KEY=""
API_KEYS=""
```

Run the service locally

```sh
deno task start
```

## Deployment

```sh
deployctl deploy
```
