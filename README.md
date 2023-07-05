# BG-CMS-Koa2

内容管理系统后台，使用`Koa2`进行实现，主要功能有：
- 账号密码注册和登录功能
- 用户权限管理功能

> 详细文档放在 https://github.com/wbccb/cms-docs


## 项目目标
1. 掌握`Koa2`开发后台服务器的能力
2. 掌握`docker`、`ngnix`等相关后台技能
3. 掌握`MySQL`等数据库的操作
4. 结合软考中数据库相关设计，进行理论和实践的结合


## 启动服务器nodemon

使用`nodemon`进行`app.js`的启动，可以监听文件的改动变化，当代码改变时，自动重启服务
```shell
{
  "scripts": {
    "dev": "nodemon src/app.js"
  }
}
```


## 框架设计


### 代码结构设计

- api: 路由封装
- config: 全局配置的常量
- dao: 数据库表操作
- extension: 文件操作类比较大的模块分类
- lib: 全局异常处理、数据辅助类
- middleware: 中间件，比如检测是否授权相关中间件、错误处理中间件
- model: 实体逻辑操作类
- validator: 请求数据校验


### 错误处理

> lib/http-exception

封装常见的状态码、状态码原因、错误码

### 检验器

### 建立数据库




## 业务功能

### 注册

### 登录

### 用户权限

### 角色管理







## 参考
1. https://github.com/TaleLin/lin-cms-koa
2. https://chenshenhai.github.io/koa2-note/note/project/start.html

