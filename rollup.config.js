const typescript = require('@rollup/plugin-typescript');
const copy = require('rollup-plugin-copy');
const terser = require('@rollup/plugin-terser');

module.exports = {
    input: {
        content: 'src/content.ts'
    },
    output: {
        dir: 'dist',
        format: 'esm'
    },
    plugins: [
        typescript(),
        copy({ targets: [{ src: 'public/*', dest: 'dist' }] }),
        terser()
    ]
};
