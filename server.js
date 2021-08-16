const express = require('express');
const path = require('path')
const fileUpload = require("express-fileupload")
const app = express();

app.use(fileUpload())
const router = express.Router();

router.put('/api/upload', async(req, res) => {
    // 查库
    console.log(req.files, '222')
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }
    const file = req.files.file

    const path = __dirname + "/files/" + file.name;
    console.log(file, path)
    file.mv(path, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send({ status: "success", path: path });
    });

})

app.use(router)


app.listen('8013', () => {
    console.log('启动在 8013 端口')
})