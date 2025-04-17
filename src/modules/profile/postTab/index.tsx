'use client';
import { Avatar, Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { ModalCreatePost } from '~/components/modalCreatePost';
import { UserType } from '~/definitions';
import { useDimension } from '~/hooks';
import InputCreatePost from '~/modules/profile/inputCreatePost';
import PostItem from '~/modules/profile/postItems';
import image from '../../../../public/static/image';
import styles from './styles.module.scss';
import { Posts } from '~/definitions/constants/post.contant';
interface iPostTab {
  userProfile: UserType;
}

export default function PostTab({ userProfile }: iPostTab) {
  const t = useTranslations();
  const { isSM } = useDimension();
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <div className={styles.postsTab}>
      {!isSM && (
        <div className={styles.leftSidebar}>
          <div className={styles.aboutSection}>
            <h3>{t('about')}</h3>
            <button className={styles.addButton}>{t('addBio')}</button>
            {/* <ul className={styles.infoList}>
              <li>
                {t('studiedAt', {
                  school: userProfile?.school || t('notUpdated'),
                })}
              </li>
              <li>
                {t('livesAt', {
                  location: userProfile?.location || t('notUpdated'),
                })}
              </li>
              <li>
                {t('from', {
                  hometown: userProfile?.hometown || t('notUpdated'),
                })}
              </li>
            </ul> */}
            <button className={styles.editButton}>{t('editDetails')}</button>
          </div>
          <div className={styles.imagesSection}>
            <div className={styles.imagesSectionHeader}>
              <h3>{t('photos')}</h3>
              <a href="#" className={styles.viewAllImage}>
                {t('viewAllPhotos')}
              </a>
            </div>
            <div className={styles.imageContainer}>
              <Image
                width={100}
                height={100}
                alt={t('imageAlt')}
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148262/goftpolyqmy08gmpwmdn.jpg"
                className={styles.imageAvatar}
              />
            </div>
          </div>
          <div className={styles.friendsSection}>
            <div className={styles.friendsSectionHeader}>
              <h3>{t('friends')}</h3>
              <a href="#" className={styles.viewAllFriendsLink}>
                {t('viewAllFriends')}
              </a>
            </div>
            <div className={styles.friendContainer}>
              <Image
                width={100}
                height={100}
                alt={t('friendAvatarAlt')}
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724148262/goftpolyqmy08gmpwmdn.jpg"
                className={styles.friendAvatar}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainContent}>
        <div className={styles.createPost}>
          <div className={styles.inputCreatePost}>
            <Avatar size={50} src={userProfile?.avatar || ''} className={styles.userAvatar} />
            <InputCreatePost setIsOpenModal={setIsOpenModal} />
          </div>
          <div className={styles.listAttach}>
            <div className={styles.item}>
              <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
              <span>{t('photoVideo')}</span>
            </div>
            <div className={styles.item}>
              <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
              <span>{t('attachment')}</span>
            </div>
          </div>
        </div>
        <div className={styles.managePosts}>
          <Button className={styles.filterButton}>{t('filter')}</Button>
        </div>
        <div className={styles.postsList}>
          {Posts.map((post) => (
            <PostItem key={post.id} name={post.name} timeAgo={post.timeAgo} content={post.content} image={post.image} />
          ))}
        </div>
      </div>
      <ModalCreatePost isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
    </div>
  );
}
