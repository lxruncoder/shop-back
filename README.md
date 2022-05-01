# 笔记

## 准备工作

**模板下载地址:**
1. [加强版](https://github.com/PanJiaChen/vue-element-admin)
2. [简洁版](https://github.com/PanJiaChen/vue-admin-template)

接口地址:
1. http://39.98.123.211:8170/swagger-ui.html
2. http://39.98.123.211:8216/swagger-ui.html

接口换了:http://gmall-h5-api.atguigu.cn


**依赖安装项目启动:**
1. 安装依赖包:`npm i`
2. 启动项目:`npm run dev`(在package.json文件中可以查看如何启动项目)
```json
"scripts": {
  "dev": "vue-cli-service serve", // 这里是dev,所以启动就是npm run dev
  "build:prod": "vue-cli-service build",
}
```

**问题解决nrm的使用:**
在执行`npm i`的时候,卡住在如下位置,然后包各种错误,依赖包无法安装
```sh
reify:rxjs: timing reifyNode:node_modules/core-js Completed in 7493ms
```

[解决问题参考地址](https://www.jianshu.com/p/5c0c5e875953)

我的npm下载地址是淘宝镜像,切换为官方镜像即可,npm镜像切换指令
```sh
npm set registry https://registry.npmjs.org/
```

或者安装镜像地址管理插件,使用该插件切换镜像源
```sh
# 安装nrm
npm install -g nrm

# 执行ls命令查看所有镜像源
C:\Users\admin>nrm ls

  npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/

# 使用nrm use 命令切换到官方镜像，虽然安装的慢但是不会报错
C:\Users\admin>nrm use npm
   Registry has been set to: https://registry.npmjs.org/
C:\Users\admin>
```

**项目目录:**

目录:
1. build:没用
2. mock:模拟的数据,我们使用真实接口的数据,这里没用
3. node_modules:项目的依赖包
4. public:就是public了,相当于项目的根目录
5. test:测试单元,我们没用

配置文件:
1. .editorconfig:编辑器的配置,不需要修改
2. .env.development:配置了开发环境下,转发代理的前缀
3. .env.production:配置了生产环境下,转发代理的前缀
4. .env.staging:配置了测试环境的,转发代理的前缀
5. .eslintignore:eslint的忽略文件
6. .eslintrc.js:eslint配置文件
7. babel.config.js:babel的配置文件
8. .gitignore:git的忽略文件
9. babel.config.js:babel的配置文件
10. jsconfig.json:在其中配置了@的提示效果
11. postcss.config.js:在css中配置了浏览器厂商前缀
12. vue.config.js:在vue中对webpack的配置

src目录下的文件:
1. api:接口请求函数文件,引入了utils/request.js(对axios的二次封装)
2. utils:工具文件,在该目录中存储了对axios的二次封装文件
3. assets:多个组件共用的静态资源
4. components:共用的组件和非路由组件
5. icons:svg矢量图
6. layout:一级路由组件,用来布局,整个项目就两个一级路由组件,剩下的一个就是Login
7. styles:项目中用到的样式
8. router:路由器配置文件
9. store:vuex仓库文件
10. style:项目中用到的所有公共样式
11. views:路由组件

**src\main.js文件的说明:**

在main.js文件中有这样一段代码,`process.env`得到的是一个对象,该对象关联的就是.env.development和.env.production这两个文件,如果是开发环境关联的就前者,生产环境就是后者:
```js
// 如果是生产环境
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// 是一个对象,该对象关联的就是.env.development和.env.production文件
console.log(process.env)
```

**src\settings.js文件的说明:**

该文件配置了三项内容:
1. 网页标题内容
2. 顶部导航在有滚动条的时候是否固定
3. 左侧导航顶部的logo是否显示
```js
module.exports = {
  title: '后台管理项目', // 配置网页的标题
  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false, // 配置顶部导航是否固定
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false // 配置左侧导航顶部是否显示logo
}
```

**删除不需要的内容**
1. src\views目录中,除了dashboard(首页)和login其他路由组件都删除掉
2. src\router\index.js路由配置文件中,删除对应的路由配置
3. src\api\table.js该请求接口函数文件删除

## 登陆和退出登录的实现

**修改静态页面**
1. 将登录页的英文内容修改为中文
2. 配置登录组件的路由:已经给配置了好,并且配置前置路由守卫(src\permission.js在该文件中机型的配置),如果没有登录(没有token)则用编程式导航自动跳转到登录页面
3. 在第二个style中添加登陆页的背景图片,新增下的内容如下:
```css
.login-container {
  // background-color: $bg;
  // 将图片拷贝到assets目录下,用~@代表src目录引入
  background-image: url('~@/assets/back.jpg');
  // 保持纵横比进行平铺
  background-size: cover;
}
```

**动态实现之前的准备**
1. 修改对用户名和密码的验证规则,同时也要修改为中文
2. 对axios二次封装文件(src\utils\request.js)的修改
   - 明白配置的baseURL来自哪里
   - 修改请求头中添加的token名称
   - 追加响应拦截器中失败的状态码
3. 修改vue.config.js文件
   - 禁用mock数据
   - 配置代理

src\utils\request.js文件的修改:
```js
// 基础路径的配置
const service = axios.create({
  // 这里读取到的就是开发环境.env.development文件,将每个请求追加/dev-api前缀,有前缀就走代理,然后在请求具体资源的时候再将前缀去掉
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 
})
// 请求头token的名称
if (store.getters.token) {
  // 请求头携带的内容就是token
  config.headers['token'] = getToken()
}
// 响应拦截器对于响应失败的判断,和返回的内容
if (res.code !== 20000 && res.code !== 200) {
  Message({
  })
  // ...
  // 失败了会返回一个状态为失败的Promise实例,失败的原因是抛出的错误对象
  return Promise.reject(new Error(res.message || 'Error'))
} else {
  return res
}
```

vue.config.js文件的代理配置:
```js
devServer: {
  port: port,
  open: true,
  overlay: {
    warnings: false,
    errors: true
  },
  // 禁用mock数据
  // before: require('./mock/mock-server.js')
  // 配置代理转发的路径
  proxy:{
    '/dev-api':{
      target:'http://39.98.123.211', // 走代理的话就用这个路径拼接上/dev-api/请求的资源
      pathRewrite:{
        '^/dev-api':'' // 找资源的时候替换为空字符串
      }
    }
  }
},
```

**修改登录和退出登录的请求接口函数文件替换为真实的接口**
1. 修改src\api\user.js文件替换为真实接口
2. 修改src\store\modules\user.js文件(和用户相关的vuex文件),在该文件中引入了请求接口函数,发送请求,并且看懂登录的时候做了什么事情
3. 可以将登录改成async和await写法
4. 修改退出部分多余的内容,只留下退出和首页:src\layout\components中有一个sidebar表示侧边栏,navbar表示顶部导航栏(在这里进行修改),删除多余的内容,将剩余的内容改为中文

这个是封装的axios对象src\utils\request.js文件简化后的内容,只看响应拦截器:
1. 响应拦截器中有一个成功的回调,这里排除掉一些状态码,剩下的认为请求失败,会手动的返回一个失败状态的promise实例对象,失败的原因是手动抛出的Error对象,这会导致axios请求返回的promise实例的状态为失败,就会走then中的失败回调,或者catch中的失败回调,或者被try-catch中接收到错误对象
2. 相应拦截器中有一个失败的回调,如果状态码不是2开头,则认为失败,并且会接收到一个错误对象,最后通过返回一个失败的Promise实例,而原因就是该对象
3. 这两者都会导致axios返回失败状态的promise实例,但是两者有本质的不同,一个是故意为之,另一个是axios的做法
```js
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 在有些情况下请求成功会返回200,所以两个都不等于认定为请求失败
    if (res.code !== 20000 && res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // 会返回一个状态为失败的Promise实例,失败的原因是手动抛出的错误对象,message就是服务器返回的message,这就导致axios请求返回的promise实例的状态是失败,会被catch中的回调,或者try-catch中接收到这个错误对象
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  // 这里才是真正的失败,状态码不是以2开头都认为失败,走这里
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
```

src\store\modules\user.js中关于登录的方法:
```js
login({ commit }, userInfo) {
  const { username, password } = userInfo
  return new Promise((resolve, reject) => {
    /* 
      login方法就返回的就是一个二次封装的aixos发送请求后返回的promie实例
      如果该实例的状态为成功,调用then中指定的成功回调,value就是成功的数据,如果失败了,在相应拦截器中,返回了一个状态为失败的Promise实例,导致login方法返回的promise实例
      是失败的,失败的原因就是响应拦截器中抛出的错误对象
      axios任务状态码不是以2开头的都算失败,但是这里并不是因为这个原因而失败,而是我们故意这样做的
    */
    login({ username: username.trim(), password: password }).then(response => {
      const { data } = response
      commit('SET_TOKEN', data.token) 
      setToken(data.token) // 登录之后存储token,这里借助了一个第三方包,在utils/auth中
      resolve() // 返回成功状态的promise
    }).catch(error => {
      // 如果出现错误,则封装的axios返回了一个状态为失败的Promise实例对象,则login返回的Promise实例的状态就是失败的,然后就走catch,就能捕获到该错误对象
      // 这里的失败对象可能是手动抛出的,也有可能是axios抛出的,看情况
      reject(error)
      console.log(error)
    })
  })
},
```

使用async函数改写登录方法:
```js
async login({ commit }, userInfo){
  const { username, password } = userInfo
  try {
    const result = await login({ username: username.trim(), password: password })
    if(result.code === 20000) {
      const { data } = result
      commit('SET_TOKEN', data.token) 
      setToken(data.token) 
      // 保证该函数最后返回的还是一个promise实例
      return 'ok'
    }
  } catch (error) {
    // 这里的error就是导致axios请求失败,响应拦截器抛出的对象
    console.log(error)
    return Promise.reject()
  }
},
```

## 路由组件的创建和路由环境的配置

**路由**
1. 创建路由组件(定义):
   - 在views目录下创建product目录,该目录就是商品管理的一级路由组件,但是该路由组件没有要展示的组件
   - 在product目录下分别创建attr,trademark,spu,sku目录
   - 在四个目录下分别创建List.vue文件
2. 配置路由(注册):
3. 使用(不需要我们去使用,已经动态的创建好和侧边导航):如果实现的看src\layout\components\Sidebar\index.vue
4. 修改顶部导航的英文为中文首页
5. 修改侧边栏顶部的英文为首页:这个好弄,路由配置中修改/配置的meta中的title属性

src\router\index.js文件进行路由的配置:注意在其他路由配置中有一个hidden的配置项,如果为true,表示不在侧边栏显示
```js
// 路由的配置
{
  path: '/product', // 路径为porduct,product作为一个一级路由,但是没有需要显示的组件,展示的是Layout组件
  name: 'Product',
  component: Layout,
  // 配置重定向路由
  redirect:'/product/trademark', 
  meta: { title: '商品管理', icon: 'el-icon-s-goods' }, // icon图标可以用element-ui提供的图标
  children: [
    {
      path: 'trademark',
      name: 'Trademark',
      component: () => import('@/views/product/trademark/List'),
      meta: { title: '品牌管理' } // 二级路由就不需要图标了
    },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/attr/List'),
      meta: { title: '属性管理' } // 二级路由就不需要图标了
    },
    {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/sku/List'),
      meta: { title: 'SKU管理' } // 二级路由就不需要图标了
    },
    {
      path: 'spu',
      name: 'Spu',
      component: () => import('@/views/product/spu/List'),
      meta: { title: 'SPU管理' } // 二级路由就不需要图标了
    },
    // 重定向路由的另一种配置方式,在二级路由内部配置,path为空字符串,当访问一级路由的时候,检查二级路由没有匹配到最后匹配到一个空,就重定向到trademark
    /* {
      path:'',
      redirect:'trademark'
    } */
  ]
},
```

**理解一下为啥配置了路由就能用了**

在Sidebar组件中src\layout\components\Sidebar\index.vue有这样一段代码,循环生成了sidebar-item组件
```html
<!-- 循环生成了sidebar-item组件 -->
<sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
```

在同一个目录下查看SidebarItem组件,被通过路由配置生成的就是这些侧边栏导航
```html
<app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
  <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
  </el-menu-item>
</app-link>
```

**如何修改顶部导航栏的首页为中文**

顶部导航就是Navbar组件,找到该组件,发现该组件中使用了breadcrumb组件(这个组件定义在components中),修改该组件方法中的`getBreadcrumb`方法内部的代码:
```js
if (!this.isDashboard(first)) {
  matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched) // 修改为中文
}
```

## 请求接口函数的统一管理

**复习一下es6模块化**

无论那种暴露方式暴露,最终暴露出去的都是一个对象,只不过对象的形成方式不同
1. 默认暴露:暴露出去的对象,里面有一个default属性,该属性的值是一个对象,并且这种方式只能暴露一次,完整的引入写法`import {default as module} from 'xxx.js'`,最终得到的module就是default为键的对象
2. 部分暴露:它是最终暴露出去的时候,将所有的暴露的变量封装到一个对象当中
3. 统一暴露:这个对象是需要自己写的,将所有需要暴露的内容写在这个对象中,最后暴露出去的就是这个对象

理解一下默认暴露暴露的内容:
```js
// 这样暴露
export default {
  get(){
    console.log(1)
  }
}
// 其实暴露出的是这个,在引入的时候,import module from 'xxx.js',得到的module就是default后面的对象,完整写法就是import {default as module} from 'xxx.js'
{
  default:{

  }
}
```

无论那种暴露方式,都可以用`import * as module from 'xxx.js'`这种方式得到最终暴露的对象
1. 默认暴露module的得到的就是:`{default:{}}`
2. 其他两种暴露方式得到的module就是一个单纯的对象:`{}`

**创建接口函数文件**

创建请求接口函数文件,并且写trademark相关的请求接口函数
1. 在api目录下创建product目录
2. 在product目录下分贝创建出trademark.js,attr.js,spu.js,sku.js文件,分别存储不同模块相关的请求接口函数文件

src\api\product\trademark.js请求接口函数文件:要留意一个函数可以根据参数的不同而发送两种不同的请求
```js
import request from '@/utils/request' // 引入axios
// 采用的是默认暴露
export default {
  // 删除品牌
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },
  /* 
  添加和修改品牌共用一个函数,下面是参数的格式
  {
    "id": 0,
    "logoUrl": "string",
    "tmName": "string"
  }
  */
  addOrUpdate(trademark) {
    if(trademark.id) {
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else {
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },
  // 获取分页列表
  getPageList(page,limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  }
}
```

**统一管理请求接口函数文件**

如果像是之前那样引入`import * as $API from 'trademark.js'`这样会导致`$API`中只有trademark相关的请求接口函数,所以在在定义请求接口函数的时候采用了默认暴露,在被一个文件统一管理:
1. 在api目录下创建index.js文件:该文件就是将不同的请求接口函数文件整合到一起,进行一次性暴露
2. 在该文件内引入并暴露每一请求接口函数文件

引入并暴露的文件内容:理解注释部分
```js
// 注意:这里的引入不能使用简写方式
export {default as trademark} from './product/trademark'
export {default as attr} from './product/attr'
export {default as sku} from './product/sku'
export {default as spu} from './product/spu'

/* 
  第一步引入:这里不能使用简写方式
    import {default as trademark} from 'xxx.js'
    就相当于得到了trademark文件默认暴露出的对象,即default后面的内容,如下
    trademark = {
      delete(id) {
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
      },
      // 添加和修改品牌共用一个函数
      addOrUpdate(trademark) {
        if(trademark.id) {
          return request.put('/admin/product/baseTrademark/update',trademark)
        }else {
          return request.post('/admin/product/baseTrademark/save',trademark)
        }
      },
      // 获取分页列表
      getPageList(page,limit) {
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
      }
    }
  第二步暴露:相当于分别暴露,将trdemark代表的对象暴露出去
    export trademark
  第三步引入:在main.js通过如下方式引入该文件
    import * as API from 'index.js'
  因为在这里暴露出去的是分别暴露了多个请求接口函数文件,最终得到了一个这样的对象
    API = {
      trademark:{
        // trademark相关的请求接口函数
      },
      attr:{
        // attr相关的请求接口函数
      }
      ...
    }
  最后就可以将API挂载到Vue的原型上
*/
```

main.js文件中的引入部分:将统一管理的不同模块的请求接口函数,挂载到Vue的原型对象上进行统一的管理
```js
import * as API from './api'
Vue.prototype.$API = API
```

## trademark品牌管理

### 列表数据的展示

**使用element-ui搭建静态页面的基本实现**

主要使用三个标签,使用的注意事项都参考官网就可以了
1. `el-button`
2. `el-table`和`el-table-column`:每一个column表示的是一列数据,而不是传统表格的一行数据
3. `el-pagination`

src\styles\index.scss在该样式文件中最后添加一条样式,让页面和容器之间出现一个边距:
```css
.app-main {
  padding: 20px;
}
```

**动态展示trademark的列表数据**

需要注意的地方:
1. 调用请求接口函数发送请求,可以用`try-catch(error){}`来捕获抛出的错误,也可以不处理
2. 将需要的数据直接从返回的数据转存到data中,不需要将返回的数据整体存储(不需要存储了也没用)
3. `el-pagination`的分页功能可以和发送请求获取数据合并为一个功能


**table标签展示数据需要注意的问题**

data属性和prop属性配合用来进行数据的展示:
1. `el-table`的data属性:该属性指定要展示的数据,该数据必须为数组类型,每个列的内部都有一个`v-for`,data属性指定的数据会传递给每一个`el-table-column`,每个列都有展示数据的功能(都接收到了这个数组),在遍历的时候具体展示数组中每个对象的那个属性,需要通过指定`prop`属性去告知
2. 每个列展示数据的时候,都留有插槽,如果不需要数据,直接使用`template`标签指定额外的内容就可以了
3. 如果要展示的额外内容需要用到数据,就使用作用域插槽,用`slot-scope`接收到回传的数据,回传数据的对象包含两个内容,分别是当前遍历的对象和在数组中的索引,分别用`row`和`$index`来表示,因为传递的数据是通过该属性名传递的,所以必须为指定的名称,一般来说收到之后解构出来方便使用`<template slot-scope="{ row, $index }">`

src\views\product\trademark\List.vue的代码:
```html
<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- table的border属性可以添加边框,data为要展示的数据,必须是一个数组 -->
    <el-table border :data="trademarkList" style="margin: 20px 0">
      <!-- 每一个column代表一列,而不是一行 -->
      <!-- label表示每一列的标题,width如果指定了长度就是指定的长度,没有指定为平均分配,type表示该列会自动生成序号,align表示该列的对齐方式 -->
      <el-table-column label="序号" width="80" align="center" type="index" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌logo">
        <template slot-scope="{ row }">
          <!-- 可以验证得到的是数组中的每一个对象,可以展示名字 -->
          <!-- <p>{{row.tmName}}</p> -->
          <img style="width: 100px; height: 100px" :src="row.logoUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paginatoin分页组件:手动添加style让其居中显示,pager-count就是连续页,大于等于5的奇数,并且必须是数字类型 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 7, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> ,sizes, total"
      :total="total"
      :pager-count="5"
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
    />
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      trademarkList: []
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    // 发送请求获取数据
    async getTrademarkList(page = 1) {
      this.page = page // 将切换页面合并到该函数中
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      )
      // 这里只考虑了成功的情况,如果失败了会在浏览器抛出错误,可以用try-catch语法,捕获到抛出的错误对象,这里没有这样做
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条目数,参数是每条页数
    handleSizeChange(limit) {
      this.limit = limit
      this.getTrademarkList()
    }
    // 切换页码,参数是当前页
    /* handleCurrentChange(page) {
      this.page = page
      this.getTrademarkList()
    } */
  }
}
</script>
```

### 添加和修改品牌以及删除品牌

**添加和修改的静态页面实现**

点击添加和修改按钮的弹出层是一样的
1. 使用嵌套表单的`el-dialog`组件实现
2. 表单组件为`el-from`,其中每一个表单项为`el-from-item`
3. 图片上传用`el-upload`组件来实现,需要拷贝官网提供的样式(样式不能用scoped,会出现样式显示不全的情况)和js部分
4. 给添加按钮点击事件,实现点击添加按钮(el-dailog组件自带控制显示和隐藏的数据)

**添加收集数据**

`el-from`的`model`属性用来指定收集数据的对象,对象的格式需要按照请求接口需要的参数来写,这是后台接口规定的无法改变
1. 品牌名称可以直接使用`v-model`就可以直接收集到
2. 图片的收集需要先将图片上传给服务器,服务器上传成功后返回图片的真实地址,在`el-upload`组件中的上传成功的回调函数中,接收两个参数`res`和`file`
   - 将组件自带的地址替换为真实的接口,因为没有借助axios发送请求,所以没有`/dev-api`前缀,会有跨域问题,需要自己配置前缀
   - `res.data`和`file.response.data`就是图片的真实数据
   - 将这个收集到的数据在上传成功之后转存到data中的定义的收集数据的对象中即可
3. 点击添加填写了数据,但是最后却点击了取消,这样负责收集的对象中已经数据了,再次点击添加按钮,弹出页面会展示之前残留的数据,所以要在点击添加后清除收集对象中的数据

在清除数据的时候格式的注意:
1. 如果这样做`this.tmForm = {}`可以收集到数据,这样在有对应的数据的时候会给空对象添加属性,但是,相当于是后添加的属性,会失去响应式的作用,例如如果图片收集到了,则无法展示图片
2. 所以这里要还原本的收集数据的对象格式
```js
// 点击添加按钮,弹出层的显示
showAddDialog() {
  this.dialogFormVisible = true
  // 连原来的属性也需要带着
  this.tmForm = {
    tmName: '',
    logoUrl: ''
  }
}
```

**修改数据收集**

1. 点击修改按钮弹出弹出层,需要展示数据,而修改按钮是定义在`template`中的,`template`能够接收到表格回传的每个对象数据,即`row`,将其作为回调函数的参数传递
2. 将传递的对象赋值给`tmForm`这样就收到了要被修改的对象的数据,并且带有id值
3. 注意:这要用浅拷贝的方式,不然`tmForm`和`row`的地址值是相同的,tmFrom重新收集数据,引起row展示数据发生改变,因为是引用数据类型,也会影响原始数据的改变(trademarkList中的数据)
4. 最后因为点击修改和添加弹出的是同一个弹出层,要根据操作的不同,显示不同的标题(使用三元运算符实现)

**深拷贝和浅拷贝**

拷贝必然出现新的地址,开辟新的内容空间,也就是说有不同的存储位置,所以下面的这种类型的代码不能称为拷贝:
```js
const a = 10
const b = a
```

深拷贝和浅拷贝,谈论的是拷贝的内容是什么
1. 如果拷贝对象拷贝的是地址:那么就是浅拷贝
2. 如果拷贝的是对象里面的值:就是深拷贝,深拷贝是针对对象数据类型的,对于基本数据类型来说,没有深拷贝和浅拷贝的说法

**发送请求添加品牌和修改品牌**

主要还是会看一下在响应拦截器做了什么事情:
1. 原本的`dailog`的确认按钮只负责将其隐藏,现在需要更复杂的操作,所以在methods中定义回调
2. 根据是否有id而发送请求,在请求成功之后关闭弹出层,根据不同的操作给出不同的提示内容,并且重新获取更新后的列表数据,这个时候如果是修改就应该停留在当前页,是添加则在第一页
3. 使用`try-catch`捕获错误对象,根据不同的操作给出不同的提示,注意这里我们给出提示,在相应拦截器内部,无论是手动抛出异常对象,还是不为2开头抛出的错误对象,也已经做了提示处理,这里其实可以不提示,但是要用`catch`捕获错误,否则浏览器会出现一片红色的海洋

**删除品牌**

点击删除按钮实现删除,因为删除按钮页是在`template`中的可以,接收到回传的数据,那么通过id就可以实现删除的操作,需要有一个确认删除的动作,这个动作可以用两种方式实现:
1. 第一种通过`Popconfirm`气泡确认框来实现,该组件必须作用在`template`标签中,将`el-button`包裹,同时需要添加`slot`属性`<el-button slot="reference">删除</el-button>`,当点击确认按钮会触发`onConfirm`事件,可以在该事件的回调函数中发送请求进行删除操作,用这种方式按钮没有了样式,需要通过style来控制
2. 第二种方式通过`MessageBox`来实现,这种方式要将整个`row`传递过去,因为在提示信息中需要用到`row.tmName`

第一种实现方式:`popconfirm`的使用
```html
<el-popconfirm
  style="margin-left:20px"
  :title="`确定要删除${row.tmName}吗?`"
  @onConfirm="deleteTrademark(row.id)"
>
  <el-button
    slot="reference"
    type="danger"
    icon="el-icon-delete"
    size="mini"
  >删除</el-button>
</el-popconfirm>
```

第一种实现方式的回调函数:
```js
// 点击删除按钮进行删除操作
async deleteTrademark(id) {
  console.log(1)
  try {
    await this.$API.trademark.delete(id)
    // 如果当前页只有一项,删除后去上一页,否则就停留在当前页
    this.$message.success('删除品牌成功')
    this.getTrademarkList(this.trademarkList > 1 ? this.page : this.page - 1)
  } catch (error) {
    this.$message.error('删除品牌失败')
  }
}
```

第二种实现方式:`MessageBox`的使用,就是正常触发事件,所以操作都在事件的回调中执行
```html
<el-button
  type="danger"
  icon="el-icon-delete"
  size="mini"
  @click="deleteTrademark(row)"
>删除</el-button>
```

第二种实现方式的回调函数:
```js
// 点击删除按钮进行删除操作
deleteTrademark(row) {
  this.$confirm(`此操作将永久删除该${row.tmName}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
      try {
        await this.$API.trademark.delete(row.id)
        this.$message.success('删除品牌成功')
        this.getTrademarkList(
          this.trademarkList > 1 ? this.page : this.page - 1
        )
      } catch (error) {
        this.$message.error('删除品牌失败')
      }
    })
    .catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}
