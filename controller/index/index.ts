import { IRouterContext } from 'koa-router'

export const index = (ctx: IRouterContext, _: Function) => {
    console.log(ctx.request.header);
    ctx.body = 'here is home.';
}

export const query = (ctx: IRouterContext, _: Function) => {
    // 参数放在url后面：?a=1&b=2
    console.log(ctx.request.query);
    console.log(ctx.request.querystring);
    ctx.body = '参数存放在url后面';
} 

export const test = async (ctx: IRouterContext, next: Function) => {
    await ctx.render('test', {
        pageName: '这里是模板引擎和静态资源处理测试页面'
    });
    await next();
}

export const param = (ctx: IRouterContext, _: Function) => {
    // 参数放在url中
    ctx.body = `参数存放在url中,用户id：${ctx.params.id}`;
}

export const addUser = (ctx: IRouterContext, _: Function) => {
    const {
        name,
        age
    } = ctx.body;
    ctx.body = `post传参：${age}岁的${name}`;
}

export const all = () => {
    console.log('路由处理中间件。');
}
