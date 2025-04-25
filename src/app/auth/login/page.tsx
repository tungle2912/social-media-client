'use client';
import { Form, message } from 'antd';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '~/common/input';
import { LoginValues } from '~/definitions/interfaces/response.interface';
import { rules } from '~/lib/rules';
import AuthButton from '~/modules/auth/button';
import styles from './styles.module.scss';

export default function Login() {
  const [form] = Form.useForm();
  // const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    const result = await signIn('credentials', {
      ...values,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      try {
        // Parse thông tin lỗi từ chuỗi JSON
        const parsedError = JSON.parse(result.error);
        
        // Hiển thị lỗi cho từng trường
        if (parsedError.errors) {
          const errorFields = Object.entries(parsedError.errors).map(([field, error]) => ({
            name: field,
            errors: [(error as any).msg],
          }));
          form.setFields(errorFields);
        }
        
        // Hiển thị thông báo lỗi tổng
        message.error(parsedError.message);
      } catch (e) {
        // Xử lý lỗi parse không thành công
        message.error("An unexpected error occurred");
      }
    } else {
      router.push('/profile');
    }
  };

  // const loginSSO = async (sso: string) => {
  //   setLoading(true);
  //   await signIn(sso, {
  //     redirect: false,
  //   });
  //   setLoading(false);
  // };
  return (
    <div className={styles.loginContainer}>
      <Image
        alt="logo"
        width={200}
        height={100}
        src="https://res.cloudinary.com/dflvvu32c/image/upload/v1745035787/logo_wjj1t5.png"
        className={styles.logo}
      />
      <p className={styles.loginDescription}>Enter your credentials to access your account</p>
      <Form
        className={styles.loginFormContent}
        layout="vertical"
        requiredMark={false}
        name="normal_login"
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
        onFinishFailed={(errorInfo) => {
          console.log('Failed:', errorInfo);
        }}
      >
        <Input name="email" autocomplete="username" label="Email" placeholder="Enter your email" rules={rules.email} />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          rules={rules.password}
        />

        <Link href="/auth/forgot-password" className={styles.forgotPassword}>
          Forgot Password?
        </Link>

        <Form.Item>
          <AuthButton loading={loading}>Log in</AuthButton>
        </Form.Item>
      </Form>
      <span style={{ color: '#6c6c6c' }}>
        Don&lsquo;t have an account? <a onClick={() => router.push('/auth/signup')}>Sign up</a>
      </span>
    </div>
  );
}
