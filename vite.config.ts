import { defineConfig } from 'vite';
import solid from 'solid-start/vite';
import vercel from "solid-start-vercel";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tsconfigPaths from 'vite-tsconfig-paths';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "edwin-joseph",
      project: "kpkwedding",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    solidSvg(),
    solid({ adapter: vercel() }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true
  },
});
