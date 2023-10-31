import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormText,
  DrawerForm,
  ProFormSwitch,
  ProFormDateTimePicker,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1CreateProductRequest, V1UpdateProduct } from '@gosaas/api';
import { ProductServiceApi } from '@gosaas/api';
import { dateUtil, uploadApi } from '@gosaas/core';
import { uploadConvertValue, uploadTransformSingle } from '@gosaas/core';
import { getRequestInstance } from '@@/plugin-request/request';
import PriceForm from '../../Price/PriceForm';

const service = new ProductServiceApi();

export type FormValueType = V1CreateProductRequest & V1UpdateProduct;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    //fetch role detail
    if (props.values?.id && props.updateModalVisible) {
      service.productServiceGetProduct({ id: props.values?.id }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      open={props.updateModalVisible}
      onFinish={async (formData) => {
        const { saleableFrom, saleableTo, ...data } = formData;
        const ret = {
          id: props.values?.id,
          saleableFrom: saleableFrom ? dateUtil(saleableFrom).toISOString() : undefined,
          saleableTo: saleableTo ? dateUtil(saleableTo).toISOString() : undefined,
          ...data,
        };
        await props.onSubmit(ret);
      }}
      drawerProps={{
        onClose: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="title"
        label={intl.formatMessage({
          id: 'saas.product.title',
          defaultMessage: 'Product Title',
        })}
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormUploadButton
        name="mainPic"
        max={1}
        label={intl.formatMessage({
          id: 'saas.product.mainPic',
          defaultMessage: 'Main Picture',
        })}
        transform={uploadTransformSingle}
        convertValue={uploadConvertValue}
        fieldProps={{
          customRequest: (opt) => {
            const { onProgress, onError, onSuccess, file, filename } = opt;
            uploadApi(
              '/v1/product/media',
              {
                file: file as any,
                filename: filename,
              },
              onProgress,
              getRequestInstance,
            )
              .then((e) => {
                onSuccess?.(e.data);
              })
              .catch((e: any) => {
                onError?.(e);
              });
          },
        }}
      />
      <ProFormText
        name="shortDesc"
        label={intl.formatMessage({
          id: 'saas.product.shortDesc',
          defaultMessage: 'Product Short Desc',
        })}
      />
      {!props.values.id && (
        <ProFormSwitch
          name="multiSku"
          label={intl.formatMessage({
            id: 'saas.product.multiSku',
            defaultMessage: 'Multi Sku',
          })}
        />
      )}
      <ProFormSwitch
        name="isNew"
        label={intl.formatMessage({
          id: 'saas.product.isNew',
          defaultMessage: 'New Tag',
        })}
      />
      <ProFormSwitch
        name="needShipping"
        label={intl.formatMessage({
          id: 'saas.product.needShipping',
          defaultMessage: 'Shipping',
        })}
      />
      <ProFormDateTimePicker
        name="saleableFrom"
        label={intl.formatMessage({
          id: 'saas.product.saleableFrom',
          defaultMessage: 'Saleable From',
        })}
      />
      <ProFormDateTimePicker
        name="saleableTo"
        label={intl.formatMessage({
          id: 'saas.product.saleableTo',
          defaultMessage: 'Saleable To',
        })}
      />
      <ProFormSwitch
        name="active"
        label={intl.formatMessage({
          id: 'saas.product.active',
          defaultMessage: 'Active',
        })}
      />
      <PriceForm />
    </DrawerForm>
  );
};

export default UpdateForm;
