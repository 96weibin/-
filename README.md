# 知乎

## 数据获取

1. 爬虫抓取知乎数据包

2. testServer.js 分析.topic的数据建表、插入数据

    1. mysql-pro模块连接
    2. 使用  ... 拓展运算合并同类型、map遍历，重排id
    3. 将数据存入数据库 

3. 后台使用koa创建项目

    1. port、dir、数据库等信息包成模块 config.js 统一管理
    2. libs目录存放 连接sql程序，可以封装执行事务的方法绑定在client对象上
    3. use空的时候  把 client 绑定到ctx 上，从而各个路由模块都可以使用同一个连接