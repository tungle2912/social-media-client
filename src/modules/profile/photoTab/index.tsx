import { Skeleton } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { VideoButtonIcon } from '~/common/icon';
import { useGetMediaByIdQuery } from '~/hooks/data/user.data';
import styles from './styles.module.scss';

interface Props {
  userId: string;
}
export default function PhotoTab({ userId }: Props) {
  const { data: listMediaResponse, isLoading } = useGetMediaByIdQuery(userId ?? '');
  const refVideo: any = useRef(null);
  const router = useRouter();
  const t = useTranslations();
  const images = useMemo(() => {
    return listMediaResponse?.result?.filter((item: any) => item.type === 'image') || [];
  }, [listMediaResponse]);

  const videos = useMemo(() => {
    return listMediaResponse?.result?.filter((item: any) => item.type === 'video') || [];
  }, [listMediaResponse]);
  const renderMediaSection = (title: any, mediaList: any) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.mediaGrid}>
        {mediaList.map((item: any, index: any) => (
          <div key={index} className={styles.mediaItem}>
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
                    <video src={item.url} muted preload="metadata" className={styles.videoElement} />
                    <div className={styles.videoOverlay}>
                      <VideoButtonIcon size={48} />
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
      </div>
    </div>
  );

  return (
    <div className={styles.imageContainer}>
      {isLoading ? (
        <div className="flex justify-center mt-[20px]">
          <Skeleton />
        </div>
      ) : (
        <>
          <PhotoProvider>
            <div className="flex w-full flex-col gap-4">
              {renderMediaSection(t('images'), images)}
              {renderMediaSection(t('videos'), videos)}
            </div>
          </PhotoProvider>
        </>
      )}
    </div>
  );
}
