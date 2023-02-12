import { getRequestInstance } from '@@/plugin-request/request';
import type { UploadFileParams, UploadApiResult } from '@gosaas/core';
import { uploadFile } from '@gosaas/core';

/**
 * @description: Upload interface
 */
export function uploadApi(
  url: string,
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) {
  return uploadFile<UploadApiResult>(
    {
      url: url,
      onUploadProgress,
    },
    params,
    getRequestInstance(),
  );
}

export function uploadTransform(value: any, namePath: string): string | Record<string, any> {
  if (!value) {
    return value;
  }
  let res: any;
  if (Array.isArray(value)) {
    res = value.map((p) => p.response ?? p);
  } else {
    res = [value.response ?? value];
  }
  return { [namePath]: res };
}

export function uploadTransformSingle(value: any, namePath: string): string | Record<string, any> {
  if (!value) {
    return value;
  }
  let res: any;
  if (Array.isArray(value)) {
    res = value.map((p) => p.response ?? p);
  } else {
    res = [value.response ?? value];
  }
  return res.length > 0 ? { [namePath]: res[0] } : {};
}

export function uploadConvertValue(value: any): Array<UploadApiResult> {
  if (!value) {
    return value;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}
