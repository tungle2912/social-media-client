'use client';
import { Form, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Input from '~/common/input';
import { RegisterValues } from '~/definitions/interfaces/response.interface';
import { useRegisterMutation } from '~/hooks/data/auth.data';
import { rules } from '~/lib/rules';
import AuthButton from '~/modules/auth/button';
import styles from './styles.module.scss';

export default function Signup() {
  const [form] = Form.useForm();
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const { mutateAsync: registerMutateAsync, isPending } = registerMutation;
  const handleError = (errors: any) => {
    const errorFields = Object.entries(errors).map(([field, error]) => ({
      name: field,
      errors: [(error as { msg: string }).msg],
    }));
    form.setFields(errorFields);
  };
  const onSubmit = async (values: RegisterValues) => {
    await registerMutateAsync(values, {
      onSuccess(data: any) {
        message.success(data?.data?.message, 5);
        router.push('/auth/login');
      },
      onError(error: any) {
        handleError(error?.data?.errors);
      },
    });
  };

  return (
    <div className={styles.loginContainer}>
      <Image
        alt="logo"
        width={200}
        height={100}
        src="https://res.cloudinary.com/dflvvu32c/image/upload/v1745035787/logo_wjj1t5.png"
        className={styles.logo}
      />
      <h2 className={styles.loginTittle}>Sign In</h2>
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
        <Input
          type="password"
          name="confirm_password"
          label="Confirm Password"
          placeholder="Confirm your password"
          rules={rules.confirm_password}
        />

        <Form.Item>
          <AuthButton loading={isPending}>Continue</AuthButton>
        </Form.Item>
      </Form>
      <span style={{ color: '#6c6c6c' }}>
        Have an account? <a onClick={() => router.push('/auth/login')}>Log in</a>
      </span>
    </div>
  );
}
