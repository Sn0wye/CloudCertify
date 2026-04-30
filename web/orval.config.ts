import { defineConfig } from 'orval';

export default defineConfig({
  client: {
    input: './openapi.json',
    output: {
      mode: 'split',
      target: './src/http/generated/api.ts',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      baseUrl: 'https://api-cloudcertify.snowye.dev'
    }
  }
});
