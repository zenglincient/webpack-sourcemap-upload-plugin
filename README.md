# webpack sourceMap 上传插件 demo

## 使用
```bash
npm install webpack-sourcemap-upload-plugin --save-dev

```
```js
// webpack config
const UploadPlugin = require('webpack-sourcemap-upload-plugin')


plugins: [
    new UploadPlugin({
        url: 'http://localhost:8013/api/upload',
        method: 'Put'
    })
]
```


## 开发
```bash
npm install

# 测试跑接收 sourceMap 服务
node server.js

# 转化js
npm run ts

# 测试打包和上传
npm run build
```

