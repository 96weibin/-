const router = require('koa-router')();

//渲染首页
router.get('',async ctx => {
    let limit = 8;
    let nowPage = 1;
    let questions = await ctx.db.execute(`
    SELECT
        qu.ID AS id,
        qu.title AS title,
        an.content AS content,
        au.name AS authorName,
        au.headline AS headline,
        qu.view_count AS view_count,
        qu.attention_count AS attention_count,
        au.img_url AS img_url
    FROM
        question_table AS qu
    LEFT JOIN answer_table AS an ON qu.best_answer_ID = an.ID
    LEFT JOIN author_table AS au ON an.author_ID = au.ID
    LIMIT ${limit} OFFSET ${(nowPage - 1) * limit}
`);
    await ctx.render('list',{questions})
})

//渲染详情页
router.get('detail/:id', async ctx => {
    let {id} = ctx.params;
    let question = (await ctx.db.execute(`
        SELECT
            *
        FROM
            question_table
        WHERE
            ID = ${id}
    `))[0];
    let topics = await ctx.db.execute(`
        SELECT
            *
        FROM
            topic_table
        WHERE
            ID IN (${question.topics})
    `);
    let answers = await ctx.db.execute(`
        SELECT
            an.ID as ID,
            an.content as content,
            au.name as name,
            au.img_url as img_url,
            au.headline as headline,
            au.followerCount as followerCount
        FROM
            answer_table AS an
        LEFT JOIN author_table AS au ON an.author_ID = au.ID
        WHERE
            question_ID = ${id}
    `)
    answers = answers.filter(answer=>{
        if(answer.ID == question.best_answer_ID){
            question.bestAnswer = answer;
            return false
        } else {
            return true
        }
    })
    await ctx.render('item',{
        question,
        topics,
        answers
    })
})
module.exports = router.routes()