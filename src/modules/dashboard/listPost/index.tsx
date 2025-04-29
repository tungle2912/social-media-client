import { Avatar, Button } from 'antd';
import styles from './styles.module.scss';
import InputCreatePost from '~/modules/profile/inputCreatePost';
import { useSession } from 'next-auth/react';
import { UserType } from '~/definitions';
import { useState } from 'react';
import { MediaType } from '~/definitions/enums/index.enum';
import Image from 'next/image';
import image from '@/static/image';
import { useGetNewFeedsQuery } from '~/hooks/data/post.data';
import PostItem from '~/modules/profile/postItems';
import { useTranslations } from 'next-intl';
import { ModalCreatePost } from '~/modules/profile/modalCreatePost';
export default function ListPost() {
  const { data: sessionData } = useSession();
  const t = useTranslations();
  const userProfile = sessionData?.user as UserType;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState<MediaType>();
  const [showUpload, setShowUpload] = useState(false);
  const { data: postData, refetch } = useGetNewFeedsQuery();
  const handleClickAttach = (type: MediaType) => {
    setTypeModal(type);
    setShowUpload(true);
    setIsOpenModal(true);
  };
  return (
    <div className={styles.mainContent}>
      <div className={styles.createPost}>
        <div className={styles.inputCreatePost}>
          <Avatar size={50} src={userProfile?.avatar || ''} className={styles.userAvatar} />
          <InputCreatePost setIsOpenModal={setIsOpenModal} />
        </div>
        <div className={styles.attach}>
          <div
            className={styles.item}
            onClick={() => {
              handleClickAttach(MediaType.IMAGE);
            }}
          >
            <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
            <span>{t('photoVideo')}</span>
          </div>
          <div
            className={styles.item}
            onClick={() => {
              handleClickAttach(MediaType.FILE);
            }}
          >
            <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
            <span>{t('attachment')}</span>
          </div>
        </div>
      </div>
      <div className={styles.managePosts}>
        <Button className={styles.filterButton}>{t('filter')}</Button>
      </div>
      <div className={styles.postsList}>
        {postData?.result?.map((post: any) => <PostItem refetch={refetch} key={post._id} post={post} />)}
      </div>
      <ModalCreatePost
        type={typeModal}
        showUpload={showUpload}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        refetch={refetch}
      />
    </div>
  );
}
