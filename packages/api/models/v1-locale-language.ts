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


import { V1LocaleMessage } from './v1-locale-message';

/**
 * 
 * @export
 * @interface V1LocaleLanguage
 */
export interface V1LocaleLanguage {
    /**
     * 
     * @type {string}
     * @memberof V1LocaleLanguage
     */
    'name'?: string;
    /**
     * 
     * @type {Array<V1LocaleMessage>}
     * @memberof V1LocaleLanguage
     */
    'msg'?: Array<V1LocaleMessage>;
}

