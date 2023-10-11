import RightContent from '@/components/RightContent';
import { ProBreadcrumb } from '@ant-design/pro-components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AccountApi, TenantServiceApi } from '@gosaas/api';
import { message, notification } from 'antd';
import { addLocale } from '@@/plugin-locale/localeExports';
import type { RequestConfig } from '@umijs/max';
import {
  authRequestInterceptor,
  csrfRequestInterceptor,
  csrfRespInterceptor,
  saasRequestInterceptor,
  authRespInterceptor,
  setSettingTenantId,
  bizErrorInterceptor,
} from '@gosaas/core';
import type { UserInfo, UserTenantInfo } from '@gosaas/core';
import { FriendlyError } from '@gosaas/core';
import { getRequestInstance } from '@@/plugin-request/request';
import type { V1LocaleLanguage } from '@gosaas/api';
import { setDefaultAxiosFactory, MenuServiceApi, LocaleServiceApi } from '@gosaas/api';
import type { Route } from '@/utils/menuTransform';
import { transformMenu } from '@/utils/menuTransform';
import type { AxiosResponse } from '@umijs/max';
import { ErrorShowType } from '@/utils/errors';
import TenantDropdown from '@/components/TenantDropdown';
import pRetry from 'p-retry';
import type { RouteObject } from 'react-router-dom';
import { accessTree } from '@/utils/tree';
import Realtime from './components/Realtime';
import React from 'react';
import { loginOut } from '@/utils/auth';
import enUS0 from 'antd/es/locale/en_US';
import zhCN0 from 'antd/es/locale/zh_CN';
// const isDev = process.env.NODE_ENV === 'development';

// 错误处理方案： 错误类型

const changeTenant = async (idOrName?: string) => {
  let par = idOrName;
  if (!par) {
    par = '-';
  }
  const tenantPub = await new TenantServiceApi().tenantServiceChangeTenant({
    idOrName: par,
    body: {},
  });

  if (tenantPub.data.isHost) {
    //change to host
    setSettingTenantId();
  } else {
    setSettingTenantId(tenantPub.data?.tenant.id);
  }
  window.location.reload();
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfo;
  currentTenant?: UserTenantInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
  changeTenant?: (name: string) => Promise<void>;
}> {
  let currentTenant: UserTenantInfo | undefined = undefined;

  await pRetry(
    async () => {
      const currentReps = await new TenantServiceApi().tenantServiceGetCurrentTenant();
      currentTenant = currentReps.data as any as UserTenantInfo;
    },
    { forever: true, randomize: true, maxTimeout: 5000 },
  );

  try {
    const locales = await new LocaleServiceApi().localeServiceListMessages();
    ((locales.data?.items as V1LocaleLanguage[] | undefined) ?? []).forEach((p) => {
      const msg: Record<string, string> = {};
      (p.msg ?? []).forEach((m) => {
        msg[m.id!] = m.other!;
      });
      let name = p.name!;
      if (name.startsWith('zh')) {
        name = 'zh-CN';
        addLocale(name, msg, { momentLocale: name, antd: zhCN0 as any });
      } else if (name.startsWith('en')) {
        name = 'en-US';
        addLocale(name, msg, { momentLocale: name, antd: enUS0 as any });
      } else {
        addLocale(name, msg, { momentLocale: name, antd: enUS0 as any });
      }
    });
  } catch (e) {}

  const fetchUserInfo = async () => {
    try {
      const resp = await new AccountApi().accountGetProfile({ showType: ErrorShowType.SILENT });
      return resp.data as any as UserInfo;
    } catch (error) {
      loginOut();
    }
    return undefined;
  };

  const currentUser = await fetchUserInfo();

  if (currentUser) {
    if (currentUser.currentTenant?.isHost) {
      if ((currentUser.tenants ?? []).length > 0) {
        if (!currentUser.tenants.find((p) => p.isHost)) {
          //not in host side
          await changeTenant(currentUser.tenants.find((p) => !p.isHost)?.tenant?.id);
        }
      }
    }
  }

  return {
    fetchUserInfo,
    currentUser,
    currentTenant,
    changeTenant,
    settings: defaultSettings,
  };
}

let initialMenus: Route[] | undefined = undefined;

async function getMenu() {
  if (initialMenus) {
    return initialMenus;
  }
  setDefaultAxiosFactory(getRequestInstance);
  await pRetry(
    async () => {
      const menuResp = await new MenuServiceApi().menuServiceGetAvailableMenus();
      const availableMenu = menuResp.data?.items ?? [];
      initialMenus = transformMenu(availableMenu);
    },
    { forever: true, randomize: true, maxTimeout: 5000 },
  );

  return initialMenus!;
}

