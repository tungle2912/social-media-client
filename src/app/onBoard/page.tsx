'use client';
import { Form, DatePicker, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Input from '~/common/input';
import { rules } from '~/lib/rules';
import AuthButton from '~/modules/auth/button';
import styles from './styles.module.scss';
import { useUpdateProfileMutation } from '~/hooks/data/user.data';

export default function OnBoard() {
  const [form] = Form.useForm();
  const router = useRouter();
  const updateProfileMutation = useUpdateProfileMutation();

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    formData.append('user_name', values.user_name);
    formData.append('date_of_birth', dayjs(values.date_of_birth).unix().toString());
    formData.append('isOnBoard', 'true');
    updateProfileMutation.mutateAsync(formData, {
      onSuccess: () => {
        message.success('Profile updated successfully');
        router.push('/profile');
      },
    });
  };

  return (
    <div className={styles.onboardContainer}>
      <h2 className={styles.title}>Complete Your Profile</h2>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onSubmit}
        initialValues={{ dateOfBirth: dayjs().subtract(18, 'year') }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input name="first_name" label="First Name" placeholder="Enter your first name" rules={rules.first_name} />
          </Col>
          <Col span={12}>
            <Input name="last_name" label="Last Name" placeholder="Enter your last name" rules={rules.last_name} />
          </Col>
        </Row>

        <Input name="user_name" label="Username" placeholder="Enter your user name" rules={rules.user_name} />

        <Form.Item label="Date of Birth" name="date_of_birth" rules={rules.date_of_birth}>
          <DatePicker
            className={styles.datePicker}
            format="YYYY-MM-DD"
            disabledDate={(current) => current > dayjs().endOf('day')}
          />
        </Form.Item>

        <AuthButton loading={updateProfileMutation.isPending}>Complete Profile</AuthButton>
      </Form>
    </div>
  );
}
