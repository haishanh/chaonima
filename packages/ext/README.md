## Development

```bash
cp env.example .env

# fill those env vars in .env

bun run -F ext dev
```

## Publish

For Chrome only

1. Bump verion in `package.json`
2. Build and zip

    ```bash
    bun run build
    bun run zip
    ````

3. Go to the _Chrome Web Store Developer Dashbaord_ page of the extension. Select "Upload new package". Select the zip file named like `ext-x.x.x-chrome.zip` from the `.output` dir.
