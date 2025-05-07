'use client';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, Tabs } from 'antd';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { use } from 'react';
import { UserType } from '~/definitions/types/index.type';
import { useGetProfileByIdQuery } from '~/hooks/data/conservation.data';
import InfoTab from '~/modules/profile/infoTab';
import PostTab from '~/modules/profile/postTab';
import styles from '../styles.module.scss';
import { useParams } from 'next/navigation';
export default function Profile() {
  const t = useTranslations();
  const { userId } = useParams();
  const response = useGetProfileByIdQuery(userId as string);
  const { data: session } = useSession();
  const user = session?.user;
  const userProfile: UserType = response?.data?.result ?? ({} as UserType);
  const items = [
    {
      key: '1',
      label: t('posts'),
      children: <PostTab isMe={false} userProfile={userProfile} />,
    },
    {
      key: '2',
      label: t('info'),
      children: <InfoTab userProfile={userProfile} />,
    },
    {
      key: '3',
      label: t('friends'),
      children: <div className={styles.friendList}></div>,
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
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileImage}>
        <Image
          className={styles.coverPhoto}
          alt={'coverPhotoAlt'}
          src={
            userProfile?.cover_photo ||
            'https://res.cloudinary.com/dflvvu32c/image/upload/v1736065110/24a3bc7f939ba49ecc054061dccbac61_nye58p.jpg'
          }
          width={1568}
          height={550}
        />

        <div className={styles.avatarContainer}>
          <Image
            width={150}
            height={150}
            alt="avatarAlt"
            src={
              userProfile?.avatar ||
              'https://res.cloudinary.com/dflvvu32c/image/upload/v1734688174/cd4bd9b0ea2807611ba3a67c331bff0b_z1i7ls.png'
            }
            className={styles.profileAvatar}
          />
        </div>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.profileInfoContent}>
          <h2>{userProfile?.user_name || t('notUpdated')}</h2>
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
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
