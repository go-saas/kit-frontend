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
import { V1Price } from './v1-price';

/**
 * 
 * @export
 * @interface V1Plan
 */
export interface V1Plan {
    /**
     * 
     * @type {string}
     * @memberof V1Plan
     */
    'key': string;
    /**
     * 
     * @type {string}
     * @memberof V1Plan
     */
    'displayName': string;
    /**
     * 
     * @type {boolean}
     * @memberof V1Plan
     */
    'active'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof V1Plan
     */
    'productId'?: string;
    /**
     * 
     * @type {Array<V1Price>}
     * @memberof V1Plan
     */
    'prices'?: Array<V1Price>;
}

