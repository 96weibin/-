const pathLib = require('path')

module.exports={
    //basic
    port:8080,
    uploadDir : pathLib.resolve('./www/upload'),
    wwwPath:'http://localhost:8080',
    wwwDir : pathLib.resolve('./www'),
    template : pathLib.resolve('./template'),
    logPaht : pathLib.resolve('./log/log.txt'),

    //safe
    secrit_key : ['sjldfjalksdj','uwoieuroiqwe','sapdfiasdopmna','aposfaousd'],

    //database
    db_host : '106.13.116.236',
    db_port : 2020,
    db_database : 'ZhiHu',
    db_user : 'root',
    db_password : 'root1234',

}