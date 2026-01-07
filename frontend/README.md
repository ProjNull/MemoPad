# MemoPad Frontend (VUE)

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Updating API Client

**NOTE:** This will override old functions in `src/api/` and may break the app!

#### From Remote Server (Main Instance)

```sh
pnpm update-api:remote
```
#### From Local File

The openAPI spec file must be JSON with name `local.openapi.json`

```sh
pnpm update-api:local
```

#### Manualy (Directly with `openapi` cli)

You can also use the openapi cli directly but its not recommended as it can break the app quite easily.

**NOTE:** Include `--useOptions` parameter as thats used internaly.

```sh
openapi --input <INPUT FILE/URL> --output ./src/api/ --client fetch --useOptions
```