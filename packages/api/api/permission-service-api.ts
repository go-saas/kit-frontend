/* tslint:disable */
/* eslint-disable */
/**
 * order/api/order/v1/order.proto
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: version not set
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { GooglerpcStatus } from '../models';
// @ts-ignore
import { V1CheckPermissionReply } from '../models';
// @ts-ignore
import { V1CheckPermissionRequest } from '../models';
// @ts-ignore
import { V1GetCurrentPermissionReply } from '../models';
/**
 * PermissionServiceApi - axios parameter creator
 * @export
 */
export const PermissionServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {V1CheckPermissionRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        permissionServiceCheckCurrent: async (body: V1CheckPermissionRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('permissionServiceCheckCurrent', 'body', body)
            const localVarPath = `/v1/permission/check`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get current permission
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        permissionServiceGetCurrent: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/permission/current`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PermissionServiceApi - functional programming interface
 * @export
 */
export const PermissionServiceApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PermissionServiceApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {V1CheckPermissionRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async permissionServiceCheckCurrent(body: V1CheckPermissionRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<V1CheckPermissionReply>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.permissionServiceCheckCurrent(body, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['PermissionServiceApi.permissionServiceCheckCurrent']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
        /**
         * 
         * @summary Get current permission
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async permissionServiceGetCurrent(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<V1GetCurrentPermissionReply>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.permissionServiceGetCurrent(options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['PermissionServiceApi.permissionServiceGetCurrent']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * PermissionServiceApi - factory interface
 * @export
 */
export const PermissionServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PermissionServiceApiFp(configuration)
    return {
        /**
         * 
         * @param {PermissionServiceApiPermissionServiceCheckCurrentRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        permissionServiceCheckCurrent(requestParameters: PermissionServiceApiPermissionServiceCheckCurrentRequest, options?: AxiosRequestConfig): AxiosPromise<V1CheckPermissionReply> {
            return localVarFp.permissionServiceCheckCurrent(requestParameters.body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get current permission
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        permissionServiceGetCurrent(options?: AxiosRequestConfig): AxiosPromise<V1GetCurrentPermissionReply> {
            return localVarFp.permissionServiceGetCurrent(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for permissionServiceCheckCurrent operation in PermissionServiceApi.
 * @export
 * @interface PermissionServiceApiPermissionServiceCheckCurrentRequest
 */
export interface PermissionServiceApiPermissionServiceCheckCurrentRequest {
    /**
     * 
     * @type {V1CheckPermissionRequest}
     * @memberof PermissionServiceApiPermissionServiceCheckCurrent
     */
    readonly body: V1CheckPermissionRequest
}

/**
 * PermissionServiceApi - object-oriented interface
 * @export
 * @class PermissionServiceApi
 * @extends {BaseAPI}
 */
export class PermissionServiceApi extends BaseAPI {
    /**
     * 
     * @param {PermissionServiceApiPermissionServiceCheckCurrentRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PermissionServiceApi
     */
    public permissionServiceCheckCurrent(requestParameters: PermissionServiceApiPermissionServiceCheckCurrentRequest, options?: AxiosRequestConfig) {
        return PermissionServiceApiFp(this.configuration).permissionServiceCheckCurrent(requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get current permission
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PermissionServiceApi
     */
    public permissionServiceGetCurrent(options?: AxiosRequestConfig) {
        return PermissionServiceApiFp(this.configuration).permissionServiceGetCurrent(options).then((request) => request(this.axios, this.basePath));
    }
}

