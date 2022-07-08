export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/sys',
    locale: 'sys.title',
    name: 'sys',
    icon: 'smile',
    routes: [
      {
        name: 'user',
        path: '/sys/users',
        component: './Sys/User',
      },
      {
        name: 'role',
        path: '/sys/roles',
        component: './Sys/Role',
      },
      {
        name: 'role-detail',
        path: '/sys/role/:id',
        component: './Sys/RoleDetail',
        hideInMenu: true,
      },
      {
        name: 'menu',
        path: '/sys/menus',
        component: './Sys/Menu',
      },
    ],
  },
  {
    path: '/saas',
    name: 'saas',
    icon: 'smile',
    routes: [
      {
        name: 'tenant',
        path: '/saas/tenants',
        component: './Saas/Tenant',
      },
    ],
  },
  {
    path: '/iframe/*',
    name: 'iframe',
    icon: 'smile',
    component: '../components/Iframe',
  },
  {
    name: 'dashboard',
    icon: 'table',
    path: '/dashboard',
    routes: [
      {
        name: 'workbench',
        path: '/dashboard/workbench',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/workbench',
  },
  {
    component: './404',
  },
];
