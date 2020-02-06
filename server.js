const koa = require('koa')
// const router = require('koa-router')
let server = new koa();

server.listen(8080);

server.use(async ctx=>{
    ctx.response.body = 'hello'
})