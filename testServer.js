const koa = require('koa');
const koaRouter = require('koa-router');
const fs = require('fs');
const Mysql = require('mysql-pro');
const config = require('./config')

let app = new koa();
app.listen(8080);

let router = koaRouter();
app.use(router.routes());


let client = new Mysql({
    mysql :{
        host : config.db_host,
        port : config.db_port,
        database : config.db_database,
        user : config.db_user,
        password : config.db_password
    }
})

let topics = {}, topic_ID = 1;
let authors = {}, author_ID = 1;
let questions = {}, question_ID = 1;
let answers = {}, answer_ID = 1;

router.get('/',async ctx=>{
    let f1 = fs.readFileSync('./.topics');
    let json = JSON.parse(f1.toString());
    // console.log(json[0].bestAnswer)

    json.forEach(question => {

        //topic 
        question.topics = question.topices.map(top => {
            let title = top.title;
            // let url = top.url;
            title = title.replace(/^[\r\f\t\n]+|[\n\r\f\t]+$/g,'');
            if(topics[title]){
                return topics[title]
            } else {
                topics[title] = topic_ID ++;
                return topics[title]
            }
        })


        //author

        let allAuthor = [question.bestAnswer.author, ...question.answers.map(answer=>answer.author)].forEach((author,index)=>{
            let old_ID = author.id;
            if(!authors[old_ID]){
                authors[old_ID] = author;
                author.id = author_ID ++;
            }
                /**
                 * 遍历所有 author
                 * 对没有的author 加入 authors 并修改此author的新id
                 * 需要将 answer 内存的authorid  也进行更改
                 */
            if(index == 0){
                delete question.bestAnswer.author;
                question.bestAnswer.author_ID = old_ID;
            } else {
                delete question.answers[index-1].author;
                question.answers[index-1].author_ID = old_ID;
            }
            // return authors[old_ID]
            //这里返回值也没有用啊
        })

        //question
        let ID =  question_ID;
        questions[question_ID++] = question;

        //answers
        [question.bestAnswer,...question.answers].forEach(answer=>{
            answer.id = answer_ID;
            answer.question_ID = ID
            answers[answer_ID ++] = answer;
        })
    });

    // console.log(authors['2a55fb1b7f5995d9fdad7e818e61599a'])
    
    (async ()=>{
        try {

            //插入 topics
            var allTopic = []
            for(title in topics){
                let id = topics[title];
                allTopic.push(dataJoin(id,title));
            }
            let topicSql = `INSERT INTO topic_table VALUES ${allTopic.join(',')}`;
            
            //插入author

            var allAuthors = [];
            for(let id in authors){
                let author = authors[id];
                allAuthors.push(dataJoin(author.id,author.type,author.name,author.gender,author.userType,author.avatarUrl,author.headline,author.followerCount))
            }
            let authorSql = `INSERT INTO author_table VALUES ${allAuthors.join(',')}`;


            //插入question
            let allQuestions = [];
            for(let id in questions){
                let question = questions[id];
                allQuestions.push(dataJoin(question.ID,question.title,question.question_content,question.topics,question.attention_count,question.view_count,question.bestAnswer.id))
            }
            let questionSql = `INSERT INTO question_table VALUES ${allQuestions.join(',')}`;

            //插入answer

            let allAnswers = [];
            for(let id in answers){
                let answer = answers[id];
                allAnswers.push(dataJoin(id, answer.question_ID, authors[answer.author_ID].id,answer.content, answer.createdTime ))
            }

            let answerSql = `INSERT INTO answer_table VALUES ${allAnswers.join(',')}`;

            // console.log(authorSql)

            client.startTransaction();
            let iTopic = await client.executeTransaction(topicSql);
            let iAuthor = await client.executeTransaction(authorSql);
            let iQuestion = await client.executeTransaction(questionSql);
            let iAnswer = await client.executeTransaction(answerSql);
            client.stopTransaction();
            console.log('完成')
            function dataJoin(...args){
                return "('" + args.map(item=>{
                    item = item || '';
                    item = item.toString().replace(/'/g,'\\\'');
                    return item
                }).join("','") + "')"
            }
        } catch (error) {
            console.log(error)
        }
    })()
})




