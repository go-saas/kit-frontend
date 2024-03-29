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
import { StripeEphemeralKey } from './stripe-ephemeral-key';
// May contain unused imports in some cases
// @ts-ignore
import { StripePaymentIntent } from './stripe-payment-intent';

/**
 * 
 * @export
 * @interface V1OrderPaymentStripeInfo
 */
export interface V1OrderPaymentStripeInfo {
    /**
     * 
     * @type {StripePaymentIntent}
     * @memberof V1OrderPaymentStripeInfo
     */
    'paymentIntent'?: StripePaymentIntent;
    /**
     * 
     * @type {StripeEphemeralKey}
     * @memberof V1OrderPaymentStripeInfo
     */
    'ephemeralKey'?: StripeEphemeralKey;
}

