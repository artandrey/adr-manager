import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

export default {
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
    {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    typescript({
      tsconfig: './tsconfig.prod.json',
    }),
    dts(),
  ],
};
