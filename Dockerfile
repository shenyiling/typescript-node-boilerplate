# 基础镜像
FROM node:8.9-alpine
# 声明作者
MAINTAINER shenyiling
# 移动项目下面的文件到koa-introduction目录下
ADD . /koa-introduction/
ADD ./views /koa-introduction/dist/
ADD ./log /koa-introduction/dist/
# 进入到koa-introduction目录下面，类似cd
WORKDIR /koa-introduction
# 安装依赖
RUN npm install
# 暴露3002端口
EXPOSE 3002
# 程序启动
CMD ["yarn", "start"]