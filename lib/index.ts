import {
  Cascader as Cascader_,
  Checkbox as Checkbox_,
  DatePicker as DatePicker_,
  Input as Input_,
  InputNumber as InputNumber_,
  Radio as Radio_,
  Segment as Segment_,
  Select as Select_,
  Switch as Switch_,
  TimePicker as TimePicker_,
} from '@tencent/tea-component';
import moment from 'moment';
import * as Yup from 'yup';
import createField from './createField';

export { Yup, createField };

export const Select = createField(Select_);
export const DatePicker = createField(DatePicker_);
export const MonthPicker = createField(DatePicker_.MonthPicker);
export const RangePicker = createField(
  DatePicker_.RangePicker,
  (v) => v?.map((v) => moment(v)),
  (v) => v?.filter(Boolean).map((v) => v.valueOf())
);
export const TimePicker = createField(TimePicker_);
export const TimeRangePicker = createField(
  TimePicker_.RangePicker,
  (v) => v?.map((v) => moment(v)),
  (v) => v?.filter(Boolean).map((v) => v.format('HH:mm:ss'))
);
export const Input = createField(Input_);
export const InputNumber = createField(InputNumber_);
export const RadioGroup = createField(Radio_.Group);
export const Cascader = createField(Cascader_);
export const Checkbox = createField(Checkbox_);
export const CheckboxGroup = createField(Checkbox_.Group);
export const Switch = createField(Switch_);
export const Segment = createField(Segment_);
