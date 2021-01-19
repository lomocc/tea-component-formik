import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import getStatusProps from './getStatusProps';

export interface FieldProps {
  /**
   * Field name
   */
  name: string;
  /**
   * Form.Item label
   */
  label?: FormItemProps['label'];
  /**
   * Form.Item required
   */
  required?: boolean;
  /**
   * Form.Item formItem
   */
  formItem?: ComponentType<FormItemProps> | false;
  /**
   * Form.Item props
   */
  formItemProps?: FormItemProps;
  /**
   * 外层容器，如：InputAdornment
   */
  container?: ComponentType;
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
      formItem = Form.Item,
      formItemProps,
      container,
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
      const element = container
        ? React.createElement(container, null, children)
        : children;
      if (formItem) {
        const FormItem = formItem;
        return (
          <FormItem
            label={label}
            required={!!required}
            {...getStatusProps(meta, form.isValidating)}
            {...formItemProps}
          >
            {element}
          </FormItem>
        );
      } else {
        return element;
      }
    }
  );
}
