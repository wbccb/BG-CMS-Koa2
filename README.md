# BG-CMS-Koa2

内容管理系统后台，使用`Koa2`进行实现，主要功能有：
- 账号密码注册和登录功能
- 用户权限管理功能

> 详细文档放在 https://github.com/wbccb/cms-docs


## 1.项目目标
1. 掌握`Koa2`开发后台服务器的能力
2. 掌握`docker`、`ngnix`等相关后台技能
3. 掌握`MySQL`等数据库的操作
4. 结合软考中数据库相关设计，进行理论和实践的结合


## 2.启动服务器nodemon

使用`nodemon`进行`app.js`的启动，可以监听文件的改动变化，当代码改变时，自动重启服务
```shell
{
  "scripts": {
    "dev": "nodemon src/app.js"
  }
}
```


## 3.框架设计


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

以`validator`第三方库为基础，进行`isInt`字段+自定义校验函数的封装

### 建立数据库

#### Docker
1. 使用`Docker`创建数据库容器
2. 配置对应的账号和密码
3. 使用第三方库`sequelize`进行数据库的操作
> 自动执行SQL语句，创建、更新、删除、新增等操作


## 4.业务功能

- `validators.xxx`: 校验器，可自定义字段校验和自定义校验方法
- `models/xxx`: 逻辑操作类，进行数据库相关的操作以及其它业务操作
- `api/xxx`: 路由选择，进行`koa-router`，然后调用校验器进行参数校验，调用逻辑操作类进行数据的处理，然后进行返回数据给用户


### 4.1 注册

- `api/user`: 路由选择，进行`koa-router`，然后调用校验器进行参数校验，调用逻辑操作类进行数据的处理，然后进行返回数据给用户
  - `validators.user`: 校验器
  - `models/user`: 逻辑操作类
  
### 4.2 登录

### 4.3 用户权限

> token的获取和存储

### 4.4 菜单管理

#### 数据库表设计

`/models/menu.js`

#### 路由处理

`/api/system/menu.js`：调用`数据库操作的工具方法`，拿到数据库操作结果后返回数据

##### 数据库操作的工具方法

`/models/role.js`

##### 校验规则

`/validator/system.js`

```js
const success = new Success();
success.setData({
    total: 2,
    list: tree
});
// 返回结果
ctx.body = success.getData();
```


### 4.5 角色管理

#### 4.5.1 数据库表设计

`/models/role.js`

#### 4.5.2 初始化数据库的表数据

`/api/init_role.js`有对应的数组数据

#### 4.5.3 路由处理

##### 4.5.3.1 数据库操作的工具方法

##### 4.5.3.2 校验规则

### 4.6 用户管理

#### 4.6.1 数据库表设计


#### 4.6.2 初始化数据库的表数据
#### 4.6.3 路由处理
##### 4.6.3.1 数据库操作的工具方法
##### 4.6.3.2 校验规则

## 参考
1. https://github.com/TaleLin/lin-cms-koa
2. https://chenshenhai.github.io/koa2-note/note/project/start.html
3. https://github.com/MrXujiang/lowcode-cms

