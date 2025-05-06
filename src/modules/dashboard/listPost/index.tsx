/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Avatar, Button, Modal, Spin } from 'antd';
import styles from './styles.module.scss';
import InputCreatePost from '~/modules/profile/inputCreatePost';
import { useSession } from 'next-auth/react';
import { UserType } from '~/definitions';
import { useEffect, useState } from 'react';
import { MediaType } from '~/definitions/enums/index.enum';
import Image from 'next/image';
import image from '@/static/image';
import { useGetNewFeedsQuery, useGetPostByIdQuery } from '~/hooks/data/post.data';
import PostItem from '~/modules/profile/postItems';
import { useTranslations } from 'next-intl';
import { ModalCreatePost } from '~/modules/profile/modalCreatePost';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export default function ListPost() {
  const { data: sessionData } = useSession();
  const t = useTranslations();
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathname = usePathname();
  const postId = searchParam.get('postId') || undefined;
  const { data: postDetail, error: postError, status: postStatus } = useGetPostByIdQuery(postId);
  const userProfile = sessionData?.user as UserType;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState<MediaType>();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { data: postData, refetch } = useGetNewFeedsQuery();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleClickAttach = (type: MediaType) => {
    setTypeModal(type);
    setShowUpload(true);
    setIsOpenModal(true);
  };
  useEffect(() => {
    if (postError) {
      // @ts-ignore
      if (postError.status === 403) {
        // @ts-ignore
        setErrorMessage(postError.data?.message || 'Not authorized to view');
      } else {
        setErrorMessage('An error occurred while fetching post');
      }
      setSelectedPost(null);
    } else if (postDetail) {
      setSelectedPost(postDetail.result);
      setErrorMessage('');
    }
  }, [postDetail, postError]);

  useEffect(() => {
    if (postDetail) {
      setSelectedPost(postDetail.result);
    }
  }, [postDetail]);
  const handleCloseModal = () => {
    router.replace(pathname);
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
      <Modal
        open={!!postId}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        className="rounded-[15px] p-0"
        bodyStyle={{ padding: 0 }}
      >
        <p className="text-center text-lg font-semibold py-4 border-b  border-gray-200">{t('postDetail')}</p>
        {errorMessage ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
            <ExclamationCircleOutlined className="text-red-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 text-center">{errorMessage}</p>
          </div>
        ) : selectedPost ? (
          <div className="max-h-[70vh]overflow-y-auto p-4">
            <PostItem openComment={true} post={selectedPost} refetch={refetch} />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spin />
          </div>
        )}
      </Modal>
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
