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
import { ClientOAuth2Client } from './client-oauth2-client';

/**
 * 
 * @export
 * @interface ClientOAuth2ClientList
 */
export interface ClientOAuth2ClientList {
    /**
     * 
     * @type {Array<ClientOAuth2Client>}
     * @memberof ClientOAuth2ClientList
     */
    'items'?: Array<ClientOAuth2Client>;
    /**
     * 
     * @type {number}
     * @memberof ClientOAuth2ClientList
     */
    'totalSize'?: number;
    /**
     * 
     * @type {string}
     * @memberof ClientOAuth2ClientList
     */
    'nextAfterPageToken'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ClientOAuth2ClientList
     */
    'nextBeforePageToken'?: string | null;
}

