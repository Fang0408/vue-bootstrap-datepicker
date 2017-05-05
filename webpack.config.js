var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'dist.js',
        library: 'vue-bootstrap-datepicker',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {

        }
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                // make sure to exclude 3rd party code in node_modules
                exclude: /node_modules/,
                presets: ['es2015']
            }
        ]
    },
    // vue-loader config:
    // lint all JavaScript inside *.vue files with ESLint
    // make sure to adjust your .eslintrc
    vue: {
        loaders: {
            js: 'babel?presets=es2015'
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            } 
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    devtool: '#source-map'
}