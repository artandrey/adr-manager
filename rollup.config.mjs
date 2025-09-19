import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: 'src/lib/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [del({ targets: 'dist/*' }), esbuild()],
  },
  {
    input: 'src/lib/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];
