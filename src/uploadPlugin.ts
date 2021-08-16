const Path = require('path')
const Fs = require('fs')
const Axios = require('axios')
const FormDatas = require('form-data')
const PLUGIN_NAME = 'UploadSourceMapPlugin'

export interface OptionProps {
  url: string,
  method: 'Get' | 'Put' | 'Post'
}

class UploadSourceMapPlugin {

  public options

  constructor(options: OptionProps) {
    this.options = options
  }

  // 读取map文件
  async getMapAssets(distDir: string) {
    const files = await Fs.promises.readdir(distDir)
    return files.filter((el: string) => /\.js.map$/i.test(el)).map((el: string) => Path.join(distDir, el))
  }

  async upload(filePath: string) {
    const stream = Fs.createReadStream(filePath)
    const formData = new FormDatas()
    formData.append('file', stream)
    return Axios.default({
      url: this.options.url,
      method: this.options.method || 'PUT',
      headers: formData.getHeaders(),
      timeout: 10000,
      data: formData
    }).then().catch((err: {message: string}) => {
      console.error(Path.basename(filePath), err.message)
    })
  }

  apply(compiler: any) {
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