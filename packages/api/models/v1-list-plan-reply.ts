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
import { V1Plan } from './v1-plan';

/**
 * 
 * @export
 * @interface V1ListPlanReply
 */
export interface V1ListPlanReply {
    /**
     * 
     * @type {number}
     * @memberof V1ListPlanReply
     */
    'totalSize'?: number;
    /**
     * 
     * @type {number}
     * @memberof V1ListPlanReply
     */
    'filterSize'?: number;
    /**
     * 
     * @type {Array<V1Plan>}
     * @memberof V1ListPlanReply
     */
    'items'?: Array<V1Plan>;
}

