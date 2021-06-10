import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, {
  ComponentProps,
  ComponentType,
  ElementType,
  useCallback,
  useState,
} from 'react';
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
  /** Tells Formik to validate the form on each input's onChange event */
  validateOnChange?: boolean;
  /** Tells Formik to validate the form on each input's onBlur event */
  validateOnBlur?: boolean;
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
      validateOnChange,
      validateOnBlur,
      // @ts-ignore
      onBlur,
      // @ts-ignore
      onChange,
      ...props
    }: FieldPropsOmitInputProps<P, T>) => {
      const form = useFormikContext();
      const field = form.getFieldProps(name);
      const meta = form.getFieldMeta(name);
      const helpers = form.getFieldHelpers(name);
      const Component: ElementType = component;
      validateOnChange = validateOnChange ?? form.validateOnChange;
      validateOnBlur = validateOnBlur ?? form.validateOnBlur;
      const [invalidateValueFlag, setInvalidateValueFlag] = useState(true);
      const internalOnBlur = useCallback(
        async (...args: any[]) => {
          setInvalidateValueFlag(false);
          await helpers.setTouched(true, invalidateValueFlag && validateOnBlur);
          onBlur?.(...args);
        },
        [
          onBlur,
          helpers,
          setInvalidateValueFlag,
          invalidateValueFlag,
          validateOnBlur,
        ]
      );
      const internalOnChange = useCallback(
        async (value: any, ...args: any[]) => {
          setInvalidateValueFlag(true);
          if (!meta.touched) {
            helpers.setTouched(true, false);
          }
          await helpers.setValue(value, validateOnChange);
          onChange?.(value, ...args);
        },
        [onChange, helpers, setInvalidateValueFlag, validateOnChange]
      );

      const children = (
        <Component
          {...props}
          value={field.value}
          onBlur={internalOnBlur}
          onChange={internalOnChange}
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
