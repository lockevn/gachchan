// SEE: https://gist.github.com/aleclarson/9900ed2a9a3119d865286b218e14d226
// SEE: https://gist.github.com/aleclarson/9900ed2a9a3119d865286b218e14d226
// https://blog.logrocket.com/using-rollup-package-library-typescript-javascript/
// https://www.thisdot.co/blog/how-to-setup-a-typescript-project-using-rollup-js

// import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: [
    // {
    //   file: 'gachchan.umd.js',
    //   format: 'umd'
    // },
    // {
    //   file: 'gachchan.es.js',
    //   format: 'es'
    // },
    {
      file: 'gachchan.js',
      format: 'cjs',
    },
  ],
  plugins: [nodeResolve()],
}

// https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       '@/': new URL('./src/', import.meta.url).pathname
//     }
//   },
//   build: {
//     target: 'esnext',
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.ts'),
//       name: 'Lakgachchandak',
//       fileName: (format) => `gachchan.${format}.js`
//     },
//     rollupOptions: {
//       // https://rollupjs.org/guide/en/#big-list-of-options

//       // make sure to externalize deps that shouldn't be bundled
//       // into your library
//       // external: ["vue"],
//       output: {
//         // Provide global variables to use in the UMD build
//         // for externalized deps
//         globals: {
//           os: 'os'
//         }
//       }
//     }
//   }
// })
