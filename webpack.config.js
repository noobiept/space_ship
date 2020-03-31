const path = require('path');

module.exports = function (env, argv) {
  const mode = argv.mode;

  return {
  entry: './source/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: mode === "development" ? "source-map" : false,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
}
};
