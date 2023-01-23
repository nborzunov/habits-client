import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig, loadEnv} from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


export default ({mode}) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

    return defineConfig({
        plugins: [react(), tsconfigPaths()],
        server: {
            port: Number(process.env.PORT) || 3000,
        }
    });
}