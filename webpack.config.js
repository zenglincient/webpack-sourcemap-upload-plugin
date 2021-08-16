const path = require('path')
const UploadPlugin = require('./uploadPlugin')
module.exports = {
    entry: './index.js', // 入口文件
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'), // 必须使用绝对地址，输出文件夹
        filename: "bundle.js", // 打包后输出文件的文件名
        publicPath: 'build/', // 打包后的文件夹
    },
    plugins: [
        new UploadPlugin({
            url: 'http://localhost:8013/api/upload',
            method: 'PUT'
        })
    ]
}