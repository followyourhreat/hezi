import Vue from 'vue'
import Router from 'vue-router'
//src重定义为@
import Main from '@/pages/Main'

Vue.use(Router)

//基础路由,一般不包含父组件Main
export const baseRouter = [{
    path: '/',
    name: 'login',
    title: '登录',
    component: resolve => require(['../pages/login/login.vue'], resolve)
  },
  {
    path: '/forget',
    name: 'forget',
    title: '忘记密码',
    component: (resolve) => require(['../pages/login/forget.vue'], resolve)
  }
];

/*
 *作为Main组件的子页面展示并且在左侧菜单显示的路由,参数说明
 *@path 路径
 *@name 路由别名
 *@icon 一级菜单图标
 *@title 名字
 *@toName 跳转指定二级菜单
 *@component 对应组件加载
 *@hasChildren 是否有二级菜单
 *@children 二级菜单
 */
export const pagesRouter = [{
    path: '/home',
    name: 'home',
    icon: 'home',
    title: '首页',
    toName: 'home-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'home-index',
      title: '首页',
      // component: resolve => require(['../pages/home/index'], resolve)
      component: resolve => require(['../pages/home/index'], resolve)
    }]
  },
  {
    path: '/test',
    name: 'test',
    icon: 'test',
    title: '测试',
    toName: 'test-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'test-index',
      title: '测试',
      component: resolve => require(['../pages/test/index'], resolve)
    }]
  },
  {
    path: '/authority',
    name: 'authority',
    icon: 'levels',
    title: '权限管理',
    toName: 'authority-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'authority-index',
      title: '权限管理',
      component: resolve => require(['../pages/3_authority/index'], resolve)
    }]
  },
  {
    path: '/user',
    name: 'user',
    icon: 'person-stalker',
    title: '用户管理',
    toName: 'user-list',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'list',
      name: 'user-list',
      title: '用户管理',
      component: resolve => require(['../pages/2_user/list'], resolve)
    }]
  },
  {
    path: '/task',
    name: 'task',
    icon: 'pricetag',
    title: '任务管理',
    toName: 'task-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'task-index',
      title: '任务管理',
      component: resolve => require(['../pages/4_task/index'], resolve)
    }]
  },
  {
    path: '/integral',
    name: 'integral',
    icon: 'integral',
    title: '积分管理',
    toName: 'integral-list',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'list',
      name: 'integral-list',
      title: '积分管理',
      // component: resolve => require(['../pages/5_medal/list'], resolve)
      component: resolve => require(['../pages/5_medal/list'], resolve)
    }]
  },
  {
    path: '/coupon',
    name: 'coupon',
    icon: 'bookmark',
    title: '优惠券管理',
    toName: 'coupon-list',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'list',
      name: 'coupon-list',
      title: '优惠券管理',
      component: resolve => require(['../pages/6_coupon/list'], resolve)
    }]
  },
  {
    path: '/finance',
    name: 'finance',
    icon: 'podium',
    title: '财务管理',
    toName: 'finance-list',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'list',
      name: 'finance-list',
      title: '财务管理',
      component: resolve => require(['../pages/7_finance/list'], resolve)
    }]
  },
  {
    path: '/shop',
    name: 'shop',
    icon: 'briefcase',
    title: '商城管理',
    toName: 'shop-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'shop-index',
      title: '商城管理',
      component: resolve => require(['../pages/8_shop/index'], resolve)
    }]
  },
    {
    path: '/rank',
    name: 'rank',
    icon: 'rank',
    title: '排行榜管理',
    toName: 'rank-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'rank-index',
      title: '排行榜管理',
      component: resolve => require(['../pages/rank/index'], resolve)
    }]
  },
   {
    path: '/system',
    name: 'system',
    icon: 'gear-b',
    title: '配置管理',
    toName: 'system-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'system-index',
      title: '配置管理',
      component: resolve => require(['../pages/10_system/index'], resolve)
    }]
  },
  
  {
    path: '/message',
    name: 'message',
    icon: 'paper-airplane',
    title: '消息推送',
    toName: 'message-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'message-index',
      title: '消息推送',
      component: resolve => require(['../pages/9_message/index'], resolve)
    }]
  },
  {
    path: '/firmware',
    name: 'firmware',
    icon: 'firmware',
    title: '固件升级',
    toName: 'firmware-index',
    component: Main,
    hasChildren: true,
    children: [{
      path: 'index',
      name: 'firmware-index',
      title: '固件升级',
      component: resolve => require(['../pages/firmware/index'], resolve)
    }]
  },
 
];

/*
 *作为Main组件的子页面展示但是不在左侧菜单显示的路由,参数说明
 *@path 路径
 *@name 路由别名
 *@title 名字
 *@component 对应组件加载
 */
export const othersRouter = [{
    path: '/user',
    name: 'user',
    title: '用户板块',
    component: Main,
    children: [{
        path: 'index',
        name: 'user-index',
        title: '用户信息',
        component: resolve => require(['../pages/user/index'], resolve)
      },
      {
        path: 'index2',
        name: 'user-index2',
        title: '修改密码',
        component: resolve => require(['../pages/user/index2'], resolve)
      },
    ]
  },
  {
    path: '/others',
    name: 'othersRouter',
    redirect: '/home',
    title: '单菜单',
    component: Main,
    children: [{
      path: 'edit',
      name: 'home-edit',
      title: '编辑',
      component: resolve => require(['../pages/home/index'], resolve)
    }]
  },
];

//网络错误路由403,404,500等等页面
export const errRouter = [{
    path: '/*',
    name: 'error-404',
    title: '404-页面不存在',
    component: resolve => require(['../pages/errorPage/404.vue'], resolve)
  },
  {
    path: '/403',
    name: 'error-403',
    title: '403-权限不足',
    component: resolve => require(['../pages/errorPage/403.vue'], resolve)
  },
  {
    path: '/500',
    name: 'error-500',
    title: '500-服务端错误',
    component: resolve => require(['../pages/errorPage/500.vue'], resolve)
  },
];

//...将一个数组转为用逗号分隔的参数序列,组装成router
export default new Router({
  routes: [
    ...baseRouter,
    ...pagesRouter,
    ...othersRouter,
    ...errRouter,
  ]
})
