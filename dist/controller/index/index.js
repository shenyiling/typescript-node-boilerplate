"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = (ctx, _) => {
    console.log(ctx.request.header);
    ctx.body = 'here is home.';
};
exports.query = (ctx, _) => {
    console.log(ctx.request.query);
    console.log(ctx.request.querystring);
    ctx.body = '参数存放在url后面';
};
exports.test = async (ctx, next) => {
    await ctx.render('test', {
        pageName: '这里是模板引擎和静态资源处理测试页面'
    });
    await next();
};
exports.param = (ctx, _) => {
    ctx.body = `参数存放在url中,用户id：${ctx.params.id}`;
};
exports.addUser = (ctx, _) => {
    const { name, age } = ctx.body;
    ctx.body = `post传参：${age}岁的${name}`;
};
exports.all = () => {
    console.log('路由处理中间件。');
};
