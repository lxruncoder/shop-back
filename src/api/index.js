export { default as trademark } from './product/trademark'
export { default as attr } from './product/attr'
export { default as sku } from './product/sku'
export { default as spu } from './product/spu'
export {default as category} from './product/category'

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
  最后就可以将$API挂载到Vue的原型上
*/
