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
import { LbsAddress } from './lbs-address';

/**
 * 
 * @export
 * @interface V1UpdateAddress
 */
export interface V1UpdateAddress {
    /**
     * 
     * @type {string}
     * @memberof V1UpdateAddress
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof V1UpdateAddress
     */
    'phone'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1UpdateAddress
     */
    'usage'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof V1UpdateAddress
     */
    'prefer'?: boolean;
    /**
     * 
     * @type {LbsAddress}
     * @memberof V1UpdateAddress
     */
    'address': LbsAddress;
    /**
     * 
     * @type {object}
     * @memberof V1UpdateAddress
     */
    'metadata'?: object;
}

