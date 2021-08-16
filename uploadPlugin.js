"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require('path');
const Fs = require('fs');
const Axios = require('axios');
const FormDatas = require('form-data');
const PLUGIN_NAME = 'UploadSourceMapPlugin';
class UploadSourceMapPlugin {
    constructor(options) {
        this.options = options;
    }
    // 读取map文件
    getMapAssets(distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield Fs.promises.readdir(distDir);
            return files.filter((el) => /\.js.map$/i.test(el)).map((el) => Path.join(distDir, el));
        });
    }
    upload(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = Fs.createReadStream(filePath);
            const formData = new FormDatas();
            formData.append('file', stream);
            formData.append('pathName', this.options.pathName || '');
            return Axios.default({
                url: this.options.url,
                method: this.options.method || 'PUT',
                headers: formData.getHeaders(),
                timeout: 10000,
                data: formData
            }).then().catch((err) => {
                console.error(Path.basename(filePath), err.message);
            });
        });
    }
    apply(compiler) {
        const sourcemapDir = Path.join(compiler.options.output.path);
        compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, () => __awaiter(this, void 0, void 0, function* () {
            const files = yield this.getMapAssets(Path.join(sourcemapDir)); // 只上传 js 的 sourcemap 文件
            console.log(files);
            for (const file of files) {
                yield this.upload(file);
                Fs.unlink(file, () => { });
            }
        }));
    }
}
module.exports = UploadSourceMapPlugin;
