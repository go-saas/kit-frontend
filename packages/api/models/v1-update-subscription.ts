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
import { V1SubscriptionItemParams } from './v1-subscription-item-params';

/**
 * 
 * @export
 * @interface V1UpdateSubscription
 */
export interface V1UpdateSubscription {
    /**
     * 
     * @type {string}
     * @memberof V1UpdateSubscription
     */
    'id': string;
    /**
     * 
     * @type {Array<V1SubscriptionItemParams>}
     * @memberof V1UpdateSubscription
     */
    'items'?: Array<V1SubscriptionItemParams>;
}

