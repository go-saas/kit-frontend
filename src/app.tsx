import RightContent from '@/components/RightContent';
import { ProBreadcrumb } from '@ant-design/pro-components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AccountApi, TenantServiceApi } from '@kit/api';
import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';
import {
  authRequestInterceptor,
  csrfRequestInterceptor,
  csrfRespInterceptor,
  saasRequestInterceptor,
  setSettingTenantId,
  isErrorMessage,
} from '@kit/core';
import type { UserInfo, UserTenantInfo } from '@kit/core';
import { getRequestInstance } from '@@/plugin-request/request';
import type { V1Menu } from '@kit/api';
import { setDefaultAxiosFactory, MenuServiceApi } from '@kit/api';
import { transformMenu } from '@/utils/menuTransform';

const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/user/login';
// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

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
  availableMenu?: V1Menu[];
}> {
  setDefaultAxiosFactory(getRequestInstance);

  let currentTenant: UserTenantInfo | undefined = undefined;
  const currentReps = await new TenantServiceApi().tenantServiceGetCurrentTenant();
  currentTenant = currentReps.data as any as UserTenantInfo;

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
      const resp = await new AccountApi().accountGetProfile({
        data: { showType: ErrorShowType.SILENT },
      });
      return resp.data as any as UserInfo;
    } catch (error) {
      console.log(error);
      history.push(loginPath);
    }
    return undefined;
  };

  //fetch menu
  let availableMenu: V1Menu[] = [];
  try {
    const menuResp = await new MenuServiceApi().menuServiceGetAvailableMenus();
    availableMenu = menuResp.data?.items ?? [];
  } catch (error) {
    console.log(error);
  }
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      changeTenant,
      settings: defaultSettings,
      availableMenu,
    };
  }
  return {
    fetchUserInfo,
    currentTenant,
    changeTenant,
    settings: defaultSettings,
    availableMenu,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    title: initialState?.currentTenant?.tenant?.displayName ?? 'GO SAAS KIT',
    menu: {
      params: {
        userId: initialState?.currentUser?.id,
        tenantId: initialState?.currentTenant?.tenant?.id,
      },
      request: async () => {
        return transformMenu(initialState?.availableMenu ?? []);
      },
    },

    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: () => {
      const { location } = history;
      console.log(history);
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
    (resp: any) => {
      return resp;
    },
    (error: any) => {
      console.log(error);
      const { config, code } = error || {};
      let showType = ErrorShowType.ERROR_MESSAGE;
      let errorMessage = '';
      let errorCode = code;

      let customCfg = config?.data || {};
      if (typeof customCfg === 'string') {
        customCfg = JSON.parse(customCfg);
      }
      if ('showType' in customCfg) {
        showType = customCfg.showType;
      }
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (isErrorMessage(error.response.data || {})) {
          errorCode = error.response.data.reason;
          errorMessage = error.response.data.message || error.response.data.reason;
        }
        if (!errorMessage) {
          const status = error.response.status;
          errorMessage = status.toString();
        }
        if (!errorCode) {
          errorCode = errorMessage;
        }
      } else if (error.request) {
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
      return Promise.reject(error);
    },
  ];
}

export const request: RequestConfig = {
  baseURL: BASE_URL,
  requestInterceptors: [authRequestInterceptor, csrfRequestInterceptor, saasRequestInterceptor],
  responseInterceptors: [csrfRespInterceptor, errorInterceptor() as any],
};
