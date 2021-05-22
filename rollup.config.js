import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
// import { terser } from "rollup-plugin-terser"

export default [{
    input: './src/client/main.tsx',
    output: {
        name: 'main',
        file: 'js/main.js',
        format: 'iife',
        sourcemap: true,
        extend: true
    },
    plugins: [
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        typescript({
            sourceMap: true
        }),
        nodeResolve(),
        commonjs(),
        // terser()
    ]
}, {
    input: './src/server/main.ts',
    output: {
        name: 'server',
        file: 'js/server.js',
        format: 'cjs',
        sourcemap: true,
        extend: true
    },
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    "isolatedModules": false
                }
            }               
        }),
        nodeResolve(),
        commonjs(),
        // terser()
    ]
}]

