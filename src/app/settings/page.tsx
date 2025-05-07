'use client';
import { Tabs, Form, Input, Button, Checkbox } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl'; // For translations if needed

const { TabPane } = Tabs;

const ProfileTab = ({ form, onFormSubmit }: any) => (
  <div>
    <h2 className="text-xl font-semibold">Profile Info</h2>
    <Form form={form} name="profileForm" onFinish={onFormSubmit} layout="vertical" className="mt-4">
      <Form.Item label="Username" name="username">
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item label="Bio" name="bio">
        <Input.TextArea placeholder="Short bio" />
      </Form.Item>

      <Button type="primary" htmlType="submit" className="mt-4">
        Save Profile
      </Button>
    </Form>
  </div>
);

const AccountTab = ({ form, onFormSubmit }: any) => (
  <div>
    <h2 className="text-xl font-semibold">Account Settings</h2>
    <Form form={form} name="accountForm" onFinish={onFormSubmit} layout="vertical" className="mt-4">
      <Form.Item label="Change Password" name="password">
        <Input.Password placeholder="Enter new password" />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Button type="primary" htmlType="submit" className="mt-4">
        Update Account
      </Button>
    </Form>
  </div>
);

const AppearanceTab = ({ form, onFormSubmit }: any) => (
  <div>
    <h2 className="text-xl font-semibold">Appearance Settings</h2>
    <Form form={form} name="appearanceForm" onFinish={onFormSubmit} layout="vertical" className="mt-4">
      <Form.Item label="Theme" name="theme">
        <Input placeholder="Select theme" />
      </Form.Item>

      <Form.Item label="Font Size" name="fontSize">
        <Input placeholder="Select font size" />
      </Form.Item>

      <Button type="primary" htmlType="submit" className="mt-4">
        Save Appearance
      </Button>
    </Form>
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('1'); // Default active tab
  const [form] = Form.useForm();
  const t = useTranslations();

  const onFormSubmit = (values: any) => {
    console.log('Form Values: ', values);
  };

  return (
    <div className="max-w-screen-lg mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left" // Align tabs to the left
          className="mb-6"
          size="large"
          style={{ width: '100%' }}
        >
          <TabPane tab={t('Profile')} key="1">
            <ProfileTab form={form} onFormSubmit={onFormSubmit} />
          </TabPane>

          <TabPane tab={t('Account')} key="2">
            <AccountTab form={form} onFormSubmit={onFormSubmit} />
          </TabPane>

          <TabPane tab={t('Appearance')} key="3">
            <AppearanceTab form={form} onFormSubmit={onFormSubmit} />
          </TabPane>

          <TabPane tab={t('Notifications')} key="4">
            <div>
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p>Manage your notification preferences here.</p>
            </div>
          </TabPane>

          <TabPane tab={t('Display')} key="5">
            <div>
              <h2 className="text-xl font-semibold">Display Settings</h2>
              <p>Adjust your display settings here.</p>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
