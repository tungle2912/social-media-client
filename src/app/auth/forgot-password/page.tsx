'use client';
import { SendOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { InputOTP } from 'antd-input-otp';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Input from '~/common/input';
import {
  resetPasswordValues,
  sendOtpForgotPasswordValues,
  verifyOtpForgotPasswordValues,
} from '~/definitions/interfaces/response.interface';
import {
  useResetPasswordMutation,
  useSendOtpForgotPasswordMutation,
  useVerifyOtpForgotPasswordMutation,
} from '~/hooks/data/auth.data';
import AuthButton from '~/modules/auth/button';
import { rules } from '../../../lib/rules';
import styles from './styles.module.scss';

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp_id, setOtp_id] = useState('');
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [buttonResetPasswordEnabled, setButtonResetPasswordEnabled] = useState(true);
  const sendOtpMutation = useSendOtpForgotPasswordMutation();
  const verifyOtpMutation = useVerifyOtpForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const dandleSendOtp = async (values: sendOtpForgotPasswordValues) => {
    form.resetFields(['otp']);
    await sendOtpMutation.mutateAsync(values, {
      onSuccess: (response) => {
        setOtp_id(`${response?.data?.result}`);
        message.success(`${response?.data?.message}`);
        setOtpVisible(true);
      },
      onError: (error: any) => {
        const errorEmailMessage = error.response?.data?.errors?.email?.msg;
        if (errorEmailMessage) {
          form.setFields([
            {
              name: 'email',
              errors: [errorEmailMessage],
            },
          ]);
        }
      },
    });
  };

  const handleVerifyOtp = async (values: verifyOtpForgotPasswordValues) => {
    await verifyOtpMutation.mutateAsync(values, {
      onSuccess: (response) => {
        message.success(response?.data?.message || 'OTP verified successfully.');
        setResetPasswordVisible(true);
        setOtpVisible(false);
        setButtonResetPasswordEnabled(false);
      },
      onError: (error: any) => {
        const errorOtpMessage = error.response?.data?.errors?.otp?.msg;
        if (errorOtpMessage) {
          form.setFields([
            {
              name: 'otp',
              errors: [errorOtpMessage],
            },
          ]);
        }
      },
    });
  };

  const handleResetPassword = async (values: resetPasswordValues) => {
    values.otp_id = otp_id;
    await resetPasswordMutation.mutateAsync(values, {
      onSuccess: (response) => {
        message.success(response?.data?.message || 'Password reset successful.');
        router.push('/auth/login');
      },
      // onError: (error: any) => {
      //   message.error(error.response?.data?.errors?.message || 'Failed to reset password. Please try again.')
      // }
    });
  };
  const senOtp = () => {
    form.validateFields(['email']).then((values) => {
      dandleSendOtp(values);
    });
  };
  const verifyOtp = () => {
    const otpArr = form.getFieldValue('otp');
    const otp = otpArr.join('');
    const values: verifyOtpForgotPasswordValues = {
      otp: otp,
      otp_id: otp_id,
    };
    handleVerifyOtp(values);
  };

  return (
    <div className={styles.forGotPasswordContainer}>
      <div className={styles.forgotPasswordForm}>
        <div className={styles.forgotPasswordFormHeader}>
          <Image
            alt="logo"
            width={200}
            height={100}
            src="https://res.cloudinary.com/dflvvu32c/image/upload/v1745035787/logo_wjj1t5.png"
            className={styles.logo}
          />
          <h3 className={styles.forgotPasswordTittle}>FORGOT PASSWORD</h3>
        </div>
        <Form
          layout="vertical"
          requiredMark={false}
          className={styles.forgotPasswordFormContent}
          name="normal_login"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={handleResetPassword}
          onFinishFailed={onFinishFailed}
        >
          <div className={styles.inputEmail}>
            <Input name="email" label="Email" placeholder="Enter your email" rules={rules.email} />
            <Button
              onClick={senOtp}
              loading={sendOtpMutation.isPending}
              className={styles.buttonSendOtp}
              icon={<SendOutlined />}
            />
          </div>
          {otpVisible && (
            <Form.Item name="otp">
              <InputOTP inputType="numeric-symbol" autoSubmit={verifyOtp} size="large" />
            </Form.Item>
          )}
          {resetPasswordVisible && (
            <div style={{ width: '100%' }}>
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                rules={rules.password}
              />
              <Input
                type="password"
                name="confirm_password"
                label="Confirm Password"
                placeholder="Confirm your password"
                rules={rules.confirm_password}
              />
            </div>
          )}
          <div className={styles.buttonResetPassword}>
            <Form.Item>
              <AuthButton loading={resetPasswordMutation.isPending} disabled={buttonResetPasswordEnabled}>
                Reset Password
              </AuthButton>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
