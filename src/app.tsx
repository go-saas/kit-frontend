import RightContent from '@/components/RightContent';
import { ProBreadcrumb } from '@ant-design/pro-components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AccountApi, TenantServiceApi } from '@kit/api';
import { message, notification } from 'antd';
import { addLocale } from '@@/plugin-locale/localeExports';
import type { RequestConfig } from 'umi';
import {
  authRequestInterceptor,
  csrfRequestInterceptor,
  csrfRespInterceptor,
  saasRequestInterceptor,
  authRespInterceptor,
  setSettingTenantId,
  bizErrorInterceptor,
  tenantErrorInterceptor,
} from '@kit/core';
import type { UserInfo, UserTenantInfo } from '@kit/core';
import { FriendlyError } from '@kit/core';
import { getRequestInstance } from '@@/plugin-request/request';
import type { V1LocaleLanguage } from '@kit/api';
import { setDefaultAxiosFactory, MenuServiceApi, LocaleServiceApi } from '@kit/api';
import type { Route } from '@/utils/menuTransform';
import { transformMenu } from '@/utils/menuTransform';
import type { AxiosResponse } from 'umi';
import { ErrorShowType } from '@/utils/errors';
import TenantDropdown from '@/components/TenantDropdown';
import pRetry from 'p-retry';
import type { RouteObject } from 'react-router-dom';
import { accessTree } from '@/utils/tree';

// const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/user/login';
// 错误处理方案： 错误类型

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
      addLocale(p.name!, msg, { momentLocale: p.name!, antd: p.name! });
    });
  } catch (e) {}

  const changeTenant = async (idOrName: string) => {
    if (!idOrName) {
      //change to host
      setSettingTenantId();
    } else {
      const tenantPub = await new TenantServiceApi().tenantServiceGetTenantPublic({
        idOrName: idOrName,
      });
      setSettingTenantId(tenantPub.data?.id);
    }
    window.location.reload();
  };
  const fetchUserInfo = async () => {
    try {
      const resp = await new AccountApi().accountGetProfile({ showType: ErrorShowType.SILENT });
      return resp.data as any as UserInfo;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const currentUser = await fetchUserInfo();
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
    if ((t as Route).route?.type == 'microApp') {
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

  // await accessTree<Route>(allMenus, async (t) => {
  //   if ((t as Route).route) {
  //     //omit id
  //     const { id, ...data } = t as Route;
  //     extraRoutes.push(data);
  //   }
  //   return true;
  // });
  oldRender();
}

export function patchClientRoutes(params: { routes: RouteObject[] }) {
  console.log(extraRoutes);
  const withLayout = params.routes.find((p) => (p as any).id == 'ant-design-pro-layout')!.children!;
  extraRoutes.forEach((it) => {
    if (!withLayout.find((p) => p.path == it.path)) {
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
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    headerContentRender: () => {
      return <ProBreadcrumb />;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
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
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

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
          message.warn(errorMessage);
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
      history.push(loginPath);
    }),
    tenantErrorInterceptor(),
  ],
};
