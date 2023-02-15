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
