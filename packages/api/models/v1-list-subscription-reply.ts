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
import { Subscriptionv1Subscription } from './subscriptionv1-subscription';

/**
 * 
 * @export
 * @interface V1ListSubscriptionReply
 */
export interface V1ListSubscriptionReply {
    /**
     * 
     * @type {number}
     * @memberof V1ListSubscriptionReply
     */
    'totalSize'?: number;
    /**
     * 
     * @type {number}
     * @memberof V1ListSubscriptionReply
     */
    'filterSize'?: number;
    /**
     * 
     * @type {Array<Subscriptionv1Subscription>}
     * @memberof V1ListSubscriptionReply
     */
    'items'?: Array<Subscriptionv1Subscription>;
}

