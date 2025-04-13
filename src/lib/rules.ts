import { Rule } from 'antd/es/form'

export const rules: Record<
  'email' | 'password' | 'confirm_password' | 'name' | 'phone' | 'date_of_admission' | 'enroll_number',
  Rule[]
> = {
  email: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your Email!'
    },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'The input is not valid E-mail!'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input your Password!'
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/,
      message: 'Password must be minimum 8 characters, at least one letter and one number!'
    }
  ],
  confirm_password: [
    {
      required: true,
      message: 'Please confirm your password!'
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('The two passwords that you entered do not match!'))
      }
    })
  ],
  name: [
    {
      required: true,
      whitespace: true,
      message: 'Name is required'
    }
  ],
  phone: [
    {
      required: true,
      whitespace: true,
      message: 'Phone number is required'
    },
    {
      pattern: /^0[3|5|7|8|9]+[0-9]{8}$/,
      message: 'Phone number is invalid'
    }
  ],
  date_of_admission: [
    {
      required: true,
      whitespace: true,
      message: 'Date of admission is required'
    }
  ],
  enroll_number: [
    {
      required: true,
      whitespace: true,
      message: 'Enroll number is required'
    }
  ]
}
