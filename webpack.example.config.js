module.exports = {
    entry: './example/app.js',
    output: {
        path: './bin',
        filename: 'example.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
            {
                test: /\.s?css$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.(ttf|eot|svg|jpg|png|woff)$/,
                loader: "url-loader"
            },
        ],
    }
};
