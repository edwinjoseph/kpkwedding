import { defineConfig } from 'vite';
import solid from 'solid-start/vite';
import vercel from "solid-start-vercel";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    tsconfigPaths(),
    solid({ adapter: vercel() }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
