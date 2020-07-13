import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import getStatusProps from './getStatusProps';

export interface FieldProps {
  /** name */
  name: string;
  /** Form.Item label */
  label?: FormItemProps['label'];
  /** Form.Item required */
  required?: boolean;
  /** Form.Item props */
  formItemProps?: Exclude<FormItemProps, 'label' | 'required'>;
}

export default function createField<P>(
  component: ComponentType<P>,
  fieldToValue?: (value: any) => any,
  valueToField?: (value: any) => any
) {
  return React.memo(
    ({
      name,
      label,
      required,
      formItemProps,
      ...props
    }: FieldProps & Exclude<P, 'value' | 'onChange'>) => {
      const form = useFormikContext();
      const field = form.getFieldProps(name);
      const meta = form.getFieldMeta(name);
      const helpers = form.getFieldHelpers(name);
      const Component: any = component;
      return (
        <Form.Item
          label={label}
          required={!!required}
          {...getStatusProps(meta, form.isValidating)}
          {...formItemProps}
        >
          <Component
            // {...field}
            {...props}
            value={fieldToValue ? fieldToValue(field.value) : field.value}
            onChange={(value) => {
              if (!meta.touched) {
                helpers.setTouched(true);
              }
              helpers.setValue(valueToField ? valueToField(value) : value);
            }}
          />
        </Form.Item>
      );
    }
  );
}
