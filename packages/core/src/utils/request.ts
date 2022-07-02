import axios from 'axios';
import storage from './storage';
import { ACCESS_TOKEN_KEY, CSRF_TOKEN_KEY } from '@/enums/cacheEnum';
import { getSettingTenantId, setSettingTenantId } from './auth';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
export interface ErrorMessage {
  code: number;
  message: string;
  reason: string;
  metadata: any;
}

export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}

export const service = axios.create({
  timeout: 6000,
  withCredentials: true,
});

export function setupService(fn: (i: AxiosInstance) => void) {
  fn(service);
}

export function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = storage.get(ACCESS_TOKEN_KEY);
  config.headers = config.headers || {};
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

export function csrfRequestInterceptor(config: AxiosRequestConfig) {
  const csrf = storage.getCookie(CSRF_TOKEN_KEY);
  config.headers = config.headers || {};
  if (csrf) {
    config.headers[CSRF_TOKEN_KEY] = csrf;
  }
  return config;
}

export function csrfRespInterceptor(res: AxiosResponse) {
  if (res.headers[CSRF_TOKEN_KEY]) {
    storage.setCookie(CSRF_TOKEN_KEY, res.headers[CSRF_TOKEN_KEY]);
  }
  return res;
}

export function saasRequestInterceptor(config: AxiosRequestConfig) {
  const t = getSettingTenantId();
  config.headers = config.headers || {};
  if (t) {
    config.headers['__tenant'] = t;
  }
  return config;
}

//ErrorHandling

// service.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     //handle error
//     const { t } = useI18n();
//     const errorLogStore = useErrorLogStoreWithOut();
//     errorLogStore.addAjaxErrorInfo(error);

//     const { response, code, message, config } = error || {};

//     const errorMessageMode = config?.requestOptions?.errorMessageMode || 'message';

//     const errorBody = response?.data as ErrorMessage;

//     let msg: string = errorBody?.message;
//     if (!!!msg) {
//       msg = errorBody.reason;
//     }
//     if (!!!msg) {
//       msg = '';
//     }
//     const err: string = error?.toString?.() ?? '';

//     let errMessage = msg;
//     try {
//       if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
//         errMessage = t('sys.api.apiTimeoutMessage');
//       }
//       if (err?.includes('Network Error')) {
//         errMessage = t('sys.api.networkExceptionMsg');
//       }
//       if (['TENANT_NOT_FOUND', 'TENANT_FORBIDDEN'].includes(errorBody?.reason)) {
//         if (errorBody?.reason == 'TENANT_NOT_FOUND') {
//           createErrorModal({
//             title: t('sys.api.errorTip'),
//             content: t('saas.tenantNotFound'),
//             onOk: () => {
//               window.location.reload();
//             },
//           });
//         }

//         if (errorBody?.reason == 'TENANT_FORBIDDEN') {
//           createErrorModal({
//             title: t('sys.api.errorTip'),
//             content: t('saas.tenantForbidden'),
//             onOk: () => {
//               window.location.reload();
//             },
//           });
//         }
//         setSettingTenantId(null);
//       }
//       if (errMessage) {
//         if (errorMessageMode === 'modal') {
//           createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
//         } else if (errorMessageMode === 'message') {
//           createMessage.error(errMessage);
//         }
//         return Promise.reject(new Error(errMessage));
//       }
//     } catch (error) {
//       throw new Error(error as unknown as string);
//     }

//     checkStatus(error?.response?.status, errorBody?.reason ?? '', msg, errorMessageMode);
//     return Promise.reject(error);
//   },
// );

export function uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
  const formData = new window.FormData();
  const customFilename = params.name || 'file';

  if (params.filename) {
    formData.append(customFilename, params.file, params.filename);
  } else {
    formData.append(customFilename, params.file);
  }

  if (params.data) {
    Object.keys(params.data).forEach((key) => {
      const value = params.data![key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(`${key}[]`, item);
        });
        return;
      }

      formData.append(key, params.data![key]);
    });
  }

  return service.request<T>({
    ...config,
    method: 'POST',
    data: formData,
    headers: {
      'Content-type': ContentTypeEnum.FORM_DATA,
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
}

//TODO check this
export interface UploadApiResult {
  id: string;
  message: string;
  code: number;
  url: string;
}

/**
 * @description: Upload interface
 */
export function uploadApi(
  url: string,
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return uploadFile<UploadApiResult>(
    {
      url: url,
      onUploadProgress,
    },
    params,
  );
}

export default service;