```

**实现表单验证**

1. 单独校验:
   - 在data中定义校验的对象,并且将定义的输入通过`rules`属性指定给`el-form`
   - 在校验对象中指定数组,每一个数组的名称通过`prop`属性指定给`el-form-item`,这里的props属性就不需要`:`
   - 每个数组中定义一条条校验规则即可
2. 整体校验
   - 需要给需要校验的表单添加ref属性,执行`this.$refs.xxx.validate((valid)=>{})`方法,该方法的参数是一个回调函数,回调函数的参数为是否通过校验
   - 如果通过校验就执行对应的操作,否则给出提示
   - 这里就可以在添加或者修改之前给出校验
3. 自定义校验规则
   - 直接在data方法中定义用来校验的方法,注意是在data方法中,所以不能使用在对象中定义方法的简写方式
   - 在定义校验规则对象的使用用:`{valiator:xxx}`指定我们定义的校验函数,该函数有三个参数,ruls表示校验规则封装的对象,value为输入的数值,callback是一个函数,参数可以是一个错误对象,则表示出错的时候提示的信息
   - 在这里的校验需要注意,如果点击添加之后,点击取消,再次点击添加,校验函数会自动执行,这时候得到的vlaue就是`unfefiend`会造成报错,所以先判断

注意:
1. 一个奇怪的现象添加了验证之后,在添加品牌的时候,需要触发一下验证才会变成响应式数据
2. 比如先添加图片,而图片不会显示预览图,在输入品牌名称触发一下验证后,才会收集

通过vue开发者工具查看:点击弹出层将tmForm重置之后,没有之前的属性,而是只有{isTrusted}
```js
showAddDialog() {
  this.dialogFormVisible = true
  this.tmForm = {
    tmName: '',
    logoUrl: ''
  }
},
```

品牌管理页面trademark的代码实现:
```html
<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="showAddDialog"
    >添加</el-button>
    <!-- table的border属性可以添加边框,data为要展示的数据,必须是一个数组 -->
    <el-table border :data="trademarkList" style="margin: 20px 0">
      <!-- 每一个column代表一列,而不是一行 -->
      <!-- label表示每一列的标题,width如果指定了长度就是指定的长度,没有指定为平均分配,type表示该列会自动生成序号,align表示该列的对齐方式 -->
      <el-table-column label="序号" width="80" align="center" type="index" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌logo">
        <template slot-scope="{ row }">
          <!-- 可以验证得到的是数组中的每一个对象,可以展示名字 -->
          <!-- <p>{{row.tmName}}</p> -->
          <img style="width: 100px; height: 100px" :src="row.logoUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showAddDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- paginatoin分页组件:手动添加style让其居中显示,pager-count就是连续页,大于等于5的奇数,并且必须是数字类型 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 7, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> ,sizes, total"
      :total="total"
      :pager-count="5"
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
    />
    <!-- 点击添加和修改的弹出层 -->
    <!-- 动态设置这里的标题,如果有tmId,表示修改,没有就是添加数据 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- style指定form部分的大小,model表示收集数据的对象 -->
      <el-form ref="tmForm" :model="tmForm" style="width: 80%" :rules="rules">
        <!-- label-width指定标题部分的大小,要带有单位 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 将input输入的数据收到的tmFrom中的tmName中,这里的名称是固定的,因为后台就需要包含tmName和logoUrl的对象 -->
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- action中写上传图片的接口,原来的是假的拿到的是本地的路径 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2m
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    // 注意这里是在方法中,而不是对象中用方法赋值
    var validataTmName = (rule, value, callback) => {
      // 如果点击添加之后,点击取消,再次点击添加这里会自动执行,value为undefined,会报错,所以如果value有值才进行校验
      if (value) {
        console.log(value)
        if (value.length < 2 || value.length > 10) {
          // 没通过校验给出的提示
          callback(new Error('长度必须在2-10之间'))
        } else {
          // 通过校验放行
          callback()
        }
      }
    }
    return {
      page: 1, // 自己指定用来默认的显示
      limit: 5, // 自己指定用来默认显示
      total: 0, // 返回的数据存储该数据
      // 返回的数据中的列表部分
      trademarkList: [],
      // 控制显示和隐藏
      dialogFormVisible: false,
      // 收集的数据,如果是添加品牌,则没有id,如果是修改品牌则有id(自动就会有了)
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 定义校验规则,校验规则是一个对象,需要给form指定rules属性,其中每一项是一个数组,表示一个校验的字段,需要给每一item项配置prop属性
      rules: {
        /*
          required表示校验规则,可以定义多种校验规则,在官网可查看
          message:表示没有通过校验规则显示的提示
          trigger:表示触发校验的时机,总共有三种一种是blur,一种是change,还有一种是整体校验
        */
        tmName: [
          { required: true, message: '必须填写品牌的名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度必须在2-10之间', trigger: 'change' }
          // 使用自定义的校验规则
          { validator: validataTmName, trigger: 'change' }
        ],
        // 这个验证规则,需要的触发时机是整体校验的时候
        logoUrl: [{ required: true, message: '请选择需要上传的图片' }]
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    // 发送请求获取数据
    async getTrademarkList(page = 1) {
      this.page = page // 将切换页面合并到该函数中
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      )
      // 这里只考虑了成功的情况,如果失败了会在浏览器抛出错误,可以用try-catch语法,捕获到抛出的错误对象,这里没有这样做
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条目数,参数是每条页数
    handleSizeChange(limit) {
      this.limit = limit
      this.getTrademarkList()
    },
    // 切换页码,参数是当前页
    /* handleCurrentChange(page) {
      this.page = page
      this.getTrademarkList()
    } */
    // 图片上传成功的回调函数
    handleAvatarSuccess(res, file) {
      // res.data和file.response.data返回的就是图片存户的数据
      this.tmForm.logoUrl = res.data
    },
    // 品牌上传之前的检查
    beforeAvatarUpload(file) {
      const imageArr = ['image/jpeg', 'image/png']
      // const isJPG = file.type === 'image/jpeg'
      const isJPGOrPNG = imageArr.indexOf(file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPGOrPNG && isLt2M
    },
    // 点击添加按钮,弹出层的显示
    showAddDialog() {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 点击修改按钮,弹出层的显示
    showAddDialog(row) {
      this.dialogFormVisible = true
      // 专业就导致this.tmForm和row的内存地址相同,其实是一份数据,而row是要展示的数据,在输入框中输入内容,导致tmForm收集到,从而影响到展示的数据
      // this.tmForm = row
      this.tmForm = { ...row } // 浅拷贝,都是基本数据类型,将数据拷贝一份给tmForm,tmForm发生改变就不会影响row的数据展示
    },
    // 点击确认按钮真正添加或者修改品牌
    addOrUpdate() {
      this.$refs.tmForm.validate(async(valid) => {
        if (valid) {
          try {
            await this.$API.trademark.addOrUpdate(this.tmForm)
            this.$message.success(
              this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            )
            // 先让弹出层关闭
            this.dialogFormVisible = false
            // 如果是添加数据则回到第一页,如果是修改数据停留在当前页
            const page = this.tmForm.id ? this.page : 1
            this.getTrademarkList(page)
          } catch (error) {
            // 响应拦截器通过返回失败状态的promise,让返回的promise状态为失败,我们可以在这里接收抛出的错误对象,但是在响应拦截器中也做出了错误的提示工作,我们这里不用提示也可以
            // 但是如果不用catch捕获这个错误,就会有在浏览器出现一片红色的错误提示
            this.$message.error(
              this.tmForm.id ? '修改品牌失败' : '添加品牌失败'
            )
          }
        } else {
          this.$message.info('请完整的输入内容')
        }
      })
    },
    // 点击删除按钮进行删除操作
    deleteTrademark(row) {
      this.$confirm(`此操作将永久删除该${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await this.$API.trademark.delete(row.id)
            this.$message.success('删除品牌成功')
            this.getTrademarkList(
              this.trademarkList > 1 ? this.page : this.page - 1
            )
          } catch (error) {
            this.$message.error('删除品牌失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
```


## attr属性管理

### 请求接口函数

1. 在src\api\product\attr.js文件写书写attr相关的请求接口函数
2. 添加和删除共用一个api,没有分开
3. 不要忘记请求接口文件需要在src\api\index.js中引入并暴露,这样才能被统一管理

请求接口函数文件:
```js
/* 
包含平台属性相关接口请求参数
*/
import request from '@/utils/request'
export default {
  /*
  获取指定分类下的属性列表
  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  */
  getList (category1Id, category2Id, category3Id) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  /*
  获取指定属性ID的所有属性值列表
  GET /admin/product/getAttrValueList/{attrId}
  */
  getValueList (attrId) {
    return request.get(`/admin/product/getAttrValueList/${attrId}`)
  },

  /* 
  添加和更新属性
  POST /admin/product/saveAttrInfo
  */
  addOrUpdate (attrInfo) {
    return request.post('/admin/product/saveAttrInfo', attrInfo)
  },

  /* 
  删除指定id的属性
  DELETE /admin/product/deleteAttr/{attrId}
  */
  delete (id) {
    return request.delete(`/admin/product/deleteAttr/${id}`)
  }
}
```


### CategorySelector(三级联动)

**为什么要定义为组件**

在attr页面需要展示两部分内容,一个是三级联动的效果,一个是列表展示,用`el-card`标签可以实现分隔的作用,因为三级联动在其他组件也用到了所以创建为组件
1. 在components目录中创建CategorySelector目录,创建index.vue文件作为组件
2. 因为公共组件在main.js中进行全局注册,然后使用即可

```html
<div>
  <!-- 三级连动 -->
  <el-card>
    <CategorySelector></CategorySelector>
  </el-card>
  <el-card style="margin-top: 20px">展示部分</el-card>
</div>
```

**CategorySelector组件的静态实现**

1. 使用`el-form`标签,添加属性`:inline="true"`则会变成行内元素
2. `el-select`使用`v-model`收集到是被选中`el-option`的vlaue值
3. `el-option`的`label`属性指定名称

**提供获取每一等级分类的请求接口函数**

src\api\product创建category文件提供请求接口函数src\api\product\category.js,还是不要忘记进行统一管理:
```js
import request from '@/utils/request'
export default {
  getCategorys1() {
    return request.get('/admin/product/getCategory1')
  },
  getCategorys2(category1Id) {
    return request.get('/admin/product/getCategory2/' + category1Id)
  },
  getCategorys3(category2Id) {
    return request.get('/admin/product/getCategory3/' + category2Id)
  }
}
```

**动态获取三级分类的数据**

1. 一上来就需要获取一级分类的数据,然后动态展示
2. 选中某一个一级分类的选项之后,通过一级分类的id获取二级分类的数据,`e-select`有一个`change`事件,该事件在option选项更改的时候触发,回调函数中的参数为默认选中的option的value值,然后动态展示
3. 选中某个二级分类的选项之后,用同样的方式,使用二级分类的id来获取三级分类的数据,然后动态展示
4. 选中一级分类和二级分类发送请求之前,需要将后续收集的id(因为重新选择了,肯定需要重新收集)和对应的list列表清空
5. 在清空之后,发送数据之前,自定义事件通知父组件,点击的是哪一级id,父组件接收到数据,如果是一级id二级id直接存储,并且将后续的id和存储的列表清空,三级id就存储然后发送请求获取列表数据

src\components\CategorySelector的代码内容:
```html
<template>
  <div>
    <el-form :inline="true" :model="attrForm">
      <el-form-item label="一级分类">
        <el-select v-model="attrForm.category1Id" placeholder="请选择" @change="changeCategory1">
          <!-- value是要被收集到v-model指定的内容,label是要显示的文字 -->
          <!-- 展示的就是一级分类的名字lable,收集的就是value为一级分分类的id -->
          <el-option v-for="c1 in category1List" :key="c1.id" :value="c1.id" :label="c1.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="attrForm.category2Id" placeholder="请选择" @change="changeCategory2">
          <el-option v-for="c2 in category2List" :key="c2.id" :value="c2.id" :label="c2.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="attrForm.category3Id" placeholder="请选择" @change="changeCategory3">
          <el-option v-for="c3 in category3List" :key="c3.id" :value="c3.id" :label="c3.name" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      attrForm: {
        category1Id:'',
        category2Id:'',
        category3Id:''
      },
      category1List:[],
      category2List:[],
      category3List:[]
    }
  },
  mounted(){
    // 获取到一级分类的数据就可以直接展示了
    this.getCategory1List()
  },
  methods: {
    async getCategory1List(){
      const result = await this.$API.category.getCategorys1()
      // 其实这里不需要判断也可以,因为在响应拦截器中,如果不等于200,算是错误,直接返回一个状态为失败的Promise实例,导致返回的结果为失败状态的Promise,可以用try-catch处理
      if(result.code === 200) {
        this.category1List = result.data
      }
    },
    // 点击一级分类获取二级分类数据
    async changeCategory1(category1Id) {
      // 重新点击一级分类,因为要重新收集,所以将以前收集到的2id和3id以及2list和3list重新清空
      this.attrForm.category2Id = ''
      this.attrForm.category3Id = ''
      this.category2List = []
      this.category3List = []
      // 通知父组件我被选中了
      this.$emit('changeCategory',{categoryId:category1Id,level:1})
      const result = await this.$API.category.getCategorys2(category1Id)
      if(result.code === 200) {
        this.category2List = result.data
      }
    },
    // 点击二级分类获取三级分类数据
    async changeCategory2(category2Id){
      this.attrForm.category3Id = ''
      this.category3List = []
      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategorys3(category2Id)
      if(result.code === 200) {
        this.category3List = result.data
      }
    },
    // 点击三级分类,通知父组件发送请求
    changeCategory3(category3Id){
      // 通知父组件我被选中了,如果当前选中的是三级分类则发送请求获取列表数据
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
      
    }
  }
}
</script>
```

在Attr组件中,接收点击三级分类的逻辑:
```js
<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: []
    }
  },
  methods: {
    // 无论是点击一级分类,二级分类,还是三级分类都会触发这个事件
    changeCategory({ categoryId, level }) {
      // 如果点击的是一级分类存储id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        // 如果点击的是二级分类,存储id
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else {
        // 如果点击的是三级分类,存储id,发送请求
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    }
  }
}
</script>
```

### 属性列表的展示

**静态页面实现和数据展示**

attr组件中第一个`el-card`展示的是三级联动,第二个展示的就是列表数据
1. 使用的标签主要还是`el-button`和`el-form`
2. 属性名称直接用`prop`来直接展示
3. 属性值列表用`el-tag`,因为是额外的结构用插槽`template`接收到回传的数据,来用`v-for`去遍历展示
4. 操作部分的展示,使用对`el-button`二次封装的HintButton(多个使用定义在components中,全局注册)

注意:每一个`el-form-column`表示一列,每一列都能收到遍历的数组(数据),在内部遍历生成多行,每一行都可以用作用域插槽`template`接收到当前行所属的对象

**封装的HintButton按钮组件**

src\components\HintButton:
```html
<template>
  <a href="javascript:;" :title="title" style="margin-right:12px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>
<script>
export default {
  name:'HintButton',
  props:['title']
}
</script>
```

### 添加和修改属性的准备工作

**静态页面的实现**

添加属性和修改属性共用一个页面,点击添加或者修改展示该页面,列表展示页面消失,所以该页面定义在第二个`el-card`中:
1. 所以需要将两个部分用一个div进行包裹,定义一个数据`isShowList`用来控制两者的显示和隐藏
2. 点击取消按钮则不显示添加修改部分,展示列表部分
3. 不同部分之间,直接用组件搭建就可以了
4. 定义要收集的数据格式,对于属性名则直接可以收集到了
5. 然后给添加按钮定义事件`showAddDiv`
6. 给修改按钮定义实现`showUpdateDiv`来实现切换显示
7. 两个取消按钮功能一样没有额外的操作,直接写在事件中就可以,不用指定回调函数
8. 添加属性按钮并非什么时候都可用,而是在有三级分类id的时候才可以点击
9. 添加属性值的按钮也是不能直接点击的,而是输入框有内容才可以点击

注意:table的width可以不写单位,form的label-

**添加属性收集数据**

原始的数据格式(要收集的数据格式):
```js
// 要收集的数据格式定义在data中
attrForm: {
  attrName: '', // 直接能够收集 
  attrValueList: [
    {
      attrId: 0, // 这里就是attrForm的id 
      // id: 0,  添加数据也不需要这个
      valueName: ''
    }
  ],
  // 添加属性这些id都不要
  categoryId: 0, // 要求必须是三级分类的id,但是不能在这里收集,因为data中不能用this
  categoryLevel: 3 // 这里必须是3 
  // id: 0
}
```

整理之后定义在data中要收集的格式:
```js
attrForm: {
  attrName: '', // 直接能够收集 
  attrValueList: [
   
  ],
  categoryId: 0, 
  categoryLevel: 3 
}
```

添加的attrValueList中的对象格式为:
```js
attrValueList: [
  {
    attrId:'',
    valueName:''
  }
],
```

实现添属性动态数据数据:
1. 收集属性名称:直接能够收集到
2. 收集属性值列表,每个属性值列表是`attrValueList`,点击添加属性值,添加一个空对象,那么表格就能够展示一行,在`el-table-item`中用`template`接收回传的空对象`row`,然后嵌套`el-input`用`v-model`来收集`row.valueName`,实现父子数据同步,收集到数据,当用户失去焦点或者回车之后,属性收集完成,多出来一行之后补充操作中的删除按钮
3. 当用户点击添加完成,点击取消再次点击添加原来的数据还存在:categoryId的收集和categoryLevel的收集,在解决点击添加属性弹出添加部分的时候,需要清空之前的数据,否则会残留在这里同时指定categoryId和categoryLevel

添加属性和添加属性值的两个回调函数:
```js
// 点击添加属性按钮
addShowDiv(){
  this.isShowList = false
  // 清除之前残留的,将对象赋值为空
  this.attrForm = {
    attrName: '',
    attrValueList: [],
    categoryId: this.category3Id, // 这里是固定的,但是不能在data中赋值,因为data中不能用this
    categoryLevel: 3,
  }
},
// 点击添加属性值按钮
addAttrValue(){
  // 这里是push进去的必须有响应式
  this.attrForm.attrValueList.push({      
    attrId: this.attrForm.id, // attrId为外层整个属性对象的id,如果有就是修改,没有就是添加
    valueName: ''     
  })
},
```

**修改属性**

1. 点击修改按钮切换到修改页面,并且将`row`传递过去
2. 将`row`赋值给`attrForm`就能够展示要修改的,注意这里要用深拷贝,因为`row`是一个对象类型,使用`lodash`中的深拷贝

```js
// 点击修改按钮 
updateShowDiv(row){  
  this.isShowList = false
  this.attrForm = cloneDeep(row)
},
```

**属性值模式的切换**

一个属性值新添加的时候是input输入框,修改的时候是span,证明每个属性值都有两种模式,编辑模式和查看模式:
1. 给每个属性值对象添加模式标识数据,用于确定这个属性值当前是input还是span
2. 需要在点击添加属性值按钮的时候,添加空对象的时候(新的属性值对象),在原有的属性基础上,补充一个isEdit属性,值为true
3. 点击修改属性的时候,要遍历attrForm中的attrValueList,给每个已有属性值对象都添加isEdit,值为false,因为是后添加的,要用`this.$set()`来添加,否则不是响应式的,只有在初始化阶段beforeCreate和created之间初始化的对象中的属性才是响应式的
4. 因为添加了属性,就不能够直接显示`el-input`而需要根据添加的属性判断,`v-if`和`v-else`动态的显示`el-input`和`span`

总结起来就两个步骤:
1. 添加属性值的时候给属性值对象新增属性为true
2. 添加修改属性的时候给属性值对象新增属性为false

补充自定义属性后的添加属性值:
```js
addAttrValue(){
  // 这里是push进去的必须有响应式
  this.attrForm.attrValueList.push({      
    attrId: this.attrForm.id, // attrId为外层整个属性对象的id,如果有就是修改,没有就是添加
    valueName: '',
    isEdit:true     
  })
},
```

补充自定义属性后的修改属性:
```js
// 点击修改按钮 
updateShowDiv(row){  
  this.isShowList = false
  this.attrForm = cloneDeep(row)
  this.attrForm.attrValueList.forEach(item=>{
    // 对象中后添加的属性么有响应式,要用this.set添加
    this.$set(item,'isEdit',false)
  })
},
```

动态的展示input或者span:
```html
<el-input v-if="row.isEdit" v-model="row.valueName" />
<span v-else>{{row.valueName}}</span>
```

**编辑模式和查看模式的切换**

1. 在input上需要添加失去焦点和回车事件`keyup.enter.native`,切换为查看模式,本质就是修改isEdit属性,需要将`row`传递过去,否则不知道修改的是哪一个属性值对象(keyup事件在el-input内部没有触发emit,所以要变成原生事件)
   - 直接变为span,如果用户添加的是空的或重复的也能添加上,需要提前判断用户输入的数据不能为空,不能和已经有的重复
   - 判断的同时要给出提示内容
   - 在判断是否重复的时候,要排除当前的(自己)因为自己已经添加进去了
   - 不满足转换条件需要再次将当前的值设置为空
2. 在span上需要点击添加事件,切换为编辑模式,本质也是修改isEdit属性,同样需要传递`row`

**解决输入框过大的问题**

直接给`el-input`添加size属性为mini

**解决span点击区域过小的问题**

将span添加style转换为block设置宽度和高度为100%

**input自动获取焦点**

1. 点击添加属性值自动input自动获取焦点
   - 因为是用push添加的,新添加的永远是最后一个,将最后一个获取焦点即可
2. 从查看模式切换为编辑模式自动获取焦点
   - 因为不知道点击的是那个,所以添加ref,但是不能添加固定的值,这样每个input都一样了,所以将$index作为ref值,然后将index作为参数传递过去,就能根据index获取到对应的input
   - 但是直接调用`focus()`会包undefined的错误:因为dom的异步更新,要用`$nextTick()`解决

结构中绑定事件:
```html
<template slot-scope="{row,$index}">
  <el-input size="mini" :ref="$index" v-if="row.isEdit" v-model="row.valueName" @blur="toLook(row)" @keyup.enter.native="toLook (row)" />
  <span v-else @click="toEdit(row,$index)" style="display:block;width:100%;height:100%">{{row.valueName}}</span>
</template>
```

修改之后添加属性值,追加了获取焦点:
```js
// 点击添加属性值按钮
addAttrValue(){
  // 这里是push进去的必须有响应式
  this.attrForm.attrValueList.push({      
    attrId: this.attrForm.id, // attrId为外层整个属性对象的id,如果有就是修改,没有就是添加
    valueName: '',
    isEdit:true     
  })
  // 点击添加属性值之后获取焦点,没个input都有ref,找最后一个
  this.$nextTick(()=>{
    this.$refs[this.attrForm.attrValueList.length - 1].focus()
  })
},
```

切换为查看模式:需要判断数据
```js
// 切换为查看模式
toLook(row){
  // 切换为查看模式要判断,不能有重复的
  const valueName = row.valueName
  if(!valueName.trim()) {
    this.$message.info('添加的属性值不能为空')
    row.valueName = ''
    return
  }
  // 也不能是已经存在的
  const isRepeat = this.attrForm.attrValueList.some(item=>{
    // 因为已经push进去了,所以先排除当前的
    if(item !== row) {
      return item.valueName === valueName
    }
  })
  if(isRepeat) {
    this.$message.info('添加的属性值不能重复')
    this.$row.valueName = ''
    return
  }
  row.isEdit = false
},
```

切换为编辑模式:需要自动获取焦点:
```js
// 切换为编辑模式
toEdit(row,index) {
  row.isEdit = true
  // 获取变为编辑模式要获取焦点,因为为true之后dom异步跟新,下面直接获取获取不到,所以nexttick()
  this.$nextTick(()=>{
    this.$refs[index].focus()
  })
}
```

**删除属性值**

就是通过索引移出attrValueList属性值数组中的某个属性值对象:
1. 使用`popconfirm`来完成,必须用在`template`中
2. 需要给嵌套的按钮添加`slot="reference"`属性

popconfirm的使用:
```html
<el-table-column label="操作">
  <template slot-scope="{row,$index}">
    <el-popconfirm :title="`确认要删除${row.valueName}吗?`" @onConfirm="removeAttrValue($index)">
      <HintButton type="danger" size="mini" title="删除" icon="el-icon-delete" slot="reference"></HintButton>
    </el-popconfirm>  
  </template>
</el-table-column>
```

删除的回调函数:
```js
// 删除属性值
removeAttrValue(index){
  this.attrForm.attrValueList.splice(index,1)
}
```

### 真正发送请求添加修改杀删除数据

**点击保存按钮进行保存修改操作**

点击修改或者添加部分中的保存按钮进行真正的保存操作
1. 获取收集到的参数
2. 整理参数:因为可以强制点击保存,所以需要整理参数
   - 如果属性当中的属性值有空字符串(比如直接点击保存就会出现这种情况)
   - 请求的时候将不需要的属性值对象当中的属性去掉,比如我们自己添加的isEdit
   - 当属性滚当中属性值列表是空的时候也不能发送请求(可以给出提示,不能为空)
3. 发送请求
   - 成功需要做的事情:提示一下子,返回列表页,重新发送请求获取列表数据
   - 失败需要做的事情:提示一下就可以了(根据修改和添加来提示不同的内容)
4. 保存按钮的可以操作性,属性值列表有值才能够点击,否则禁用

注意:filter方法返回的是一个新数组,而我们需要给attrValueList重新赋值,而不是attrForm
```js
// 删除属性值
removeAttrValue(index){
  this.attrForm.attrValueList.splice(index,1)
},
// 点击保存按钮发送请求进行修改或者添加
async saveAttr(){
  // 收集参数
  const attr = this.attrForm
  // filter方法返回新的数组重新赋值
  attr.attrValueList = attr.attrValueList.filter(item=>{
    // 如果不等于空字符串,把isEdit属性删除,然后得到过滤的数组
    if(item !== '') {
      delete item.isEdit
      return true
    }
  })
  // 属性值列表的数组没有属性也取消操作
  if(attr.attrValueList.length === 0) {
    return this.$message.info('属性必须有属性值')
  }
  try {
    await this.$API.attr.addOrUpdate(attr)
    this.$message.success(attr.id ? '修改成功': '添加成功')
    this.isShowList = true
    this.getAttrList()
  } catch (error) {
    this.$message.info(attr.id ? '修改失败': '删除失败')
  }
},
```

**删除按钮进行删除操作**

1. 使用气泡确认框`el-popconfirm`来进行确认
2. 点击确认按钮,触发`onConfirm`事件的回调来,传递row,通过row.id来删除
3. 删除成功之后需要重新发送请求获取列表数据

```js
// 删除属性
async deleteAttr(row) {
  try {
    await this.$API.attr.delete(row.id)
    this.$message.success('删除成功')
    this.getAttrList()
  } catch (error) {
    this.$message.info('删除失败')
  }
}
```

src\views\product\attr\List.vue的整体代码:
```html
<template>
  <div>
    <!-- 三级连动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addShowDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table border style="margin-top: 20px" :data="attrList">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          />
          <el-table-column label="属性名称" width="200" prop="attrName" />
          <!-- 每一列的内部都能收到attrlist,在内部进行遍历,所以能够生成很多行 -->
          <el-table-column label="属性值列表">
            <!-- 属性值列表的展示,用el-tag,需要额外的结构,attrList生成很多行,每一行接收到的就是数组的每一项,就是row -->
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 6px"
                type="info"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row }">
              <HintButton
                title="修改属性"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateShowDiv(row)"
              />
              <el-popconfirm :title="`确定要删除${row.attrName}吗?`" @onConfirm="deleteAttr(row)">
                <HintButton
                title="删除属性"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form :inline="true" :data="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrForm.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          />
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              />
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确认要删除${row.valueName}吗?`"
                @onConfirm="removeAttrValue($index)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  title="删除"
                  icon="el-icon-delete"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true,
      // 要收集的数据格式
      attrForm: {
        attrName: '',
        attrValueList: [
          // {
            // attrId: 0, 属性值所在属性的id
            // id: 0,
            // valueName: ''
          // }
        ],
        categoryId: 0,
        categoryLevel: 3,
        // id: 0  就是这个id,有这个id是修改,么有就是添加
      }
    }
  },
  methods: {
    // 无论是点击一级分类,二级分类,还是三级分类都会触发这个事件
    changeCategory({ categoryId, level }) {
      // 如果点击的是一级分类存储id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        // 如果点击的是二级分类,存储id
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else {
        // 如果点击的是三级分类,存储id,发送请求
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 点击添加属性按钮
    addShowDiv(){
      this.isShowList = false
      // 清除之前残留的,将对象赋值为空
      this.attrForm = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id, // 这里是固定的,但是不能在data中赋值,因为data中不能用this
        categoryLevel: 3,
      }
    },
    // 点击添加属性值按钮
    addAttrValue(){
      // 这里是push进去的必须有响应式
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // attrId为外层整个属性对象的id,如果有就是修改,没有就是添加
        valueName: '',
        isEdit:true
      })
      // 点击添加属性值之后获取焦点,没个input都有ref,找最后一个
      this.$nextTick(()=>{
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },
    // 点击修改按钮
    updateShowDiv(row){
      this.isShowList = false
      this.attrForm = cloneDeep(row)
      this.attrForm.attrValueList.forEach(item=>{
        // 对象中后添加的属性么有响应式,要用this.$set添加
        this.$set(item,'isEdit',false)
      })
    },
    // 切换为查看模式
    toLook(row){
      // 切换为查看模式要判断,不能有重复的
      const valueName = row.valueName
      if(!valueName.trim()) {
        this.$message.info('添加的属性值不能为空')
        row.valueName = ''
        return
      }
      // 也不能是已经存在的
      const isRepeat = this.attrForm.attrValueList.some(item=>{
        // 因为已经push进去了,所以先排除当前的
        if(item !== row) {
          return item.valueName === valueName
        }
      })
      if(isRepeat) {
        this.$message.info('添加的属性值不能重复')
        this.$row.valueName = ''
        return
      }
      row.isEdit = false
    },
    // 切换为编辑模式
    toEdit(row,index) {
      row.isEdit = true
      // 获取变为编辑模式要获取焦点,因为为true之后dom异步跟新,下面直接获取获取不到,所以nexttick()
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    removeAttrValue(index){
      this.attrForm.attrValueList.splice(index,1)
    },
    // 点击保存按钮发送请求进行修改或者添加
    async saveAttr(){
      // 收集参数
      const attr = this.attrForm
      // filter方法返回新的数组重新赋值
      attr.attrValueList = attr.attrValueList.filter(item=>{
        // 如果不等于空字符串,把isEdit属性删除,然后得到过滤的数组
        if(item !== '') {
          delete item.isEdit
          return true
        }
      })
      // 属性值列表的数组没有属性也取消操作
      if(attr.attrValueList.length === 0) {
        return this.$message.info('属性必须有属性值')
      }
      try {
        await this.$API.attr.addOrUpdate(attr)
        this.$message.success(attr.id ? '修改成功': '添加成功')
        this.isShowList = true
        this.getAttrList()
      } catch (error) {
        this.$message.info(attr.id ? '修改失败': '删除失败')
      }
    },
    // 删除属性
    async deleteAttr(row) {
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功')
        this.getAttrList()
      } catch (error) {
        this.$message.info('删除失败')
      }
    }

  }
}
</script>

```

### 三级分类的禁用

在点击添加属性之后,展示添加和修改的部分,这个时候三级分类是禁用状态,控制属性添加和修改的与列表页面展示的数据是`isShowList`,需要将该数据传递给三级分类组件,给form表单添加disable属性控制其可操作性

CategorySelector三级联动组件内部添加表单的可操作性
```html
<!-- isShowList为false,则添加属性显示,这个时候要保证这里为true就能禁用三级分类 -->
<el-form :inline="true" :model="attrForm" :disabled="!isShowList"></el-form>
```

## spu管理

### spu和sku

一个spu(某一类)下面有多个sku(某一类下面的一种具体):spu是一个iphone手机,sku就是某个颜色某个版本的iphone手机

1. 平台属性:用户搜索使用
2. 销售属性:购买的时候选择的

### 请求接口函数

没什么特别的,不要忘记进行统一管理

### spu列表的展示

**列表展示实现**

跟attr属性列表一样,顶部是三级联动,底部是列表展示部分,用两个`el-card`进行分隔
1. 第一个中用封装好的三级分类组件,并且处理组件的自定义事件当点击的是三级分分类的时候发送请求,需要注意每次点击分类之后要清除之前的id和数据的数组
2. 因为三级联动内部的`el-form`添加了disable属性,所以要定义一个isShowList为true传递过去,否则三级联动组件无法操作
3. 在点击三级分类的第三级别分类的时候发送请求获取数据,需要在data中定义page和limit,和数据的容器spuList
4. 请求数据回来,需要存储spuList和total(也需要在data中定义)
5. 根据请求回来的数据使用`el-table`展示数据即可
6. 底部分页用`el-pagination`

**添加spu页面(修改spu页面)和添加sku页面**

第二个`el-card`原本显示的是列表展示的页面
1. 但是在点击添加spu和修改spu展示的是添加spu页面(两者共用一个)
2. 点击添加sku显示的是添加sku页面
3. 也就是说第二个`el-card`会展示三种不同类型的页面,可以将每一个部分用div包裹,然后可以用两个数据控制三个部分的显示,但是添加spu和添加sku的代码内容,太多,所以将添加spu和添加sku页面定义成组件的形式来使用,这样组件的部分也不需要用div包裹了
   - src\views\product目录下创建componets目录
   - 在componets目录下分别创建SpuForm.vue和SkuForm.vue页面
   - 定义之后引入->注册->使用
4. 在data中定义两个数据,同时控制三个部分的显示
5. 给按钮定义事件,改变控制的数据,切换三个部分的不同显示,同时给添加spu按钮,添加可操作性,当有三级分类id的时候才可以使用
6. 添加sku和修改spu必然样将`row`传递过来,不然不知道修改那个,或者给那个spu添加sku

src\views\product\spu\List.vue的代码内容:
```html
<template>
  <div>
    <el-card>
      <CategorySelector
        :is-show-list="isShowList"
        @changeCategory="changeCategory"
      />
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表展示部分 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm" :disabled="!category3Id">添加SPU</el-button>
        <!-- 列表展示部分 -->
        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <HintButton
                type="primary"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU列表"
              />
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[5, 7, 9]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->,sizes, total"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- SpuForm展示部分 -->
      <SpuForm v-show="isShowSpuForm" />
      <!-- SkuForm展示部分 -->
      <SkuForm v-show="isShowSkuForm" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm.vue'
import SkuForm from '@/views/product/components/SkuForm.vue'
export default {
  name: 'Spu',
  components:{SpuForm,SkuForm},
  data() {
    return {
      // 三级分类列表传递过来的数据
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 存储列表展示数据的容器
      spuList: [],
      // 控制三级联动的可操作性,这个其实么用,但是如果不传递,三级联动就无法显示了,因为组件内部用这个数组来控制了form的可操作性
      // 这里传递的是true,但是三级联动组件内部取反了,为false,所以没有禁用
      isShowList: true,
      // 分页的数据
      page: 1,
      limit: 5,
      total: 0,
      // 控制添加spu和sku展示部分的数据
      isShowSpuForm:false,
      isShowSkuForm:false
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category3Id = ''
        this.spuList = []
      } else {
        // 点击三级分类发送请求
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList() {
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条数
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 切换页面
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // 点击添加spu按钮
    showAddSpuForm(){
      this.isShowSpuForm = true
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
    },
    // 点击添加sku按钮
    showAddSkuForm(row){
      this.isShowSkuForm = true
    }
  }
}
</script>
```

### 添加和修改spu数据展示和数据收集

**实现spu的静态页面src\views\product\components\SpuForm.vue**

1. 整体都是一个`el-form`如果给form身上添加`label-width`指定一个宽度,则因为label部分有了宽度,就能和输入部分显示在一行,而使用inline会让整体变短
2. 页面搭建完成之后,已经有三项数可以收集,spuName,tmId(品牌id),和description

spuForm静态组件:
```html
<template>
  <div>
    <!-- 指定一个label-width就能实现在一行显示 -->
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 收集的spuName -->
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 收集的是tmId -->
        <el-select placeholder="请选择品牌" v-model="spuForm.tmId">
          <el-option value="" label="" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 收集的的描述部分 -->
        <el-input placeholder="spu描述" type="textarea" rows="5" v-model="spuForm.description" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 因为暂时不知道收集什么所以在data中定义一个spuSaleAttrId用来临时收集 -->
        <el-select v-model="spuForm.spuSaleAttrId" placeholder="还有?个没有选择">
          <el-option value="" label="" />
        </el-select>
        <el-button style="margin-left:12px" type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border style="margin: 20px 0;">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性名" width="200"></el-table-column>
          <el-table-column label="属性值名称列表"></el-table-column>
          <el-table-column label="操作" width="200"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
```

需要收集的数据的原始格式:
```js
spuForm: {
  category3Id: 0,
  description: '',
  spuName: '',
  tmId: 0,
  // id: 0,  这个id不需要
  spuImageList: [
    {
      id: 0,
      imgName: '',
      imgUrl: '',
      spuId: 0
    }
  ],

  spuSaleAttrList: [
    {
      baseSaleAttrId: 0,
      saleAttrName: '',
      spuId: 0,
      id: 0,
      spuSaleAttrValueList: [
        {
          baseSaleAttrId: 0,
          id: 0,
          isChecked: '',
          saleAttrName: '',
          saleAttrValueName: '',
          spuId: 0
        }
      ]
    }
  ]
}
```

**请求初始化数据**

点击修改spu展示spuForm,这个时候应该先发送四个请求,获取初始化展示的数据,如果点击的是添加spu展示spuForm需要发送两个请求来获取初始化数据
1. spuForm组件一展示就是要发送请求,可以在组件内部的`mounted`中返送请求
2. 也可以通过给子组件添加ref,然后父组件`this.$refs.xxx.method()`直接操作子组件的方法让其发送请求
3. 最后采用通过在子组件中定义两个初始化数据的方法,如果在父组件中点击的是修改就调用修改的(发送四个请求,传递row),如果是添加就调用添加数据的初始化方法(需要发送2个请求,并且不需要row)

补充的获取所有品牌列表的请求接口函数:src\api\product\trademark.js
```js
// 获取所有的品牌列表
getList:()=>{
  return request.get('/admin/product/baseTrademark/getTrademarkList')
}
```

父组件中如何控制子组件的方法调用:
```js
// 点击添加spu按钮
showAddSpuForm(){
  this.isShowSpuForm = true
  this.$refs.spu.initAddSpuFormData()
},
// 点击修改spu按钮
showUpdateSpuForm(row){
  this.isShowSpuForm = true
  // 点击修改按钮,弹出修改部分,直接调用子组件的方法发送请求,修改数据的请求需要spu的id,所以将参数传递过去
  this.$refs.spu.initUpdateSpuFormData(row)
},
```

发送的四个请求:
1. 获取spu详情,直接存储到定义的spuForm中
2. 获取spu图片的列表,需要单独定义数据进行存储
3. 获取所有品牌列表,也单独定义数据存储
4. 获取所有销售属性,也单独定义数据存储

添加初始化数据和初始化数据:src\views\product\components\SpuForm.vue,在父组件中被调用的方法
```js
// 修改spu需要初始化数据的方式
async initUpdateSpuFormData(row){ // 接收参数包含spu的id
  // 需要发送四个请求:获取所有品牌列表数据和获取所有销售属性属性数据和图片列表和spu的详情(后两个需要根据spu的id来获取)
  // 获取spu的详情
  const result = await this.$API.spu.get(row.id)
  if(result.code === 200) {
    this.spuForm = result.data
  }
  // 获取图片列表:这个请求接口函数在sku之中
  const imgageResult = await this.$API.sku.getSpuImageList(row.id);
  if(imgageResult.code === 200) {
    const imageList = imgageResult.data
    // 因为上传图片组件,需要展示的数组中的每个对象需要包含name和url属性,在这里将请求来的数据改造之后在赋值
    imageList.forEach(item=>{
      item.name = item.imgName
      item.url = item.imgUrl
    })
    // 这样能保证imageList整体都是一个响应式数据
    this.imageList = imageList
  }
  // 获取所有的品牌,后续两个请求在添加初始化的时候也要发送
  const trademarkResult = await this.$API.trademark.getList()
  if(trademarkResult.code === 200) {
    this.trademarkList = trademarkResult.data
  }
  // 获取所有的销售属性数据
  const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
  if(baseSaleAttrResult.code === 200) {
    this.baseSaleAttrList = baseSaleAttrResult.data
  }
},
// 添加spu需要初始化数据的方法
async initAddSpuFormData(){
  // 需要发送两个请求:获取所有品牌列表数据和获取所有销售属性属性数据 
  // 获取所有的品牌
  const trademarkResult = await this.$API.trademark.getList()
  if(trademarkResult.code === 200) {
    this.trademarkList = trademarkResult.data
  }
  // 获取所有的销售属性数据
  const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
  if(baseSaleAttrResult.code === 200) {
    this.baseSaleAttrList = baseSaleAttrResult.data
  }
}
```

**点击取消按钮取消添加修改部分的显示,使用sync父子数据同步**

注意:传递过来的数据没有使用,可以不用`props`进行接收:

回顾sync实现父子数据同步的原理:
1. 将子组件需要的数据通过标签属性的形式传递过去,同时使用自定义事件,名字是update:属性名字,将该数据重新赋值
```html
<SpuForm v-show="isShowSpuForm" ref="spu" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event" />
<!-- 直接使用sync实现 -->
<SpuForm v-show="isShowSpuForm" ref="spu" :visible.sync="isShowSpuForm" />
```
2. 在子组件内部激活自定义事件将需要传递的值直接传递过来就可以了
```html
<el-button @click="$emit('update:visible',false)">取消</el-button>
```

**在SpuForm中点击修改展示数据**

1. spuName可以直接收集
2. 品牌遍历展示获取的品牌数据直接收集
3. spu描述可以直接收集
4. 图片的收集,给`upload`组件添加file-list属性,值为我们收集的图片列表,该数组中的每个对象必须有name属性和url属性图片才能正常展示
   - 图片列表数据在请求回来之后,先改造在赋值给data中定义好的数组
   - 在获取到数据,赋值给响应式数据supImageList之前,把所有的数据都处理好,最后一次赋值给响应式数据,那么数据对象当中的所有属性都是响应式的
   - 使用`forEach`就可以完成改造工作
5. 展示销售属性:展示spu自己的销售属性,在table中展示,展示所有的销售属性,但是出去自己剩余的销售属性
   - 展示自己的销售属性的时候,属性值列表部分使用可编辑的`el-tag`,需要同时拷贝官网的样式结构
   - 同时给每一个属性(row),而不是属性值添加上一个是否展示的属性(控制编辑模式和查看模式)
   - 编辑模式收集的数也挂载刀当前属性上,也就是row
   - 补充操作部分的删除按钮
6. 展示所有的销售属性,除了自己的(也就是未使用的销售属性)
   - 没有未使用的销售属性这个数据,而这个数据可以根据自己身上的销售属性计算出来,所以用计算属性实现
   - 需要使用两层过滤,得到所有的销售属性,拿到每一项去和自己已经有的销售属性再去比较,第一层用`filter`,第二层用`every`
   - 展示计算出的数据 

展示数据之后的结构:src\views\product\components\SpuForm.vue
```html
<template>
  <div>
    <!-- 指定一个label-width就能实现在一行显示 -->
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 收集的spuName -->
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 收集的是tmId -->
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <!-- 这里展示trademark列表,但是外层的select收集的是被选中的value,也就是spuForm.tmId,最终收集到spuForm中 -->
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :value="trademark.id"
            :label="trademark.tmName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 收集的的描述部分,直接就能收集到spuForm中 -->
        <el-input
          v-model="spuForm.description"
          placeholder="spu描述"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 直接将图片的列表给file-list属性即可,前提是每一个图片对象中有name和url属性,这我们已经改造过了 -->
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 因为暂时不知道收集什么所以在data中定义一个spuSaleAttrId用来临时收集 -->
        <!-- 现在来展示计算出来的当前spu没有的销售属性 -->
        <el-select
          v-model="spuSaleAttrId"
          :placeholder="unUseSpuSaleAttrList.length > 0 ? `还有${unUseSpuSaleAttrList.length}个没有选择` : '没有了'"
        >
          <el-option v-for="unUseSpuSaleAttr in unUseSpuSaleAttrList" :key="unUseSpuSaleAttr.id" :value="unUseSpuSaleAttr.id" :label="unUseSpuSaleAttr.name" />
        </el-select>
        <el-button
          style="margin-left: 12px"
          type="primary"
          icon="el-icon-plus"
        >添加销售属性</el-button>
        <!-- 展示已经存在当前spuForm中的销售属性 -->
        <el-table border style="margin: 20px 0" :data="spuForm.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="属性名" width="200" prop="saleAttrName" />
          <el-table-column label="属性值名称列表">
            <!-- 销售属性值列表使用el-tag,这里的row是每一个spuSaleAttrList中的销售属性对象,内部包含销售属性值列表 -->
            <template slot-scope="{ row }">
              <!-- closeable表示有关闭按钮,:disable-transitions="false"表示有过渡效果 -->
              <!--  @close="handleClose(tag)" -->
              <el-tag
                v-for="spuSaleAttrValue in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <!-- v-if表示是编辑模式还是查看模式,这个编辑模式不同之前,之前是每个属性值有一个编辑模式,但是在这里,每一个属性才有编辑模式,而row表示每一个属性,所以将控制是否是编辑模式还是输入的value都暂时添加在row上 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" />
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
```

计算属性计算当前spuForm没有使用的销售属性:
```js
computed:{
  // 计算没有使用的销售属性
  unUseSpuSaleAttrList(){
    return this.baseSaleAttrList.filter(baseSaleAttr=>{
      // filter表示过滤出满足条件的,什么样的是满足条件的呢,baseSaleAttr中的任何一个,在this.spuForm.spuSaleAttrList都没有
      return this.spuForm.spuSaleAttrList.every(spuSaleAttr=>{
        // 全局的name都不能与已有的saleAttrName才被计算出来
        return baseSaleAttr.name !== spuSaleAttr.saleAttrName
      })
    })
  }
}
```

**收集数据**

后期发送请求需要的图片格式:
```js
{
  id:0,
  imgName:'',
  imgUrl:'',
  spuId:0
}
```

添加销售属性的结构:
```js
{
  baseSaleAttrId: 0,
  saleAttrName: '',
  // spuId: 0, 不需要
  // id: 0,不需要
  spuSaleAttrValueList: [] //销售属性值单独添加一个空数组就可以
}
```

添加销售属性值的结构:
```js
{
  // baseSaleAttrId: 0,
  // id: 0, 不需要要
  // isChecked: '',
  // saleAttrName: '',
  saleAttrValueName: '', // 最后只需要这个
  // spuId: 0 不需要
}
```

收集所有数据的步骤:
1. category3Id:最后整理数据的时候收集
2. spuName和description和tmId已经收集好了
3. 图片列表的收集:
   - 修改上传图片的接口
   - 删除的回调:两个参数file表示被删除的那个图片,fileList表示删除之后的图片列表,这里的fileList就是要收集的图片
   - 放大镜的回调:这个不用管功能已经完成
   - 添加图片成功的回调:三个参数repsonse,file(上传成功的图片),fileList这个就是我们要收集的,这里需要注意,后追加的图片和之前的图片格式不同,之前的图片我们改造过,有imgName和imgUrl这两个是原本的,我们又追加了name和url,新上传的只有name和url(element-ui默认生成),并且url还是错误的,是本地路径,但是现在并不关心,只要将图片列表重新赋值,后期需要整理
4. 添加销售属性
   - 就是从未使用的销售属性的列表中,往spuForm自己的销售属性列表中添加一个
   - 添加到`spuFrom.spuSaleAttrList`中,这个正好是table展示的,添加了table就能多展示一条数据了
   - 添加的结构:见下面
   - 收集的是:选中的未使用的`baseSaleAttrId: 0,`和`saleAttrName: '',`和`spuSaleAttrValueList: []`然后变成一个对象,因为要收集两项,所以在`el-input`中的vlaue就要收集两项用:分隔进行拼接收集
   - 点击添加销售属性按钮,拿到收集的数据构造成对象,添加到`spuFrom.spuSaleAttrList`中
   - 按钮的可操作性,如果收集的数据没有值,那么就不让点击添加销售属性了
5. 添加销售属性值
   - 添加到哪里:`spuFrom.spuSaleAttrList.spuSaleAttrValueList`这个一个空数组,在添加销售属性的时候设置为空,其实就是添加到table当中的`row.spuSaleAttrValueList`里面
   - 添加的结构式什么:见下图
   - 收集什么:就是`row.inputValue`
   - 点击添加按钮,变为input,需要传递row,因为控制显示input的属性被挂载在了row上inputvisible,同时因为是后添加的属性,在修改的时候用`$set()`
   - 然后自动获取焦点,依旧是`this.$nextTick()`,这里因为始终只有一个input,直接能够拿到
   - 在input中输入数据的同时,就将数据绑定在了row身上
   - 失去焦点或者回车后,在回调函数,将收集到的数据构造成想要的结构
   - 需要转换成查看模式跟之前的attr一样,都需要提前判断值不能为空,不能重复
   - 把构造成的结构对象,添加到`row.spuSaleAttrValueList`中
   - 将原来输入框的数据清空,同时在让input变为按钮
6. 删除属性值和删除属性值,删除属性值就是用遍历的index,用`splice`直接删除掉就可以了,删除属性,则需要用$index,因为要删掉的是回传的回想,需要从`this.spuForm.spuSaleAttrList`删除

删除属性值:删除遍历的el-tag所以这里index用遍历的index
```html
<el-tag
  v-for="(spuSaleAttrValue,index) in row.spuSaleAttrValueList"
  :key="spuSaleAttrValue.id"
  closable
  :disable-transitions="false"
  @close="row.spuSaleAttrValueList.splice(index,1)"
>
```

删除属性:
```html
<template slot-scope="{$index}">
  <HintButton type="danger" size="mini" title="删除" @click="spuForm.spuSaleAttrList.splice($index,1)">删除</HintButton>
</template>
```

src\views\product\components\SpuForm.vue的整体代码:
```html
<template>
  <div>
    <!-- 指定一个label-width就能实现在一行显示 -->
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 收集的spuName -->
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 收集的是tmId -->
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <!-- 这里展示trademark列表,但是外层的select收集的是被选中的value,也就是spuForm.tmId,最终收集到spuForm中 -->
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :value="trademark.id"
            :label="trademark.tmName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 收集的的描述部分,直接就能收集到spuForm中 -->
        <el-input
          v-model="spuForm.description"
          placeholder="spu描述"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 直接将图片的列表给file-list属性即可,前提是每一个图片对象中有name和url属性,这我们已经改造过了 -->
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 因为暂时不知道收集什么所以在data中定义一个spuSaleAttrId用来临时收集 -->
        <!-- 现在来展示计算出来的当前spu没有的销售属性 -->
        <el-select
          v-model="spuSaleAttrIdOrName"
          :placeholder="
            unUseSpuSaleAttrList.length > 0
              ? `还有${unUseSpuSaleAttrList.length}个没有选择`
              : '没有了'
          "
        >
          <el-option
            v-for="unUseSpuSaleAttr in unUseSpuSaleAttrList"
            :key="unUseSpuSaleAttr.id"
            :value="`${unUseSpuSaleAttr.id}:${unUseSpuSaleAttr.name}`"
            :label="unUseSpuSaleAttr.name"
          />
        </el-select>
        <el-button
          style="margin-left: 12px"
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdOrName"
        >添加销售属性</el-button>
        <!-- 展示已经存在当前spuForm中的销售属性 -->
        <el-table border style="margin: 20px 0" :data="spuForm.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="属性名" width="200" prop="saleAttrName" />
          <el-table-column label="属性值名称列表">
            <!-- 销售属性值列表使用el-tag,这里的row是每一个spuSaleAttrList中的销售属性对象,内部包含销售属性值列表 -->
            <template slot-scope="{ row }">
              <!-- closeable表示有关闭按钮,:disable-transitions="false"表示有过渡效果 -->
              <!--  @close="handleClose(tag)" -->
              <el-tag
                v-for="(spuSaleAttrValue,index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <!-- v-if表示是编辑模式还是查看模式,这个编辑模式不同之前,之前是每个属性值有一个编辑模式,但是在这里,每一个属性才有编辑模式,而row表示每一个属性,所以将控制是否是编辑模式还是输入的value都暂时添加在row上 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{$index}">
              <HintButton type="danger" size="mini" title="删除" @click="spuForm.spuSaleAttrList.splice($index,1)" icon="el-icon-delete"></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: 0,
        // id: 0,  这个id不需要
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],

        spuSaleAttrList: [
          // 这里的外层大对象表示每一个销售属性,内部的对象表示销售属性的值
          // {
          //   baseSaleAttrId: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   id: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
          // {
          // }
        ]
      },
      // 先定义一个数据,展示当前spu没有的销售属性暂时收集,现在修改了因为这里负责收集id和name
      spuSaleAttrIdOrName: '',
      // 上传图片组件需要的数据
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储额外获取的数据,这些数据最终需要重新整理
      imageList: [],
      trademarkList: [],
      baseSaleAttrList: []
    }
  },
  computed: {
    // 计算没有使用的销售属性
    unUseSpuSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        // filter表示过滤出满足条件的,什么样的是满足条件的呢,baseSaleAttr中的任何一个,在this.spuForm.spuSaleAttrList都没有
        return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
          // 全局的name都不能与已有的saleAttrName才被计算出来
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName
        })
      })
    }
  },
  methods: {
    // 上传图片组件需要的两个函数,这个是移出一张图片的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.imageList = fileList
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.imageList = fileList
    },
    // 放大镜效果
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 修改spu需要初始化数据的方式
    async initUpdateSpuFormData(row) {
      // 接收参数包含spu的id
      // 需要发送四个请求:获取所有品牌列表数据和获取所有销售属性属性数据和图片列表和spu的详情(后两个需要根据spu的id来获取)
      // 获取spu的详情
      const result = await this.$API.spu.get(row.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }
      // 获取图片列表:这个请求接口函数在sku之中
      const imgageResult = await this.$API.sku.getSpuImageList(row.id)
      if (imgageResult.code === 200) {
        const imageList = imgageResult.data
        // 因为上传图片组件,需要展示的数组中的每个对象需要包含name和url属性,在这里将请求来的数据改造之后在赋值
        imageList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 这样能保证imageList整体都是一个响应式数据
        this.imageList = imageList
      }
      // 获取所有的品牌,后续两个请求在添加初始化的时候也要发送
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 添加spu需要初始化数据的方法
    async initAddSpuFormData() {
      // 需要发送两个请求:获取所有品牌列表数据和获取所有销售属性属性数据
      // 获取所有的品牌
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId,saleAttrName] = this.spuSaleAttrIdOrName.split(':')
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      // 添加之后将输入框清空
      this.spuSaleAttrIdOrName = ''
    },
    // 点击el-tag的添加按钮展示input输入框
    showInput(row){
      this.$set(row,'inputVisible',true)
      // inpuot自动获取焦点，因为每个一行中只有一个input所以可以直接获取
      this.$nextTick(()=>{
        this.$refs.saveTagInput.focus()
      })
    },
    // input失去焦点或者回车
    handleInputConfirm(row){
      const {saleAttrValueName,baseSaleAttrId} = row.inputValue 
      if(saleAttrValueName.trim() === '') {
        row.inputValue = ''
        return
      }
      // 排除重复的,这里不需要,这里不需要排除自己,因为还没有添加进去
      const isRepeat = row.spuSaleAttrValueList.some(item=>{
        return item.saleAttrValueName === saleAttrValueName
      })
      if(isRepeat) {
        this.$message.info('不添加重复属性值')
        return
      }
      // 构造对象添加进去
      const obj = {
        saleAttrValueName,
        baseSaleAttrId
      }
      row.spuSaleAttrValueList.push(obj)
      // 清空输入框
      row.inputValue = ''
      // 隐藏input
      row.inputVisible = false
    }

  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

