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


import { Permissionv1PermissionDefGroup } from './permissionv1-permission-def-group';
import { V1Permission } from './v1-permission';

/**
 * 
 * @export
 * @interface V1GetRolePermissionResponse
 */
export interface V1GetRolePermissionResponse {
    /**
     * 
     * @type {Array<V1Permission>}
     * @memberof V1GetRolePermissionResponse
     */
    'acl'?: Array<V1Permission>;
    /**
     * 
     * @type {Array<Permissionv1PermissionDefGroup>}
     * @memberof V1GetRolePermissionResponse
     */
    'defGroups'?: Array<Permissionv1PermissionDefGroup>;
}

