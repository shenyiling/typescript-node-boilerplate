"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const bodyParser = require("koa-body");
const serve = require("koa-static");
const config = require("config");
const cors = require("koa2-cors");
const shortid = require("shortid");
const nunjucks = require("koa-nunjucks-2");
const chalk_1 = require("chalk");
const router_1 = require("./router");
const account_1 = require("./router/account");
const apiTest_1 = require("./router/apiTest");
const githubApi_1 = require("./router/githubApi");
const upload_1 = require("./router/upload");
const crawler_1 = require("./router/crawler");
const student_1 = require("./router/student");
const constants_1 = require("./constants");
const db_1 = require("./models/db");
const mysql_1 = require("./models/mysql");
const utils_1 = require("./utils");
const hostname = config.get('host.hostname');
const port = config.get('host.port');
const staticDirPath = '.' + path.resolve(__dirname, '/static');
const logFilePath = path.resolve(__dirname, 'log/app.log');
const errorFilePath = path.resolve(__dirname, 'log/error.log');
const mongooseStart = new db_1.default();
mongooseStart.setUpDb();
mysql_1.default.testConnection();
const app = new Koa();
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        ctx.response.status = err.status;
        ctx.body = utils_1.genErrRes(err);
        const errorLog = `${new Date()} 发生错误:\n${err.stack}\n`;
        fs.appendFileSync(errorFilePath, errorLog);
    }
});
app.use(async (ctx, next) => {
    const sTime = Date.now();
    await next();
    const eTime = Date.now();
    const log = `请求地址：${ctx.path},请求方法：${ctx.request.method},响应时间：${eTime - sTime}ms,响应状态:${ctx.response.status}--请求时间：${new Date()}\n`;
    console.log(chalk_1.default.green(log));
    fs.appendFileSync(logFilePath, log);
});
app.use(serve(staticDirPath));
app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}));
app.use(bodyParser({
    formidable: {
        uploadDir: __dirname + '/static',
        keepExtensions: true,
        onFileBegin(_, file) {
            const { path: filePath, type } = file;
            const paths = filePath.split('/');
            const suffixReg = /^(.*)(\..*)$/;
            const suffix = suffixReg.exec(paths[paths.length - 1])[2];
            let dirName;
            if (constants_1.mimeCollections.imgType.includes(type)) {
                dirName = 'imgs';
            }
            else if (constants_1.mimeCollections.musicType.includes(type)) {
                dirName = 'music';
            }
            else {
                return null;
            }
            file.path = path.resolve(paths.slice(0, -1).join('/'), dirName, `${shortid.generate()}${suffix}`);
        }
    },
    multipart: true,
    urlencoded: true
}));
app.use(cors());
app.use(router_1.default.routes());
app.use(account_1.default.routes());
app.use(apiTest_1.default.routes());
app.use(githubApi_1.default.routes());
app.use(upload_1.default.routes());
app.use(crawler_1.default.routes());
app.use(student_1.default.routes());
app.listen(port, () => {
    console.log(chalk_1.default.green(`server is running at ${hostname}:${port}`));
    console.log(process.env.NODE_ENV);
});
