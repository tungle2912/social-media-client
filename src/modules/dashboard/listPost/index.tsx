/* eslint-disable @typescript-eslint/ban-ts-comment */
import image from '@/static/image';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Modal, Skeleton, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { UserType } from '~/definitions';
import { MediaType } from '~/definitions/enums/index.enum';
import { useGetNewFeedsQuery, useGetPostByIdQuery } from '~/hooks/data/post.data';
import InputCreatePost from '~/modules/profile/inputCreatePost';
import { ModalCreatePost } from '~/modules/profile/modalCreatePost';
import PostItem from '~/modules/profile/postItems';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
const MemoizedPostItem = memo(PostItem);
export default function ListPost() {
  const { data: sessionData } = useSession();
  const t = useTranslations();
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathname = usePathname();
  const postId = searchParam.get('postId') || undefined;
  const commentId = searchParam.get('commentId') || undefined;
  const { data: postDetail, error: postError, status: postStatus } = useGetPostByIdQuery(postId);
  const userProfile = sessionData?.user as UserType;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState<MediaType>();
  const [showUpload, setShowUpload] = useState(false);
  const listOnline = useListOnline((state) => state.listOnline);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { data: postData, refetch } = useGetNewFeedsQuery();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [listFriend, setListFriend] = useState<any>(null);
  // const { data: listFriendResponse } = useGetFriendQuery({
  //   search: '',
  //   page: 1,
  //   limit: 10,
  // });
  // useEffect(() => {
  //   if (listFriendResponse) {
  //     console.log('listFriendResponse', listFriendResponse);
  //     setListFriend(listFriendResponse);
  //   }
  // }, [listFriendResponse]);
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
  const renderPostContent = () => {
    if (errorMessage) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
          <ExclamationCircleOutlined className="text-red-500 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('accessDenied')}</h3>
          <p className="text-gray-600 text-center">{errorMessage}</p>
        </div>
      );
    }

    if (selectedPost) {
      return (
        <div className="max-h-[90vh] overflow-y-auto p-4">
          <MemoizedPostItem openComment={true} commentId={commentId} post={selectedPost} refetch={refetch} />
        </div>
      );
    }

    // Hiển thị skeleton thay vì chỉ spinner để cải thiện UX
    return (
      <div className="flex items-center justify-center min-h-[300px] p-4">
        <Skeleton active paragraph={{ rows: 4 }} title={false} className="w-full max-w-[400px]" />
      </div>
    );
  };
  // const listFriendConvert = useMemo(() => {
  //   console.log('listFriendConvert', listFriendResponse);
  //   return listFriendResponse.result.users.map((item: any) => {
  //     item.isOnline = Array.from(listOnline).includes(item?._id) || false;
  //     return item;
  //   });
  // }, [listFriendResponse, listOnline]);
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
      {/* <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 px-2">
          {listFriendConvert?.result?.users.map((item: any, idx: any) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="bg-[#fff0f6] w-[56px] h-[56px]" src={item?.avatar}></Avatar>
                {item?.isOnline && (
                  <div className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}></div>
                )}
                {!item?.isOnline && (
                  <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')} />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea> */}
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
        {renderPostContent()}
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
