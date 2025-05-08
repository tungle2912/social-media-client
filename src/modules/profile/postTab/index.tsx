'use client';
import { Avatar, Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { UserType } from '~/definitions';
import { useDimension } from '~/hooks';
import InputCreatePost from '~/modules/profile/inputCreatePost';
import PostItem from '~/modules/profile/postItems';
import image from '../../../../public/static/image';
import styles from './styles.module.scss';
import { ModalCreatePost } from '~/modules/profile/modalCreatePost';
import { useGetPostByUserIdQuery } from '~/hooks/data/post.data';
import { MediaType } from '~/definitions/enums/index.enum';
import { useGetMediaByIdQuery } from '~/hooks/data/user.data';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useRouter } from 'next/navigation';
import { VideoButtonIcon } from '~/common/icon';
interface iPostTab {
  userProfile: UserType;
  isMe?: boolean;
  setActiveTab?: (tab: string) => void;
}

export default function PostTab({ userProfile, isMe = true, setActiveTab }: iPostTab) {
  const t = useTranslations();
  const { isSM } = useDimension();
  const refVideo: any = useRef(null);
  const router = useRouter();
  const { data: postData, refetch } = useGetPostByUserIdQuery(userProfile?._id ?? '');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState<MediaType>();
  const [showUpload, setShowUpload] = useState(false);
  const { data: listMediaResponse } = useGetMediaByIdQuery(userProfile?._id ?? '');
  const [listMedia, setListMedia] = useState<any>(null);
  useEffect(() => {
    if (listMediaResponse) {
      setListMedia(listMediaResponse);
    }
  }, [listMediaResponse]);
  const handleClickAttach = (type: MediaType) => {
    setTypeModal(type);
    setShowUpload(true);
    setIsOpenModal(true);
  };
  return (
    <div className={styles.postsTab}>
      {!isSM && (
        <div className={styles.leftSidebar}>
          <div className={styles.aboutSection}>
            <h3>{t('about')}</h3>
            <button className={styles.addButton}>{t('addBio')}</button>
            {isMe && <button className={styles.editButton}>{t('editDetails')}</button>}
          </div>
          <div className={styles.imagesSection}>
            <div className={styles.imagesSectionHeader}>
              <h3>{t('photos')}</h3>
              <a onClick={()=>setActiveTab?.('6')} className={styles.viewAllImage}>
                {t('viewAllPhotos')}
              </a>
            </div>
            <div className={styles.imageContainer}>
              <PhotoProvider>
                {listMedia?.result?.slice(0, 9).map((item: any) => (
                  <div key={item._id} className={styles.mediaItem}>
                    <PhotoView
                      src={item.type === 'image' ? item.url : undefined}
                      render={(props) => (
                        <div {...props.attrs} className={styles.videoContainer}>
                          <video
                            ref={refVideo}
                            src={item.url}
                            controls
                            disablePictureInPicture
                            className={styles.videoPlayer}
                          />
                          {refVideo?.current?.paused && (
                            <div className={styles.videoPlayButton} onClick={() => refVideo.current?.play()}>
                              <VideoButtonIcon />
                            </div>
                          )}
                        </div>
                      )}
                    >
                      <div className={styles.mediaContent}>
                        {item.type === 'image' ? (
                          <Image fill alt={t('imageAlt')} src={item.url} className={styles.mediaImage} />
                        ) : (
                          <div className={styles.videoWrapper}>
                            <video src={item.url} muted className={styles.videoElement} />
                            <div className={styles.videoOverlay}>
                              <VideoButtonIcon />
                            </div>
                          </div>
                        )}
                      </div>
                    </PhotoView>

                    <button
                      className={styles.viewPostButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/?postId=${item._idPost}`);
                      }}
                    >
                      {t('viewPost')}
                    </button>
                  </div>
                ))}
              </PhotoProvider>
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
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1745508584/f8fskez0fk3dcax6xmek.jpg"
                className={styles.friendAvatar}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.mainContent}>
        {isMe && (
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
        )}
        <div className={styles.managePosts}>
          <Button className={styles.filterButton}>{t('filter')}</Button>
        </div>
        <div className={styles.postsList}>
          {postData?.result?.map((post) => <PostItem refetch={refetch} key={post._id} post={post} />)}
        </div>
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
