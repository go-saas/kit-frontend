/* tslint:disable */
/* eslint-disable */
/**
 * Saas Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


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
    'totalCount'?: number;
}

