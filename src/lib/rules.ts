import { Rule } from 'antd/es/form';

export const rules: Record<
  'email' | 'password' | 'confirm_password' | 'first_name' | 'last_name' | 'date_of_birth' | 'user_name',
  Rule[]
> = {
  email: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your Email!',
    },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'The input is not valid E-mail!',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please input your Password!',
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/,
      message: 'Password must be minimum 8 characters, at least one letter and one number!',
    },
  ],
  confirm_password: [
    {
      required: true,
      message: 'Please confirm your password!',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords that you entered do not match!'));
      },
    }),
  ],
  first_name: [
    {
      required: true,
      whitespace: true,
      message: 'First name is required',
    },
    {
      min: 2,
      message: 'Minimum 2 characters',
    },
    {
      max: 50,
      message: 'Maximum 50 characters',
    },
  ],
  last_name: [
    {
      required: true,
      whitespace: true,
      message: 'Last name is required',
    },
    {
      min: 2,
      message: 'Minimum 2 characters',
    },
    {
      max: 50,
      message: 'Maximum 50 characters',
    },
  ],
  user_name: [
    {
      required: true,
      whitespace: true,
      message: 'Username is required',
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Only letters, numbers and underscores',
    },
    {
      min: 3,
      message: 'Minimum 3 characters',
    },
    {
      max: 20,
      message: 'Maximum 20 characters',
    },
  ],
  date_of_birth: [
    {
      required: true,
      message: 'Date of birth is required',
    },
    () => ({
      validator(_, value) {
        if (!value || value < new Date()) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Invalid date of birth'));
      },
    }),
  ],
};
