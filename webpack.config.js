const Path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function (env, argv) {
    const mode = argv.mode;

    return {
        entry: "./source/main.ts",
        output: {
            filename: "bundle.js",
            path: Path.resolve(__dirname, "dist"),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        devtool: mode === "development" ? "source-map" : false,
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: "index.html",
                    to: "index.html",
                },
                {
                    from: "css/",
                    to: "css/",
                },
                {
                    from: "libraries/",
                    to: "libraries/",
                },
                {
                    from: "sound/",
                    to: "sound/",
                },
                {
                    from: "maps/",
                    to: "maps/",
                },
                {
                    from: "images/*.png",
                    to: "./",
                },
            ]),
        ],
    };
};
