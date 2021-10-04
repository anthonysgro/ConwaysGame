const path = require("path");

const webpackConfig = {
    entry: {
        path: path.join(__dirname, "./src/script.js"),
    },
    output: {
        path: path.join(__dirname, "./public/dist"),
        filename: "main.js",
    },
};

module.exports = webpackConfig;