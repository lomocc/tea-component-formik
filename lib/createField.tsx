import { Form, FormItemProps } from '@tencent/tea-component';
import { useFormikContext } from 'formik';
import React, {
  ComponentType,
  NamedExoticComponent,
  PropsWithRef,
} from 'react';
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
  Component: ComponentType<
    Pick<FieldProps & P, Exclude<keyof P, keyof FieldProps>>
  >,
  fieldToValue?: (value: any) => any,
  valueToField?: (value: any) => any
): NamedExoticComponent<PropsWithRef<FieldProps & P>> {
  return React.memo(
    ({ name, label, required, formItemProps, ...props }: FieldProps & P) => {
      const form = useFormikContext();
      const field = form.getFieldProps(name);
      const meta = form.getFieldMeta(name);
      const helpers = form.getFieldHelpers(name);
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
