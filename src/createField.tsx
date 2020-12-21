import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import getStatusProps from './getStatusProps';

export interface FieldProps {
  /** Field name */
  name: string;
  /** Form.Item label */
  label?: FormItemProps['label'];
  /** Form.Item required */
  required?: boolean;
  /** Form.Item formItem */
  formItem?: boolean;
  /** Form.Item props */
  formItemProps?: FormItemProps;
}

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * 排除 value onChange 属性
 */
export type FieldPropsOmitInputProps<T> = FieldProps &
  DistributiveOmit<T, 'value' | 'onChange'>;

export default function createField<P>(component: ComponentType<P>) {
  return React.memo(
    ({
      name,
      label,
      required,
      formItem = true,
      formItemProps,
      ...props
    }: FieldPropsOmitInputProps<P>) => {
      const form = useFormikContext();
      const field = form.getFieldProps(name);
      const meta = form.getFieldMeta(name);
      const helpers = form.getFieldHelpers(name);
      const Component: any = component;

      const children = (
        <Component
          // {...field}
          {...props}
          value={field.value}
          onChange={(value: any) => {
            if (!meta.touched) {
              helpers.setTouched(true);
            }
            helpers.setValue(value);
          }}
        />
      );
      return formItem ? (
        <Form.Item
          label={label}
          required={!!required}
          {...getStatusProps(meta, form.isValidating)}
          {...formItemProps}
        >
          {children}
        </Form.Item>
      ) : (
        children
      );
    }
  );
}
