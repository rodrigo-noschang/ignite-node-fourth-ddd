# Vitest Globals

Pra não precisar ficar repetindo importação (expect e test, por exemplo) do vitest, vamos criar um global pra ele:

```sh
    $ npm i vite-tsconfig-paths -D
```

Criar um arquivo, na raiz do projeto, `vite.config.ts`:

```ts
    import { defineConfig } from 'vite';
    import tsConfigPaths from 'vite-tsconfig-paths';

    export default defineConfig({
        plugins: [tsConfigPaths()],
        test: {
            globals: true,
        }
    })
```

Agora não precisa mais importar as coisas do vite sempre, mas pro ts não reclamar, precisa is no `tsconfig.json` e mudar:

```json
    {
        "types": [
            "vitest/globals",
        ],
    }
```