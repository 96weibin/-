const fs = require('fs');
const config = require('../config')
const pathLib = require('path')


module.exports = server => {
    server.use(async (ctx, next)=>{
        await fs.appendFile(config.logPaht, `[访问日志：${Date.now()} ${ctx.method} ${ctx.url}]\r\n`,(err)=>{
           if(err){
                console.log(err)
           } 
        })
        await next()
    })
}