import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
 
export default {
    input: './src/main.tsx',
    output: {
      name: 'react003',
      file: 'js/main.js',
      format: 'iife',
      sourcemap: true
    },
    plugins: [
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify( 'production' )
        }),
        typescript({
            sourceMap: true
        }),
        nodeResolve(),
        commonjs(),
    ]
}
