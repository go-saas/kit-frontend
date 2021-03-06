/* tslint:disable */
/* eslint-disable */
/**
 * Saas Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { RpcStatus } from '../models';
// @ts-ignore
import { V1ListMessageReply } from '../models';
/**
 * LocaleServiceApi - axios parameter creator
 * @export
 */
export const LocaleServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {Array<string>} [filterNameIn] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        localeServiceListMessages: async (filterNameIn?: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/sys/locale/msgs`;
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

            if (filterNameIn) {
                localVarQueryParameter['filter.nameIn'] = filterNameIn;
            }


    
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
 * LocaleServiceApi - functional programming interface
 * @export
 */
export const LocaleServiceApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = LocaleServiceApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {Array<string>} [filterNameIn] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async localeServiceListMessages(filterNameIn?: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<V1ListMessageReply>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.localeServiceListMessages(filterNameIn, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * LocaleServiceApi - factory interface
 * @export
 */
export const LocaleServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = LocaleServiceApiFp(configuration)
    return {
        /**
         * 
         * @param {Array<string>} [filterNameIn] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        localeServiceListMessages(filterNameIn?: Array<string>, options?: any): AxiosPromise<V1ListMessageReply> {
            return localVarFp.localeServiceListMessages(filterNameIn, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for localeServiceListMessages operation in LocaleServiceApi.
 * @export
 * @interface LocaleServiceApiLocaleServiceListMessagesRequest
 */
export interface LocaleServiceApiLocaleServiceListMessagesRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof LocaleServiceApiLocaleServiceListMessages
     */
    readonly filterNameIn?: Array<string>
}

/**
 * LocaleServiceApi - object-oriented interface
 * @export
 * @class LocaleServiceApi
 * @extends {BaseAPI}
 */
export class LocaleServiceApi extends BaseAPI {
    /**
     * 
     * @param {LocaleServiceApiLocaleServiceListMessagesRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LocaleServiceApi
     */
    public localeServiceListMessages(requestParameters: LocaleServiceApiLocaleServiceListMessagesRequest = {}, options?: AxiosRequestConfig) {
        return LocaleServiceApiFp(this.configuration).localeServiceListMessages(requestParameters.filterNameIn, options).then((request) => request(this.axios, this.basePath));
    }
}
