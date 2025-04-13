'use client';
import image from '@/static/image';
import { Button, Form, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Input from '~/components/elms/Inputs/LoginInput';
import { rules } from '~/lib/rules';
import styles from './styles.module.scss';
import { LoginValues } from '~/constants/enums';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [form] = Form.useForm();
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    const response = await signIn('credentials', {
      ...values,
      redirect: false,
    });
    setLoading(false);
    if (response?.ok) {
      router.push('/dashboard');
    }
  };
  const loginSSO = async (sso: string) => {
    setLoading(true);
    await signIn(sso, {
      redirect: false,
    });
    setLoading(false);
  };
  return (
    <div className={styles.loginContainer}>
      {loading && (
        <div className={styles.spinnerOverlay}>
          <Spin size="large" />
        </div>
      )}
      <div className={styles.recentLogins}>
        <Image className={styles.loginLogo} alt="logo" src={image.logo} width={200} height={110}></Image>
        <h2 className={styles.recentLoginsTittle}>{t('recentLogin')}</h2>
        <p className={styles.recentLoginsDes}>{t('clickYourPicture')}</p>
        <div className={styles.loginOptions}>
          <div className={styles.loginOption}>
            <Image
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148262/goftpolyqmy08gmpwmdn.jpg"
              alt="Linh Chi"
              width={80}
              height={80}
              className={styles.userImage}
            />
            <span>Tùng lê</span>
          </div>
          <div className={styles.loginOption}>
            <Image
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724208002/v9abgrbgsnnfex04kfbe.jpg"
              alt="Tùng lê"
              width={80}
              height={80}
              className={styles.userImage}
            />
            <span>Tùng lê</span>
          </div>
          <div className={styles.loginOption}>
            <Image
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148806/hoxzt0qs76xnogsnnqpx.jpg"
              alt="Linh Chi"
              width={80}
              height={80}
              className={styles.userImage}
            />
            <span>Tùng lê</span>
          </div>
          <div className={styles.loginOption}>
            <Image
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148251/dhtiiea1mtxkszszckkf.jpg"
              alt="Linh Chi"
              width={80}
              height={80}
              className={styles.userImage}
            />
            <span>Tùng lê</span>
          </div>
          <div className={styles.addAccount}>
            <div className={styles.addAccountIcon}>+</div>
            <span>{t('addAccount')}</span>
          </div>
        </div>
      </div>
      <div className={styles.formLogin}>
        <h1 className={styles.formLoginTittle}>{t('login')}</h1>
        <Form form={form} requiredMark={false} onFinish={onSubmit} layout="vertical">
          <Input name="email" rules={rules.email} label="Email" placeholder={t('enterYourEmail')} />
          <Input
            name="password"
            type="password"
            label="Password"
            rules={rules.password}
            placeholder={t('enterYourPassword')}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton}>
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
        <Link href={'/auth/forgot-password'}>
          <p className={styles.forgotPassword}>{t('forgotPassword')}</p>
        </Link>
        <div className={styles.createAccount}>
          <Link href={'/auth/register'}>
            <Button type="default">{t('createAccount')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
