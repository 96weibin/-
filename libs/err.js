
module.exports = server => {
    //全局try
    server.use(async (ctx,next)=>{
        try{
            await next();
        } catch (err) {
            console.log(err)
            ctx.body = '服务器正在维护请您稍后重试'
            //根据err 做各种错误处理
        }
    })
}