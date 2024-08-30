const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

// environments
const devEnv = require("./environments/env.dev.json");
const stagEnv = require("./environments/env.stag.json");
const prodEnv = require("./environments/env.prod.json");
const clientstagEnv = require("./environments/env.clientstag.json");

const environment = {
  development: devEnv,
  staging: stagEnv,
  production: prodEnv,
  clientstag: clientstagEnv,
};

const defaultENV = devEnv;

const nextConfig = {
  // enabled custom build directory
  distDir: "build",

  // Add environment variables
  env: isDev ? devEnv : {},

  publicRuntimeConfig: environment[process.env.ENV] || defaultENV,

  // Disabling x-powered-by
  poweredByHeader: false,

  // Etag
  generateEtags: true,

  // urls like /cloud will redirect to /cloud/
  trailingSlash: true,

  // Use the CDN in production and localhost for development.
  // assetPrefix: isProd ? 'https://brainvire.com' : 'http://localhost:3003',

  // High-level 301 redirects
  // experimental: {
  //     redirects() {
  //         return [
  //             {
  //                 source: "/<old-link>",
  //                 destination: "/<new-link>",
  //                 permanent: true
  //             }
  //         ];
  //     }
  // },

  //   pwa: {
  //     dest: "public",
  //     disable: isDev,
  //   },

  // modify the `config` here
  webpack: (config, _options) => {
    // const originalEntry = config.entry;
    // config.entry = async () => {
    //   const entries = await originalEntry();
    //   if (entries["main.js"]) {
    //     entries["main.js"].unshift("./config/polyfills.js");
    //   }
    //   return entries;
    // };

    config.resolve.alias = {
      ...config.resolve.alias,
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@util": path.resolve(__dirname, "./src/util"),
      "@type": path.resolve(__dirname, "./src/@types"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@constant": path.resolve(__dirname, "./src/constant"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@templates": path.resolve(__dirname, "./src/templates"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@metadata": path.resolve(__dirname, "./src/metadata"),
    };

    config.plugins.push(
      new CompressionPlugin({
        algorithm: "gzip",
      })
    );

    // config.plugins.push( new BundleAnalyzerPlugin());

    return config;
  },

  // Compress
  compress: true,
  images: {
    domains: ["s3.ap-south-1.amazonaws.com", "img.youtube.com", "www.facebook.com"],
  },

};

module.exports = nextConfig;
