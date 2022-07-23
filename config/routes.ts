export default function getRoutes() {
  const extra = JSON.parse(process.env.EXTRA_ROUTES || '{}').routes || [];
  return [
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
      path: '/oidc',
      icon: 'smile',
      routes: [
        {
          path: '/oidc/clients',
          component: './Oidc/Client',
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
      name: 'dashboard',
      icon: 'table',
      routes: [
        {
          name: 'workbench',
          path: '/dashboard/workbench',
          component: './Welcome',
        },
      ],
    },
    ...extra,
    {
      path: '/',
      redirect: '/dashboard/workbench',
    },
    {
      path: '*',
      component: './404',
    },
  ];
}
