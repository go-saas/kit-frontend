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



/**
 * 
 * @export
 * @interface V1GrantConsentRequest
 */
export interface V1GrantConsentRequest {
    /**
     * 
     * @type {string}
     * @memberof V1GrantConsentRequest
     */
    'challenge'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof V1GrantConsentRequest
     */
    'grantScope'?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof V1GrantConsentRequest
     */
    'reject'?: boolean;
}

