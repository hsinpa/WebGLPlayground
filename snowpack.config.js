// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  "mount": {
    "src": {url: "/docs"},
    "docs": {url : "/", static:true}
   },
  plugins: [  
    [
      '@snowpack/plugin-sass',
      {
        compilerOptions : {
          style : 'compressed'
        }
      }
    ],
    [
      '@snowpack/plugin-typescript',
      {
        args : "--project tsconfig.json"
      }
    ],
  ],
  devOptions: {
    port : 8080,
    open : 'none'
  },
  buildOptions: {
    /* ... */
    out : "docs/builds",
  },
};
