/* tslint:disable */
/* eslint-disable */
/**
 * Realtime Service
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
import { ClientListClientRequest } from '../models';
// @ts-ignore
import { ClientOAuth2Client } from '../models';
// @ts-ignore
import { ClientOAuth2ClientList } from '../models';
// @ts-ignore
import { ClientServicePatchOAuth2ClientRequest } from '../models';
// @ts-ignore
import { ClientServiceUpdateOAuth2ClientRequest } from '../models';
// @ts-ignore
import { GooglerpcStatus } from '../models';
/**
 * ClientServiceApi - axios parameter creator
 * @export
 */
export const ClientServiceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {ClientOAuth2Client} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceCreateOAuth2Client: async (body: ClientOAuth2Client, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('clientServiceCreateOAuth2Client', 'body', body)
            const localVarPath = `/v1/oidc/client`;
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
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceDeleteOAuth2Client: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('clientServiceDeleteOAuth2Client', 'id', id)
            const localVarPath = `/v1/oidc/client/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
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
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceGetOAuth2Client: async (id: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('clientServiceGetOAuth2Client', 'id', id)
            const localVarPath = `/v1/oidc/client/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
        /**
         * 
         * @param {string} [limit] 
         * @param {string} [offset] 
         * @param {string} [clientName] 
         * @param {string} [owner] 
         * @param {string} [afterPageToken] 
         * @param {string} [beforePageToken] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceListOAuth2Clients: async (limit?: string, offset?: string, clientName?: string, owner?: string, afterPageToken?: string, beforePageToken?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/oidc/clients`;
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

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }

            if (clientName !== undefined) {
                localVarQueryParameter['clientName'] = clientName;
            }

            if (owner !== undefined) {
                localVarQueryParameter['owner'] = owner;
            }

            if (afterPageToken !== undefined) {
                localVarQueryParameter['afterPageToken'] = afterPageToken;
            }

            if (beforePageToken !== undefined) {
                localVarQueryParameter['beforePageToken'] = beforePageToken;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {ClientListClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceListOAuth2Clients2: async (body: ClientListClientRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('clientServiceListOAuth2Clients2', 'body', body)
            const localVarPath = `/v1/oidc/client/list`;
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
         * @param {string} id 
         * @param {ClientServicePatchOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServicePatchOAuth2Client: async (id: string, body: ClientServicePatchOAuth2ClientRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('clientServicePatchOAuth2Client', 'id', id)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('clientServicePatchOAuth2Client', 'body', body)
            const localVarPath = `/v1/oidc/client/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
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
         * @param {string} id 
         * @param {ClientServiceUpdateOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceUpdateOAuth2Client: async (id: string, body: ClientServiceUpdateOAuth2ClientRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('clientServiceUpdateOAuth2Client', 'id', id)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('clientServiceUpdateOAuth2Client', 'body', body)
            const localVarPath = `/v1/oidc/client/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
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
    }
};

/**
 * ClientServiceApi - functional programming interface
 * @export
 */
export const ClientServiceApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ClientServiceApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {ClientOAuth2Client} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceCreateOAuth2Client(body: ClientOAuth2Client, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2Client>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceCreateOAuth2Client(body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceDeleteOAuth2Client(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceDeleteOAuth2Client(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceGetOAuth2Client(id: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2Client>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceGetOAuth2Client(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} [limit] 
         * @param {string} [offset] 
         * @param {string} [clientName] 
         * @param {string} [owner] 
         * @param {string} [afterPageToken] 
         * @param {string} [beforePageToken] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceListOAuth2Clients(limit?: string, offset?: string, clientName?: string, owner?: string, afterPageToken?: string, beforePageToken?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2ClientList>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceListOAuth2Clients(limit, offset, clientName, owner, afterPageToken, beforePageToken, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {ClientListClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceListOAuth2Clients2(body: ClientListClientRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2ClientList>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceListOAuth2Clients2(body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} id 
         * @param {ClientServicePatchOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServicePatchOAuth2Client(id: string, body: ClientServicePatchOAuth2ClientRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2Client>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServicePatchOAuth2Client(id, body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} id 
         * @param {ClientServiceUpdateOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async clientServiceUpdateOAuth2Client(id: string, body: ClientServiceUpdateOAuth2ClientRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ClientOAuth2Client>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.clientServiceUpdateOAuth2Client(id, body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * ClientServiceApi - factory interface
 * @export
 */
export const ClientServiceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ClientServiceApiFp(configuration)
    return {
        /**
         * 
         * @param {ClientOAuth2Client} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceCreateOAuth2Client(body: ClientOAuth2Client, options?: any): AxiosPromise<ClientOAuth2Client> {
            return localVarFp.clientServiceCreateOAuth2Client(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceDeleteOAuth2Client(id: string, options?: any): AxiosPromise<object> {
            return localVarFp.clientServiceDeleteOAuth2Client(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceGetOAuth2Client(id: string, options?: any): AxiosPromise<ClientOAuth2Client> {
            return localVarFp.clientServiceGetOAuth2Client(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} [limit] 
         * @param {string} [offset] 
         * @param {string} [clientName] 
         * @param {string} [owner] 
         * @param {string} [afterPageToken] 
         * @param {string} [beforePageToken] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceListOAuth2Clients(limit?: string, offset?: string, clientName?: string, owner?: string, afterPageToken?: string, beforePageToken?: string, options?: any): AxiosPromise<ClientOAuth2ClientList> {
            return localVarFp.clientServiceListOAuth2Clients(limit, offset, clientName, owner, afterPageToken, beforePageToken, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {ClientListClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceListOAuth2Clients2(body: ClientListClientRequest, options?: any): AxiosPromise<ClientOAuth2ClientList> {
            return localVarFp.clientServiceListOAuth2Clients2(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} id 
         * @param {ClientServicePatchOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServicePatchOAuth2Client(id: string, body: ClientServicePatchOAuth2ClientRequest, options?: any): AxiosPromise<ClientOAuth2Client> {
            return localVarFp.clientServicePatchOAuth2Client(id, body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} id 
         * @param {ClientServiceUpdateOAuth2ClientRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        clientServiceUpdateOAuth2Client(id: string, body: ClientServiceUpdateOAuth2ClientRequest, options?: any): AxiosPromise<ClientOAuth2Client> {
            return localVarFp.clientServiceUpdateOAuth2Client(id, body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for clientServiceCreateOAuth2Client operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceCreateOAuth2ClientRequest
 */
export interface ClientServiceApiClientServiceCreateOAuth2ClientRequest {
    /**
     * 
     * @type {ClientOAuth2Client}
     * @memberof ClientServiceApiClientServiceCreateOAuth2Client
     */
    readonly body: ClientOAuth2Client
}

/**
 * Request parameters for clientServiceDeleteOAuth2Client operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceDeleteOAuth2ClientRequest
 */
export interface ClientServiceApiClientServiceDeleteOAuth2ClientRequest {
    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceDeleteOAuth2Client
     */
    readonly id: string
}

/**
 * Request parameters for clientServiceGetOAuth2Client operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceGetOAuth2ClientRequest
 */
export interface ClientServiceApiClientServiceGetOAuth2ClientRequest {
    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceGetOAuth2Client
     */
    readonly id: string
}

/**
 * Request parameters for clientServiceListOAuth2Clients operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceListOAuth2ClientsRequest
 */
export interface ClientServiceApiClientServiceListOAuth2ClientsRequest {
    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly limit?: string

    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly offset?: string

    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly clientName?: string

    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly owner?: string

    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly afterPageToken?: string

    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients
     */
    readonly beforePageToken?: string
}

/**
 * Request parameters for clientServiceListOAuth2Clients2 operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceListOAuth2Clients2Request
 */
export interface ClientServiceApiClientServiceListOAuth2Clients2Request {
    /**
     * 
     * @type {ClientListClientRequest}
     * @memberof ClientServiceApiClientServiceListOAuth2Clients2
     */
    readonly body: ClientListClientRequest
}

/**
 * Request parameters for clientServicePatchOAuth2Client operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServicePatchOAuth2ClientRequest
 */
export interface ClientServiceApiClientServicePatchOAuth2ClientRequest {
    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServicePatchOAuth2Client
     */
    readonly id: string

    /**
     * 
     * @type {ClientServicePatchOAuth2ClientRequest}
     * @memberof ClientServiceApiClientServicePatchOAuth2Client
     */
    readonly body: ClientServicePatchOAuth2ClientRequest
}

/**
 * Request parameters for clientServiceUpdateOAuth2Client operation in ClientServiceApi.
 * @export
 * @interface ClientServiceApiClientServiceUpdateOAuth2ClientRequest
 */
export interface ClientServiceApiClientServiceUpdateOAuth2ClientRequest {
    /**
     * 
     * @type {string}
     * @memberof ClientServiceApiClientServiceUpdateOAuth2Client
     */
    readonly id: string

    /**
     * 
     * @type {ClientServiceUpdateOAuth2ClientRequest}
     * @memberof ClientServiceApiClientServiceUpdateOAuth2Client
     */
    readonly body: ClientServiceUpdateOAuth2ClientRequest
}

/**
 * ClientServiceApi - object-oriented interface
 * @export
 * @class ClientServiceApi
 * @extends {BaseAPI}
 */
export class ClientServiceApi extends BaseAPI {
    /**
     * 
     * @param {ClientServiceApiClientServiceCreateOAuth2ClientRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceCreateOAuth2Client(requestParameters: ClientServiceApiClientServiceCreateOAuth2ClientRequest, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceCreateOAuth2Client(requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServiceDeleteOAuth2ClientRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceDeleteOAuth2Client(requestParameters: ClientServiceApiClientServiceDeleteOAuth2ClientRequest, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceDeleteOAuth2Client(requestParameters.id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServiceGetOAuth2ClientRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceGetOAuth2Client(requestParameters: ClientServiceApiClientServiceGetOAuth2ClientRequest, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceGetOAuth2Client(requestParameters.id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServiceListOAuth2ClientsRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceListOAuth2Clients(requestParameters: ClientServiceApiClientServiceListOAuth2ClientsRequest = {}, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceListOAuth2Clients(requestParameters.limit, requestParameters.offset, requestParameters.clientName, requestParameters.owner, requestParameters.afterPageToken, requestParameters.beforePageToken, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServiceListOAuth2Clients2Request} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceListOAuth2Clients2(requestParameters: ClientServiceApiClientServiceListOAuth2Clients2Request, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceListOAuth2Clients2(requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServicePatchOAuth2ClientRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServicePatchOAuth2Client(requestParameters: ClientServiceApiClientServicePatchOAuth2ClientRequest, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServicePatchOAuth2Client(requestParameters.id, requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ClientServiceApiClientServiceUpdateOAuth2ClientRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ClientServiceApi
     */
    public clientServiceUpdateOAuth2Client(requestParameters: ClientServiceApiClientServiceUpdateOAuth2ClientRequest, options?: AxiosRequestConfig) {
        return ClientServiceApiFp(this.configuration).clientServiceUpdateOAuth2Client(requestParameters.id, requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }
}
