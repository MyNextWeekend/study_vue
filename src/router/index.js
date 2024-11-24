import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
    { path: '/Login', component: () => import('../components/Login.vue') },

    { path: '/ArgsConfig', component: () => import('../pages/ArgsConfig.vue') },
    { path: '/ListRepertory', component: () => import('../pages/ListRepertory.vue') },
    { path: '/ListReport', component: () => import('../pages/ListReport.vue') },

    { path: '/ListDB', component: () => import('../pages/ListDB.vue') },
    { path: '/ListEnvironment', component: () => import('../pages/ListEnvironment.vue') },
    { path: '/ListDataPreparation', component: () => import('../pages/ListDataPreparation.vue') },
    
    { path: '/Home', component: () => import('../pages/Home.vue') },
    {
        path: '/test',
        component: () => import('../components/test.vue'),
        beforeEnter: (to, from, next) => {
            // 每路守卫,判断是否有权限进入该页面
            next()
        }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/404.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // console.log(to);
    // console.log(from);
    next()//通行
})

export default router;