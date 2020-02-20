const Mysql = require('mysql-pro');
const config = require('../config');

//连接数据库
let client = new Mysql({
    mysql :{
        host     :   config.db_host,
        port     :   config.db_port,
        database :  config.db_database,
        user     :      config.db_user,
        password :  config.db_password
    }
})

//封装事务
client.execute = async sql =>{
    let res;
    await client.startTransaction();
    if(typeof sql === 'string'){
        res = await client.executeTransaction(sql); 
    } else {
        sql.forEach(async item => {
            res = await client.executeTransaction(sql); 
        });
    }
    client.stopTransaction();
    return res;
}




module.exports = client;