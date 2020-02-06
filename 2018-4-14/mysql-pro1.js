const koa=require('koa');
const router=require('koa-router');
const Mysql=require('mysql-pro');

const db=new Mysql({
  mysql: {
    host: 'localhost',
    port: 3309,
    user: 'root',
    password: '',
    database: '20180412'
  }
});

const server=new koa();
server.listen(8080);

let r1=router();
server.use(r1.routes());

r1.get('/user', async ctx=>{
  await db.startTransaction();
  let data=await db.executeTransaction("SELECT * FROM user_table");
  await db.stopTransaction();

  console.log(data);
  ctx.response.body=data;
});
