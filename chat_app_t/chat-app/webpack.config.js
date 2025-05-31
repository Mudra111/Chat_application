const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: true,
      reportFilename: "bundle-report.html",
    }),
  ],
};
// "builder": "@angular-devkit/build-angular:application",
// "browser": "src/main.ts",
// "server": "src/main.server.ts",
// "outputMode": "server",
// "ssr": {
//   "entry": "src/server.ts"
// }
