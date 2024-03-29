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
import { V1Badge } from './v1-badge';
// May contain unused imports in some cases
// @ts-ignore
import { V1CampaignRule } from './v1-campaign-rule';
// May contain unused imports in some cases
// @ts-ignore
import { V1Keyword } from './v1-keyword';
// May contain unused imports in some cases
// @ts-ignore
import { V1PriceParams } from './v1-price-params';
// May contain unused imports in some cases
// @ts-ignore
import { V1ProductAttribute } from './v1-product-attribute';
// May contain unused imports in some cases
// @ts-ignore
import { V1ProductMedia } from './v1-product-media';
// May contain unused imports in some cases
// @ts-ignore
import { V1Stock } from './v1-stock';

/**
 * 
 * @export
 * @interface ProductServiceUpdateProductRequestProduct
 */
export interface ProductServiceUpdateProductRequestProduct {
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'version'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'title'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'shortDesc'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'desc'?: string;
    /**
     * 
     * @type {V1ProductMedia}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'mainPic'?: V1ProductMedia;
    /**
     * 
     * @type {Array<V1ProductMedia>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'medias'?: Array<V1ProductMedia>;
    /**
     * 
     * @type {Array<V1Badge>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'badges'?: Array<V1Badge>;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'visibleFrom'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'visibleTo'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'isNew'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'mainCategoryKey'?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'categoryKeys'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'barcode'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'model'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'brandId'?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'isSaleable'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'saleableFrom'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'saleableTo'?: string;
    /**
     * 
     * @type {Array<V1Keyword>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'keywords'?: Array<V1Keyword>;
    /**
     * 
     * @type {Array<V1PriceParams>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'prices'?: Array<V1PriceParams>;
    /**
     * 
     * @type {boolean}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'isGiveaway'?: boolean;
    /**
     * 
     * @type {Array<V1ProductAttribute>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'attributes'?: Array<V1ProductAttribute>;
    /**
     * 
     * @type {Array<V1CampaignRule>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'campaignRules'?: Array<V1CampaignRule>;
    /**
     * 
     * @type {boolean}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'needShipping'?: boolean;
    /**
     * 
     * @type {Array<V1Stock>}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'stocks'?: Array<V1Stock>;
    /**
     * 
     * @type {object}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'content'?: object;
    /**
     * 
     * @type {boolean}
     * @memberof ProductServiceUpdateProductRequestProduct
     */
    'active'?: boolean;
}

