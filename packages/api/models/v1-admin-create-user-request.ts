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


// May contain unused imports in some cases
// @ts-ignore
import { V1Gender } from './v1-gender';

/**
 * 
 * @export
 * @interface V1AdminCreateUserRequest
 */
export interface V1AdminCreateUserRequest {
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'username'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'name'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'phone'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'password'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'confirmPassword'?: string;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'birthday'?: string | null;
    /**
     * 
     * @type {V1Gender}
     * @memberof V1AdminCreateUserRequest
     */
    'gender'?: V1Gender;
    /**
     * 
     * @type {string}
     * @memberof V1AdminCreateUserRequest
     */
    'avatar'?: string;
}


