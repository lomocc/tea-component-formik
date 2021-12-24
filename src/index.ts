import {
  Checkbox as Checkbox_,
  DatePicker as DatePicker_,
  Input as Input_,
  InputNumber as InputNumber_,
  Radio as Radio_,
  Segment as Segment_,
  Select as Select_,
  SelectMultiple as SelectMultiple_,
  Switch as Switch_,
  TimePicker as TimePicker_
} from 'tea-component';
import * as Yup from 'yup';
import createField from './createField';

export { Yup, createField };

export const Select = createField(Select_);
export const SelectMultiple = createField(SelectMultiple_);
export const DatePicker = createField(DatePicker_);
export const MonthPicker = createField(DatePicker_.MonthPicker);
export const RangePicker = createField(DatePicker_.RangePicker);
export const TimePicker = createField(TimePicker_);
export const TimeRangePicker = createField(TimePicker_.RangePicker);
export const Input = createField(Input_);
export const InputNumber = createField(InputNumber_);
export const Password = createField(Input_.Password);
export const RadioGroup = createField(Radio_.Group);

// Cascader 组件 Typescript 支持有点问题，建议自定义
// export const Cascader = createField(Cascader_);
export const Checkbox = createField(Checkbox_);
export const CheckboxGroup = createField(Checkbox_.Group);
export const Switch = createField(Switch_);
export const Segment = createField(Segment_);
