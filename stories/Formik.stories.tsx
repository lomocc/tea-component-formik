import { Meta, Story } from '@storybook/react';
import { Button, Form, InputAdornment, Radio } from '@tencent/tea-component';
import '@tencent/tea-component/lib/tea.css';
import { Formik } from 'formik';
import React from 'react';
import { Input, RadioGroup, Select, Yup } from '..';

const meta: Meta = {
  title: 'Input',
  component: Input,
};

export default meta;

const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required('请输入')
    .max(10, '最多10个字符')
    .min(3, '最少3个字符'),
  password: Yup.string()
    .trim()
    .required('请输入')
    .max(10, '最多10个字符')
    .min(6, '最少6个字符'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    '密码必须一致'
  ),
});

const options = [
  {
    value: 'name',
    text: '产品名称',
  },
  {
    value: 'id',
    text: '产品ID',
  },
];

const Template: Story = args => (
  <Formik
    initialValues={{
      username: '',
      url: '',
      password: '',
      passwordConfirmation: '',
      sex: '',
    }}
    validationSchema={validationSchema}
    onSubmit={values => {
      alert(JSON.stringify(values));
      console.log('onSubmit', values);
    }}
    validate={values => {
      console.log('====================================');
      console.log('validate', values);
      console.log('====================================');
    }}
  >
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Form>
          <Input
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            validateOnChange={false}
          />
          <Input
            name="url"
            label="网站"
            placeholder="请输入域名"
            container={InputAdornment}
            containerProps={{ before: 'https://', after: '.com' }}
            onChange={value => {
              console.log('====================================');
              console.log('onChange', value);
              console.log('====================================');
            }}
          />
          <RadioGroup
            name="sex"
            onChange={value => {
              console.log('====================================');
              console.log('onChange', value);
              console.log('====================================');
            }}
          >
            <Radio name="male">男性</Radio>
            <Radio name="female">女性</Radio>
          </RadioGroup>
          <Input name="password" label="密码" placeholder="请输入密码" />
          <Input
            name="passwordConfirmation"
            label="密码确认"
            placeholder="请再次输入密码"
          />
          <Select
            name="searchKey"
            label="searchKey"
            options={options}
            type="simulate"
            appearance="button"
          />
          <Button htmlType="submit" type="primary">
            提交
          </Button>
        </Form>
      </form>
    )}
  </Formik>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
