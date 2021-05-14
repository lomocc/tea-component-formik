import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, { ComponentProps, ComponentType, ElementType } from 'react';
import getStatusProps from './getStatusProps';

export interface FieldProps<T extends ElementType> {
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
  container?: T;
  /**
   * 外层容器属性
   */
  containerProps?: ComponentProps<T>;
}

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * 排除 value onChange 属性
 */
export type FieldPropsOmitInputProps<P, T> = DistributiveOmit<
  P,
  'value' | 'onChange'
> &
  Partial<Pick<P, Extract<keyof P, 'onChange'>>> &
  (T extends ElementType ? FieldProps<T> : never);

const memo: <T extends ElementType>(
  Component: T,
  areEqual?: (
    prevProps: React.ComponentProps<T>,
    nextProps: React.ComponentProps<T>
  ) => boolean
) => T = React.memo;

export default function createField<P>(component: ComponentType<P>) {
  return memo(
    <T extends ElementType>({
      name,
      label,
      required,
      formItem: FormItem = Form.Item,
      formItemProps,
      container,
      containerProps,
      // @ts-ignore
      onChange,
      ...props
    }: FieldPropsOmitInputProps<P, T>) => {
      const form = useFormikContext();
      const field = form.getFieldProps(name);
      const meta = form.getFieldMeta(name);
      const helpers = form.getFieldHelpers(name);
      const Component: ElementType = component;

      const children = (
        <Component
          {...props}
          value={field.value}
          onChange={(value: any, ...args: any[]) => {
            if (!meta.touched) {
              helpers.setTouched(true);
            }
            helpers.setValue(value);
            onChange?.(value, ...args);
          }}
        />
      );
      const element = container
        ? React.createElement(container, containerProps, children)
        : children;
      if (FormItem) {
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
