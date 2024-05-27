import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['main.tsx'],
    bundle: true,
    outfile: 'dist/main.js'
})