```

### 发送请求进行真正的spu增删改查

**保存操作save**

1. 获取收集的参数数据
2. 整理参数:
   - 图片:使用`map`方法将图片整理之后放在spuForm中,那么不管是新图片还是老图片都有,imgUrl如果是以前的直接用,新的没有在repson.data中
   - category3Id:先定义在data中,点击修改按钮传递过来的row中包含这个id,点击添加按钮进入修改页面部分,初始化数据的时候直接给这个定义好的赋值,如果是添加添加进入将category3Id传递过来,然后再初始化数据的时候给赋值
   - 删除属性中的inputVisible和inputValue
3. 发送请求
4. 成功的操作
   - 给出提示
   - 返回列表页
   - 通知父组件,因为列表页再父组件中,父组件需要做一些事情,父组件需要知道是保存返回还是修改返回,再点击添加展示部分,添加一个`this.flag=row.id`作为标识数据,修改回来再当前页,添加回来再第一页,最后清除标识数据
   - 清空当前组件的data中的所有数据:如果不清除,先点击修改里面存储了所有数据,那么再次点击添加就会残留这些数据
   - 之前再添加属性值的时候,构造对象没有baseSaleAttrId这个属性,其实需要这个属性,现在补充上
5. 失败的操作
   - 给出提示

保存的主要逻辑:
```js
// 点击保存按钮进行添加操作
async save() {
  const { category3Id, spuForm, imageList } = this
  // 整理图片
  spuForm.spuImageList = imageList.map((item) => {
    // map方法构造一个新的对象返回,如果是原始的图片还是新的图片都有name,原始的图片有imgUrl新的图片的url在reponse.data主公
    return {
      imgName: item.name,
      imgUrl: item.imgUrl || item.response.data
    }
  })
  // 删除自己添加的属性
  spuForm.spuSaleAttrList.forEach((item) => {
    delete item.inputVisible
    delete item.inputValue
  })
  // 整理category3id,这个id是父组件传递过来的,在发送四个请求之前进行初始化
  spuForm.category3Id = category3Id
  try {
    await this.$API.spu.addUpdate(spuForm)
    // 给出提示
    this.$message.success(spuForm.id ? '修改成功' : '添加成功')
    // 会到父组件
    this.$emit('update:visible', false)
    // 通知父组件成功
    this.$emit('successBack')
    // 清空data中的所有数据
    this.resetData()
  } catch (error) {
    this.$message.error(spuForm.id ? '修改失败' : '添加失败')
  }
},
```

**取消操作cancel**

1. 先返回父组件
2. 通知父组件清空标识数据
3. 也得重置data中的数据

取消的主要逻辑:
```js
// 点击取消
cancel(){
  // 回到父组件
  this.$emit('update:visible', false)
  // 告诉父组件清空标识,因为我最后没改
  this.$emit('cancelBack')
  // 并且要重置数据,否则第一次点修改,第二次点击添加,数据都残留了
  this.resetData()
}
```

**删除操作delete**

1. 删除属性是在父组件中进行的操作src\views\product\spu\List.vue
2. 使用气泡确认框
3. 删除成功成功获取列表页,如果是当前页的列表大于1,则在当前页,否则当前页-1
4. 删除失败给出提示

删除的主要逻辑:
```js
// 删除spu
async deleteSpu(row) {
  try {
    await this.$API.spu.remove(row.id)
    this.$message.success('删除成功')
    this.getSpuList(this.spuList > 1 ? this.page : this.page -1)
  } catch (error) {
    this.$message.error('删除失败')
  }
},
```

注意:**无论是删除还是保存,都需要重新发送请求,这里需要传递页码,我之前没有传递页码,这里需要修改一下**

src\views\product\spu\List.vue的全部代码:
```html
<template>
  <div>
    <el-card>
      <CategorySelector
        :is-show-list="isShowList"
        @changeCategory="changeCategory"
      />
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 列表展示部分 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
        >添加SPU</el-button>
        <!-- 列表展示部分 -->
        <el-table border :data="spuList" style="margin: 20px 0">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="primary"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SKU列表"
              />
              <el-popconfirm
                :title="`确认要删除${row.spuName}吗?`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[5, 7, 9]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->,sizes, total"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- SpuForm展示部分 -->
      <!-- sync实现父组同步的原理 -->
      <!-- <SpuForm v-show="isShowSpuForm" ref="spu" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event" /> -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
        @successBack="successBack"
        @cancelBack="cancelBack"
      />
      <!-- SkuForm展示部分 -->
      <SkuForm v-show="isShowSkuForm" ref="sku" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm.vue'
