'use client';

import { UserType } from '~/definitions/types/index.type';
import styles from './styles.module.scss';
import { useTranslations } from 'next-intl';

interface iInfoTab {
  userProfile: UserType;
}

export default function InfoTab({ userProfile }: iInfoTab) {
  const t = useTranslations();
  return (
    <div className={styles.infoTab}>
      <p>
        <strong>{t('email')}:</strong> {userProfile?.email}
      </p>
      <p>
        <strong>{t('location')}:</strong> {userProfile?.location || t('notUpdated')}
      </p>
      <p>
        <strong>{t('dateOfBirth')}:</strong>
        {userProfile?.date_of_birth ? new Date(userProfile?.date_of_birth).toLocaleDateString() : t('notUpdated')}
      </p>
      <p>
        <strong>{t('bio')}:</strong> {userProfile?.bio || t('notUpdated')}
      </p>
      <p>
        <strong>{t('website')}:</strong> {userProfile?.website || t('notUpdated')}
      </p>
    </div>
  );
}
