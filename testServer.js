const koa = require('koa');
// const Mysql = require('mysql-pro');
// const router = require('koa-router');
const fs = require('fs');


let server = new koa();
server.listen(8080);




server.use(async ctx =>{
    let f = fs.readFileSync('./www/.topics');
    
    let arr = JSON.parse(f.toString())

    let topics = {}, topic_ID = 1;   //it,title
    let authors = {}, author_ID = 1;
    let question = {}, querstion_ID = 1;
    let answers = {}, answer_ID = 1;
    
    arr.forEach(data => {
        //topic
        /**
         * question 数组  每个数组一个 topic 
         * topic是 数组 只要数组内的title,
         * 需要将topics插入数据库，需要编id
         * 并记录每个 问题对应的topic
         * 添加 topic的关系 记录在 question的 topicsRel上
         */

        data.topicsRel = data.topices.map(topic=>{
            if(!topics[topic.title]){
                
                topics[(topic.title).replace(/^\s+|$\s+|\t+|\n+/g,'')] = topic_ID++;

            }
            return topics[topic.title]
        })

        // //author
        // let authorsArr = [data.bestAnswer.author,...(data.answers).map(answer=>answer.author)];

        // //question
        // let questionsArr = 

        (async ()=>{
           try {
               function dataJoin(...args){
                    return "('"+args.map(item=>{
                    item=item||'';
                    item=item.toString().replace(/'/g, '\\\'');
              
                    return item;
                  }).join("','")+"')";
               }
               let aTopics=[];
               for(let title in topics){
                 let ID=topics[title];
             
                 aTopics.push(dataJoin(ID, title));
               }
               let topic_sql=`INSERT INTO topic_table VALUES${aTopics.join(',')}`;
            //    topic_sql
                await db.startTransaction();
                await db.executeTransaction(topic_sql);
                // await db.executeTransaction(author_sql);
                // await db.executeTransaction(question_sql);
                // await db.executeTransaction(answer_sql);
                await db.stopTransaction();
                console.log('完成');      
               
           } catch (error) {
               
           }
        })()


    });
    ctx.body = topics
})