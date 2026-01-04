import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get repository name from environment or default to root
const getBasePath = () => {
    if (process.env.GITHUB_REPOSITORY) {
        const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
        // If it's a user/organization page (ends with .github.io), use root
        if (repoName.endsWith('.github.io')) {
            return '/';
        }
        // Otherwise, use the repo name as base path
        return `/${repoName}/`;
    }
    return '/';
};

export default defineConfig({
    plugins: [react()],
    base: getBasePath(),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
    },
})
