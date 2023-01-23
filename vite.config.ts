import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig, loadEnv} from 'vite';


export default ({mode}: any) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

    return defineConfig({
        plugins: [react(), tsconfigPaths()],
        server: {
            port: Number(process.env.PORT) || 3000,
        }
    });
}