const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/tea-component-formik.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'formik', 'yup', '@tencent/tea-component', 'moment'],
  plugins: [
    nodeResolve(),
    typescript(/*{ plugin options }*/),
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', { modules: false }], '@babel/react'],
      plugins: ['@babel/proposal-class-properties'],
      exclude: 'node_modules/**',
    }),
  ],
};