export async function qiankun() {
  const apps: Record<string, any> = {};
  const allMenus = await getMenu();
  await accessTree<Route>(allMenus, async (t) => {
    if ((t as Route).route?.type === 'microApp') {
      const a = (t as Route).route!;
      apps[a.microAppName!] = {
        entry: a?.microAppEntry,
        credentials: true,
      };
    }
    return true;
  });
  const appArray = Object.keys(apps).map((key) => {
    return { name: key, ...apps[key] };
  });
  console.log(appArray);
  return {
    apps: appArray,
    lifeCycles: {
      beforeLoad: (props: any) => {
        console.log(props);
      },
      afterMount: (props: any) => {
        console.log(props);
      },
    },
  };
}

// 动态添加路由（含微应用路由）
let extraRoutes: Route[] = [];
export async function render(oldRender: () => any) {
  extraRoutes = await getMenu();
  oldRender();
}

export function patchClientRoutes(params: { routes: RouteObject[] }) {
  console.log(extraRoutes);
  const withLayout = params.routes.find((p) => (p as any).id === 'ant-design-pro-layout')!
    .children!;
  extraRoutes.forEach((it) => {
    if (!withLayout.find((p) => p.path === it.path)) {
      //need add route
      withLayout!.unshift(it);
    }
  });
  console.log(params.routes);
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    title: initialState?.currentTenant?.tenant?.displayName ?? 'GO SAAS KIT',
    headerTitleRender: (logo, title) => {
      return <TenantDropdown logo={logo} title={title} />;
    },
    menu: {
      params: {
        userId: initialState?.currentUser?.id,
        tenantId: initialState?.currentTenant?.tenant?.id,
      },
      request: async () => {
        return getMenu();
      },
    },

    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    menuHeaderRender: undefined,
    headerContentRender: () => {
      return <ProBreadcrumb />;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

export function rootContainer(container: any) {
  return React.createElement(Realtime, null, container);
}

function errorInterceptor() {
  return [
    (resp: AxiosResponse) => {
      return resp;
    },
    (error: any) => {
      console.log(error.wrap || error);
      const { config, code, response, request } = error.wrap || error || {};
      let showType = ErrorShowType.ERROR_MESSAGE;
      let errorMessage = '';
      let errorCode = code;

      if ('showType' in config) {
        showType = config.showType;
      }

      if (error instanceof FriendlyError) {
        errorCode = error.reason;
        errorMessage = error.message || errorCode;
      }
      if (response) {
        if (!errorMessage) {
          const status = response.status;
          errorMessage = status.toString();
        }
        if (!errorCode) {
          errorCode = errorMessage;
        }
      } else if (request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        errorMessage = 'None response! Please retry.';
        showType = ErrorShowType.ERROR_MESSAGE;
      } else {
        // 发送请求时出了点问题
        errorMessage = 'Request error, please retry.';
        showType = ErrorShowType.ERROR_MESSAGE;
      }
      switch (showType) {
        case ErrorShowType.SILENT:
          // do nothing
          break;
        case ErrorShowType.WARN_MESSAGE:
          message.warning(errorMessage);
          break;
        case ErrorShowType.ERROR_MESSAGE:
          message.error(errorMessage);
          break;
        case ErrorShowType.NOTIFICATION:
          notification.open({
            description: errorMessage,
            message: errorCode,
          });
          break;
        case ErrorShowType.REDIRECT:
          // TODO: redirect
          break;
        default:
          message.error(errorMessage);
      }
      return Promise.reject(new FriendlyError(code, errorCode, errorMessage));
    },
  ];
}

function tenantErrorInterceptorRedirect() {
  return [
    (resp: AxiosResponse) => {
      return resp;
    },
    (error: any) => {
      if (error instanceof FriendlyError) {
        if (['TENANT_NOT_FOUND', 'TENANT_FORBIDDEN'].includes(error.reason)) {
          changeTenant();
        }
      }
      return Promise.reject(error);
    },
  ];
}

export const request: RequestConfig = {
  baseURL: BASE_URL,
  withCredentials: true,
  requestInterceptors: [
    authRequestInterceptor(),
    csrfRequestInterceptor(),
    saasRequestInterceptor(),
  ],
  responseInterceptors: [
    csrfRespInterceptor(),
    bizErrorInterceptor(),
    errorInterceptor() as any,
    authRespInterceptor(() => {
      //redirect to login
      loginOut();
    }),
    tenantErrorInterceptorRedirect(),
  ],
};
