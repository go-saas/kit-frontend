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


// May contain unused imports in some cases
// @ts-ignore
import { V1UserFilter } from './v1-user-filter';

/**
 * 
 * @export
 * @interface V1AdminListUsersRequest
 */
export interface V1AdminListUsersRequest {
    /**
     * 
     * @type {number}
     * @memberof V1AdminListUsersRequest
     */
    'pageOffset'?: number;
    /**
     * 
     * @type {number}
     * @memberof V1AdminListUsersRequest
     */
    'pageSize'?: number;
    /**
     * 
     * @type {string}
     * @memberof V1AdminListUsersRequest
     */
    'search'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof V1AdminListUsersRequest
     */
    'sort'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof V1AdminListUsersRequest
     */
    'fields'?: string;
    /**
     * 
     * @type {V1UserFilter}
     * @memberof V1AdminListUsersRequest
     */
    'filter'?: V1UserFilter;
}

