import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  // 路由的配置
  {
    path: '/product', // 路径为porduct,product作为一个一级路由,但是没有需要显示的组件,展示的是Layout组件
    name: 'Product',
    component: Layout,
    // 配置重定向路由
    redirect: '/product/trademark',
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
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/List'),
        meta: { title: 'SPU管理' } // 二级路由就不需要图标了
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/List'),
        meta: { title: 'SKU管理' } // 二级路由就不需要图标了
      },

      // 重定向路由的另一种配置方式,在二级路由内部配置,path为空字符串,当访问一级路由的时候,检查二级路由没有匹配到最后匹配到一个空,就重定向到trademark
      /* {
        path:'',
        redirect:'trademark'
      } */
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
