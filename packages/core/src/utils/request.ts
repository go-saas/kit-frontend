import axios from 'axios';
import storage from './storage';
import { ACCESS_TOKEN_KEY, CSRF_TOKEN_KEY } from '@/enums/cacheEnum';
import { getSettingTenantId, setSettingTenantId } from './auth';
import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { FriendlyError } from './errors';
export interface ErrorMessage {
  code: number;
  message: string;
  reason: string;
  metadata: any;
}

export function isErrorMessage(obj: any): obj is ErrorMessage {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    // 👇️ check for type property
    return 'code' in obj && 'message' in obj && 'reason' in obj;
  }
  return false;
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

export function authRequestInterceptor() {
  return function (config: AxiosRequestConfig) {
    const token = storage.get(ACCESS_TOKEN_KEY);
    config.headers = config.headers || {};
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };
}

export function csrfRequestInterceptor() {
  return function (config: AxiosRequestConfig) {
    const csrf = storage.getCookie(CSRF_TOKEN_KEY);
    config.headers = config.headers || {};
    if (csrf) {
      config.headers[CSRF_TOKEN_KEY] = csrf;
    }
    return config;
  };
}

export function saasRequestInterceptor() {
  return function (config: AxiosRequestConfig) {
    const t = getSettingTenantId();
    config.headers = config.headers || {};
    if (t) {
      config.headers['__tenant'] = t;
    }
    return config;
  };
}

export function authRespInterceptor(unauthorizedAction?: () => void, forbiddenAction?: () => void) {
  return [
    (resp: AxiosResponse) => {
      return resp;
    },
    (error: any) => {
      const code = error.code ?? error.wrap?.response?.status ?? error?.response?.status ?? 0;
      if (code == 401) {
        unauthorizedAction?.();
      }
      if (code == 403) {
        forbiddenAction?.();
      }
      return Promise.reject(error);
    },
  ];
}

export function csrfRespInterceptor() {
  return function (res: AxiosResponse) {
    if (res.headers[CSRF_TOKEN_KEY]) {
      storage.setCookie(CSRF_TOKEN_KEY, res.headers[CSRF_TOKEN_KEY]);
    }
    return res;
  };
}

export function bizErrorInterceptor() {
  return [
    (resp: AxiosResponse) => {
      return resp;
    },
    (error: any) => {
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const data = error.response.data || {};
        if (isErrorMessage(data)) {
          return Promise.reject(new FriendlyError(data.code, data.reason, data.message, error));
        }
      }
      return Promise.reject(error);
    },
  ];
}

export function tenantErrorInterceptor() {
  return [
    (resp: AxiosResponse) => {
      return resp;
    },
    (error: any) => {
      if (error instanceof FriendlyError) {
        if (['TENANT_NOT_FOUND', 'TENANT_FORBIDDEN'].includes(error.reason)) {
          setSettingTenantId();
          window.location.reload();
        }
      }
      return Promise.reject(error);
    },
  ];
}

export function uploadFile<T = any>(
  config: AxiosRequestConfig,
  params: UploadFileParams,
  instance?: AxiosInstance,
) {
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

  return (instance ?? service).request<T>({
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
  onUploadProgress: ((progressEvent: ProgressEvent) => void) | undefined,
  instance?: AxiosInstance,
) {
  return uploadFile<UploadApiResult>(
    {
      url: url,
      onUploadProgress,
    },
    params,
    instance,
  );
}

export default service;
