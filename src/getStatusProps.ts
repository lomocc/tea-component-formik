import { FieldMetaProps } from 'formik';
import { FormControlProps } from 'tea-component';

/**
 *  根据 表单 meta 和 isValidating 返回 Form.Item 的 status 和 message
 * @param meta
 * @param isValidating
 */
export default function getStatusProps(
  meta: FieldMetaProps<any>,
  isValidating: boolean
) {
  const status = getStatus(meta, isValidating);
  return {
    status,
    message: status === 'error' && meta.error,
  };
}

/**
 *  根据 表单 meta 和 isValidating 返回  status
 * @param meta
 * @param isValidating
 */
export function getStatus(meta: FieldMetaProps<any>, isValidating: boolean) {
  if (isValidating) {
    return 'validating' as FormControlProps['status'];
  }
  if (!meta.touched) {
    return (null as any) as FormControlProps['status'];
  }
  return (typeof meta.error === 'string'
    ? 'error'
    : 'success') as FormControlProps['status'];
}