import SkuForm from '@/views/product/components/SkuForm.vue'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 三级分类列表传递过来的数据
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 存储列表展示数据的容器
      spuList: [],
      // 控制三级联动的可操作性,这个其实么用,但是如果不传递,三级联动就无法显示了,因为组件内部用这个数组来控制了form的可操作性
      // 这里传递的是true,但是三级联动组件内部取反了,为false,所以没有禁用
      isShowList: true,
      // 分页的数据
      page: 1,
      limit: 5,
      total: 0,
      // 控制添加spu和sku展示部分的数据
      isShowSpuForm: false,
      isShowSkuForm: false
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 重新选择需要清除后续的id和列表
        this.category3Id = ''
        this.spuList = []
      } else {
        // 点击三级分类发送请求
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(page = 1) {
      this.page = page
      const result = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.category3Id
      )
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 改变每页显示的条数
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 切换页面
    handleCurrentChange(page) {
      this.getSpuList(page)
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true
      // 这里将category3id传递过去用来在整理参数的时候用
      this.$refs.spu.initAddSpuFormData(this.category3Id)
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row) {
      // 添加一个标识,我是修改跳转到修改部分
      this.flag = row.id
      this.isShowSpuForm = true
      // 点击修改按钮,弹出修改部分,直接调用子组件的方法发送请求,修改数据的请求需要spu的id,所以将参数传递过去
      this.$refs.spu.initUpdateSpuFormData(row)
    },
    // 成功回到父组件:区分是修改回来,还是添加回来
    successBack() {
      if (this.flag) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.flag = null
    },
    // 取消
    cancelBack() {
      this.flag = null
    },
    // 删除spu
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id)
        this.$message.success('删除成功')
        this.getSpuList(this.spuList > 1 ? this.page : this.page -1)
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 点击添加sku按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true
    }
  }
}
</script>

