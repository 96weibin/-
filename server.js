const Koa = require('koa');
const MainRouter = require('koa-router');
const static = require('koa-static-cache');
const betterBody = require('koa-better-body');
const convert = require('koa-convert');
const session = require('koa-session')
const config = require('./config');
const ejs = require('koa-ejs');
const client = require('./libs/db');
const err = require('./libs/err')
const log = require('./libs/log')

let server = new Koa();
server.listen(config.port);

//错误处理
err(server);
//日志处理
log(server);

//分享连接db
server.use(async (ctx,next) => {
    ctx.db = client;
    await next();
})

//static
server.use(static(config.wwwDir),{
    maxAge : 60 * 60 * 24,
    gzip : true
});
//better-body
server.use(convert(betterBody({
    uploadDir : config.uploadDir,
    keepExtensions : true
})))
//sessoin
server.keys = require('./.keys');
server.use(session({},server));
//ejs
ejs(server,{
    root : config.template,
    layout : false,
    viewExt : 'ejs.html',
    cache : false
})
//router
let mainRouter = new MainRouter();
server.use(mainRouter.routes());
//mainRouters
mainRouter.use('/',require('./routers/index'))