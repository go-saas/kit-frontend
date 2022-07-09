import { getRequestInstance } from '@@/plugin-request/request';
import type { UploadFileParams, UploadApiResult } from '@kit/core';
import { uploadFile } from '@kit/core';

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
