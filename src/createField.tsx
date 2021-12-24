import { useFormikContext } from 'formik';
import React, {
  ComponentProps,
  ComponentType,
  ElementType,
  useCallback,
  useState
} from 'react';
import isEqual from 'react-fast-compare';
import { Form, FormItemProps } from 'tea-component';
import getStatusProps from './getStatusProps';

export interface FieldProps<T extends ElementType, F extends ElementType> {
  /**
   * Field name
   */
  name: string;
  /**
   * Form.Item label
   */
  label?: any extends ComponentProps<F>
    ? never
    : ComponentProps<F> extends { label?: infer R }
    ? R
    : never;
  /**
   * Form.Item required
   */
  required?: any extends ComponentProps<F>
    ? never
    : ComponentProps<F> extends { required?: infer R }
    ? R
    : never;
  /**
   * Form.Item formItem
   */
  formItem?: F | null;
  /**
   * Form.Item props
   */
  formItemProps?: any extends ComponentProps<F>
    ? never
    : Omit<ComponentProps<F>, 'label' | 'required'>;
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
export type FieldPropsOmitInputProps<
  P,
  T extends ElementType,
  F extends ElementType
> = DistributiveOmit<P, 'value' | 'onChange'> &
  Partial<Pick<P, Extract<keyof P, 'onChange'>>> &
  FieldProps<T, F>;

const memo: <T extends ElementType>(
  Component: T,
  areEqual?: (
    prevProps: React.ComponentProps<T>,
    nextProps: React.ComponentProps<T>
  ) => boolean
) => T = React.memo;

export default function createField<P>(component: ComponentType<P>) {
  return memo(
    <
      T extends ElementType,
      F extends ElementType = ComponentType<FormItemProps>
    >({
      name,
      label,
      required,
      formItem: FormItem,
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
    }: FieldPropsOmitInputProps<P, T, F>) => {
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
        [
          meta.touched,
          onChange,
          helpers,
          setInvalidateValueFlag,
          validateOnChange,
        ]
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

      if (FormItem === void 0) {
        // @ts-ignore
        FormItem = Form.Item;
      }
      if (FormItem) {
        return (
          // @ts-ignore
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
    },
    isEqual
  );
}
