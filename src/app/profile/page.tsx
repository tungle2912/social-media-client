'use client';
import { CameraOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, message, Modal, Spin, Tabs, Upload, UploadFile } from 'antd';

import { useGetProfileQuery, useUpdateProfileMutation } from '~/hooks/data/user.data';
import InfoTab from '~/modules/profile/infoTab';
import PostTab from '~/modules/profile/postTab';
import image from '../../../public/static/image';
import styles from './styles.module.scss';
import { useTranslations } from 'next-intl';
import { UserType } from '~/definitions/types/types';
import { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import useLoadingStore from '~/stores/loading.store';

export default function Profile() {
  const t = useTranslations();
  const response = useGetProfileQuery();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userProfile: UserType = response?.data?.result || ({} as UserType);
  const items = [
    {
      key: '1',
      label: t('posts'),
      children: <PostTab userProfile={userProfile} />,
    },
    {
      key: '2',
      label: t('info'),
      children: <InfoTab userProfile={userProfile} />,
    },
    {
      key: '3',
      label: t('friends'),
      children: <div className={styles.friendList}>{/* Map through friends here */}</div>,
    },
    {
      key: '4',
      label: t('settings'),
      children: (
        <div className={styles.settingsTab}>
          <Button icon={<EditOutlined />}>{t('editProfile')}</Button>
        </div>
      ),
    },
    {
      key: '5',
      label: t('recentActivity'),
      children: (
        <div className={styles.activityTab}>
          <p>{t('recentActivity')}</p>
        </div>
      ),
    },
    {
      key: '6',
      label: t('photos'),
      children: (
        <div className={styles.photosTab}>
          <p>{t('yourPhotos')}</p>
        </div>
      ),
    },
    {
      key: '7',
      label: t('events'),
      children: (
        <div className={styles.eventsTab}>
          <p>{t('lifeEvents')}</p>
        </div>
      ),
    },
  ];
  const [newAvatar, setNewAvatar] = useState<string | null>(null); // Avatar mới sau khi chọn
  const setLoading = useLoadingStore((state) => state.setLoading);
  const updateProfileMutation = useUpdateProfileMutation();
  const handleUpdateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      await updateProfileMutation.mutateAsync(formData);
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatar(reader.result as string); // Hiển thị preview của hình ảnh
      };
      reader.readAsDataURL(file);
      message.success(t('avatarUpdated'));
    } catch (error) {
      message.error(t('avatarUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateCorverPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('cover_photo', file);
    setLoading(true);
    try {
      await updateProfileMutation.mutateAsync(formData);
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      message.success(t('Cover photo updated'));
    } catch (error) {
      message.error(t('Cover photo updated failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileImage}>
        <Image
          className={styles.coverPhoto}
          alt={t('coverPhotoAlt')}
          src={
            userProfile?.cover_photo ||
            'https://res.cloudinary.com/dflvvu32c/image/upload/v1736065110/24a3bc7f939ba49ecc054061dccbac61_nye58p.jpg'
          }
          width={1568}
          height={550}
        />
        <ImgCrop aspect={24 / 9} rotationSlider>
          <Upload
            maxCount={1}
            beforeUpload={handleUpdateCorverPhoto}
            fileList={fileList}
            className={styles.editAvatarButton}
          >
            <div>
              <Button icon={<EditOutlined />} className={styles.editCoverButton}>
                {t('editCover')}
              </Button>
            </div>
          </Upload>
        </ImgCrop>

        <div className={styles.avatarContainer}>
          <Image
            width={150}
            height={150}
            src={
              userProfile?.avatar ||
              'https://res.cloudinary.com/dflvvu32c/image/upload/v1734688174/cd4bd9b0ea2807611ba3a67c331bff0b_z1i7ls.png'
            } // Avatar mặc định hoặc mới thay đổi
            className={styles.profileAvatar}
          />
          <ImgCrop rotationSlider>
            <Upload
              maxCount={1}
              beforeUpload={handleUpdateAvatar}
              fileList={fileList}
              className={styles.editAvatarButton}
            >
              <div>
                <Button icon={<CameraOutlined />} />
              </div>
            </Upload>
          </ImgCrop>
        </div>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.profileInfoContent}>
          <h2>{userProfile?.username || t('notUpdated')}</h2>
          <div className={styles.friendList}>
            <Avatar
              size={40}
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1738987278/koonctfibksbyt04gxxn.jpg"
              className={styles.friendImage}
            />
             <Avatar
              size={40}
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1738987344/g9gc0pj3jhp7kaybtcqm.jpg"
              className={styles.friendImage}
            />
          </div>
        </div>
        <div className={styles.profileActions}>
          <Button icon={<PlusOutlined />}>{t('addToStory')}</Button>
          <Button icon={<EditOutlined />}>{t('editProfile')}</Button>
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
