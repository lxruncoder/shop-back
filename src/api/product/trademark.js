import request from '@/utils/request' // 引入axios
// 采用的是默认暴露
export default {
  // 删除品牌
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