/* tslint:disable */
/* eslint-disable */
/**
 * Realtime Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { V1NotificationFilter } from './v1-notification-filter';

/**
 * 
 * @export
 * @interface V1ListNotificationRequest
 */
export interface V1ListNotificationRequest {
    /**
     * 
     * @type {string}
     * @memberof V1ListNotificationRequest
     */
    'afterPageToken'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1ListNotificationRequest
     */
    'beforePageToken'?: string;
    /**
     * 
     * @type {number}
     * @memberof V1ListNotificationRequest
     */
    'pageSize'?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof V1ListNotificationRequest
     */
    'sort'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof V1ListNotificationRequest
     */
    'fields'?: string;
    /**
     * 
     * @type {V1NotificationFilter}
     * @memberof V1ListNotificationRequest
     */
    'filter'?: V1NotificationFilter;
}
