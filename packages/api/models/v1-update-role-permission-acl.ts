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


import { V1Effect } from './v1-effect';

/**
 * 
 * @export
 * @interface V1UpdateRolePermissionAcl
 */
export interface V1UpdateRolePermissionAcl {
    /**
     * 
     * @type {string}
     * @memberof V1UpdateRolePermissionAcl
     */
    'namespace'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1UpdateRolePermissionAcl
     */
    'resource'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1UpdateRolePermissionAcl
     */
    'action'?: string;
    /**
     * 
     * @type {V1Effect}
     * @memberof V1UpdateRolePermissionAcl
     */
    'effect'?: V1Effect;
}

