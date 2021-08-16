const Path = require('path')
const Fs = require('fs')
const Axios = require('axios')
const FormData = require('form-data')
const PLUGIN_NAME = 'UploadSourceMapPlugin'

class UploadSourceMapPlugin {
  constructor(options) {
    this.options = options
  }

  // 读取map文件
  async getMapAssets(distDir) {
    const files = await Fs.promises.readdir(distDir)
    return files.filter(el => /\.js.map$/i.test(el)).map(el => Path.join(distDir, el))
  }

  async upload(filePath) {
    const stream = Fs.createReadStream(filePath)
    const formData = new FormData()
    formData.append('file', stream)
    return Axios.default({
      url: this.options.url,
      method: this.options.method || 'PUT',
      headers: formData.getHeaders(),
      timeout: 10000,
      data: formData
    }).then().catch((err) => {
      console.error(Path.basename(filePath), err.message)
    })
  }

  apply(compiler) {
    const sourcemapDir = Path.join(compiler.options.output.path)
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async() => {
      const files = await this.getMapAssets(Path.join(sourcemapDir)) // 只上传 js 的 sourcemap 文件
      console.log(files)
      for (const file of files) {
        await this.upload(file)
        Fs.unlink(file, () =>{})
      }
      
    })
  }
}

module.exports = UploadSourceMapPlugin