```

src\views\product\components\SpuForm.vue的全部代码:
```html
<template>
  <div>
    <!-- 指定一个label-width就能实现在一行显示 -->
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="SPU名称">
        <!-- 收集的spuName -->
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 收集的是tmId -->
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <!-- 这里展示trademark列表,但是外层的select收集的是被选中的value,也就是spuForm.tmId,最终收集到spuForm中 -->
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :value="trademark.id"
            :label="trademark.tmName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 收集的的描述部分,直接就能收集到spuForm中 -->
        <el-input
          v-model="spuForm.description"
          placeholder="spu描述"
          type="textarea"
          rows="5"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 直接将图片的列表给file-list属性即可,前提是每一个图片对象中有name和url属性,这我们已经改造过了 -->
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 因为暂时不知道收集什么所以在data中定义一个spuSaleAttrId用来临时收集 -->
        <!-- 现在来展示计算出来的当前spu没有的销售属性 -->
        <el-select
          v-model="spuSaleAttrIdOrName"
          :placeholder="
            unUseSpuSaleAttrList.length > 0
              ? `还有${unUseSpuSaleAttrList.length}个没有选择`
              : '没有了'
          "
        >
          <el-option
            v-for="unUseSpuSaleAttr in unUseSpuSaleAttrList"
            :key="unUseSpuSaleAttr.id"
            :value="`${unUseSpuSaleAttr.id}:${unUseSpuSaleAttr.name}`"
            :label="unUseSpuSaleAttr.name"
          />
        </el-select>
        <el-button
          style="margin-left: 12px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!spuSaleAttrIdOrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <!-- 展示已经存在当前spuForm中的销售属性 -->
        <el-table border style="margin: 20px 0" :data="spuForm.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="属性名" width="200" prop="saleAttrName" />
          <el-table-column label="属性值名称列表">
            <!-- 销售属性值列表使用el-tag,这里的row是每一个spuSaleAttrList中的销售属性对象,内部包含销售属性值列表 -->
            <template slot-scope="{ row }">
              <!-- closeable表示有关闭按钮,:disable-transitions="false"表示有过渡效果 -->
              <!--  @close="handleClose(tag)" -->
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <!-- v-if表示是编辑模式还是查看模式,这个编辑模式不同之前,之前是每个属性值有一个编辑模式,但是在这里,每一个属性才有编辑模式,而row表示每一个属性,所以将控制是否是编辑模式还是输入的value都暂时添加在row上 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ $index }">
              <HintButton
                type="danger"
                size="mini"
                title="删除"
                icon="el-icon-delete"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      spuForm: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: 0,
        // id: 0,  这个id不需要
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],

        spuSaleAttrList: [
          // 这里的外层大对象表示每一个销售属性,内部的对象表示销售属性的值
          // {
          //   baseSaleAttrId: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   id: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
          // {
          // }
        ]
      },
      // 先定义一个数据,展示当前spu没有的销售属性暂时收集,现在修改了因为这里负责收集id和name
      spuSaleAttrIdOrName: '',
      // 上传图片组件需要的数据
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储额外获取的数据,这些数据最终需要重新整理
      imageList: [],
      trademarkList: [],
      baseSaleAttrList: [],
      // 定义一个category3id用来呗初始化
      category3Id: ''
    }
  },
  computed: {
    // 计算没有使用的销售属性
    unUseSpuSaleAttrList() {
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        // filter表示过滤出满足条件的,什么样的是满足条件的呢,baseSaleAttr中的任何一个,在this.spuForm.spuSaleAttrList都没有
        return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
          // 全局的name都不能与已有的saleAttrName才被计算出来
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName
        })
      })
    }
  },
  methods: {
    // 上传图片组件需要的两个函数,这个是移出一张图片的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.imageList = fileList
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      this.imageList = fileList
    },
    // 放大镜效果
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 修改spu需要初始化数据的方式
    async initUpdateSpuFormData(row) {
      this.category3Id = row.category3Id
      // 接收参数包含spu的id
      // 需要发送四个请求:获取所有品牌列表数据和获取所有销售属性属性数据和图片列表和spu的详情(后两个需要根据spu的id来获取)
      // 获取spu的详情
      const result = await this.$API.spu.get(row.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }
      // 获取图片列表:这个请求接口函数在sku之中
      const imgageResult = await this.$API.sku.getSpuImageList(row.id)
      if (imgageResult.code === 200) {
        const imageList = imgageResult.data
        // 因为上传图片组件,需要展示的数组中的每个对象需要包含name和url属性,在这里将请求来的数据改造之后在赋值
        imageList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 这样能保证imageList整体都是一个响应式数据
        this.imageList = imageList
      }
      // 获取所有的品牌,后续两个请求在添加初始化的时候也要发送
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 添加spu需要初始化数据的方法
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id
      // 需要发送两个请求:获取所有品牌列表数据和获取所有销售属性属性数据
      // 获取所有的品牌
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性数据
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList()
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdOrName.split(':')
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      // 添加之后将输入框清空
      this.spuSaleAttrIdOrName = ''
    },
    // 点击el-tag的添加按钮展示input输入框
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      // inpuot自动获取焦点，因为每个一行中只有一个input所以可以直接获取
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // input失去焦点或者回车
    handleInputConfirm(row) {
      // 添加属性值需要baseSaleAttrId
      const saleAttrValueName = row.inputValue
      const baseSaleAttrId = row.baseSaleAttrId
      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        return
      }
      // 排除重复的,这里不需要,这里不需要排除自己,因为还没有添加进去
      const isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName
      })
      if (isRepeat) {
        this.$message.info('不添加重复属性值')
        return
      }
      // 构造对象添加进去
      const obj = {
        saleAttrValueName,
        baseSaleAttrId
      }
      row.spuSaleAttrValueList.push(obj)
      // 清空输入框
      row.inputValue = ''
      // 隐藏input
      row.inputVisible = false
    },
    // 点击保存按钮进行添加操作
    async save() {
      const { category3Id, spuForm, imageList } = this
      // 整理图片
      spuForm.spuImageList = imageList.map((item) => {
        // map方法构造一个新的对象返回,如果是原始的图片还是新的图片都有name,原始的图片有imgUrl新的图片的url在reponse.data主公
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })
      // 删除自己添加的属性
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputVisible
        delete item.inputValue
      })
      // 整理category3id,这个id是父组件传递过来的,在发送四个请求之前进行初始化
      spuForm.category3Id = category3Id
      try {
        await this.$API.spu.addUpdate(spuForm)
        // 给出提示
        this.$message.success(spuForm.id ? '修改成功' : '添加成功')
        // 会到父组件
        this.$emit('update:visible', false)
        // 通知父组件成功
        this.$emit('successBack')
        // 清空data中的所有数据
        this.resetData()
      } catch (error) {
        this.$message.error(spuForm.id ? '修改失败' : '添加失败')
      }
    },
    resetData() {
      this.spuForm = {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: 0,
        // id: 0,  这个id不需要
        spuImageList: [],
        spuSaleAttrList: []
      }
      // 先定义一个数据,展示当前spu没有的销售属性暂时收集,现在修改了因为这里负责收集id和name
      this.spuSaleAttrIdOrName= '',
      // 上传图片组件需要的数据
      this.dialogImageUrl= '',
      this.dialogVisible=false,
      // 存储额外获取的数据,这些数据最终需要重新整理
      this.imageList= [],
      this.trademarkList=[],
      this.baseSaleAttrList=[],
      // 定义一个category3id用来呗初始化
      this.category3Id=''
    },
    // 点击取消
    cancel(){
      // 回到父组件
      this.$emit('update:visible', false)
      // 告诉父组件清空标识,因为我最后没改
      this.$emit('cancelBack')
      // 并且要重置数据,否则第一次点修改,第二次点击添加,数据都残留了
      this.resetData()
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
```

**到这里就结束了先不看这个项目了**

### sku操作

点击spu组件中的添加spu按钮需要展示的页面,及skuForm组件

接口需要的参数对象:
```js
skuInfo: {
  // 下面3个数据从父组件传入收集
  category3Id: null, // 3级分类ID
  spuId: null, // SPU的id
  tmId: null, // 品牌ID
  
  // 下面4个通过v-model收集
  skuName: null, // sku的名称
  skuDesc: null, // sku的描述
  price: null, // sku的价格
  weight: null, // sku的重量
  
  skuDefaultImg: null, // sku的默认图片  
  skuAttrValueList: [], // sku的属性值列表
  skuSaleAttrValueList: [], // sku属性属性值列表
  skuImageList: [], // 选择的spu图片列表
},
```

**实现静态页面**

1. 给`el-input`添加`type="number"`,则在最后可以出现数字增加减少的箭头
2. 给`el-table-column`添加`<el-table-column type="selection"></el-table-column>`可以实现选择框
3. 每一个`table-column`中可以重新嵌套`el-form`
4. 实现取消按钮回到父组件spu

**请求初始化数据展示**

1. 跟修改spu一样,通过父组件调用子组件内部的方法,发送请求获取初始化数据
2. 子组件需要发送三个请求: 获取指定分类下的属性列表(attr中),通过spuid获取对应的销售属性列表(sku中)
















