/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import image from '@/static/image';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { DownloadFileIcon, VideoButtonIcon } from '~/common/icon';
import IframeVideo from '~/common/IframeVideo';
import { PostMedia } from '~/definitions/interfaces/post.interface';
import { regexVideoMultipeSocial } from '~/lib/helper';
import styles from './styles.module.scss'; // Changed to CSS module

interface IPropsContentPost {
  content: string;
  postMedias: PostMedia[];
  onShowDetail?: () => void;
  isDetail?: boolean;
  isRepost?: boolean;
}

const EXT_IMAGE = ['gif', 'png', 'jpeg', 'jpg'];
const EXT_MEDIA = ['gif', 'png', 'jpeg', 'jpg', 'mp4', 'mpeg4', 'mpe', 'mpeg', 'mpg', 'wmv', 'mov'];
const EXT_ATTACHMENT = ['pdf', 'pptx', 'ppt', 'xlsx', 'xls', 'docx', 'doc'];

const ContentPost = ({ content, postMedias, onShowDetail, isDetail, isRepost }: IPropsContentPost) => {
  const t = useTranslations();
  // const { profile } = useProfile(true);

  const [linkVideo, setLinkVideo] = useState('');
  // const { isSM } = useDimension();
  // const refContainer = useRef(null);
  const refVideo: any = useRef(null);

  const pathname = usePathname();
  const isPublicPage = pathname?.includes('/profile/');

  useEffect(() => {
    if (content) {
      const matchedLinks = content.match(regexVideoMultipeSocial) || [];
      setLinkVideo(matchedLinks?.[matchedLinks?.length - 1]);
    }
  }, [content]);

  // const { listTags, itemListMoreTags } = useMemo(() => {
  //   const formatTag = postTags?.filter((item) => item?.type === 'PUBLIC');
  //   const listTags = formatTag?.slice(0, isRepost ? 13 : 14);
  //   const itemListMoreTags: MenuProps['items'] = postTags?.slice(isRepost ? 13 : 14)?.map((item) => ({
  //     label: item.name,
  //     key: `${item.tagId}`,
  //     onClick: () => router.push({ query: { tag: item?.tagId } }),
  //   }));

  //   return { listTags, itemListMoreTags };
  // }, [postTags]);

  const { listPostMedia, firstMedia, secondMedia, lengthMore, listAttachment, checkFirstImage } = useMemo(() => {
    const listPostMedia = postMedias?.filter((m) => m.type === 'image' || m.type === 'video');
    const firstMedia = listPostMedia?.[0];
    const nameFirstMedia = firstMedia?.name?.split('.') ?? [];
    const checkFirstImage = EXT_IMAGE.includes(nameFirstMedia[nameFirstMedia?.length - 1]?.toLowerCase());
    const secondMedia = listPostMedia?.slice(1);
    const lengthMore = listPostMedia?.slice(2)?.length;

    const listAttachment = postMedias?.filter((m) => m.type === 'file');

    return { listPostMedia, firstMedia, secondMedia, lengthMore, listAttachment, checkFirstImage };
  }, [postMedias]);

  return (
    <div className={styles.wrapContentPost}>
      {content && (
        <>
          <div
            className={classNames(styles.content, {
              [styles.contentDetail]: isDetail,
              [styles.contentRepost]: isRepost,
            })}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {content.length > 500 && (
            <button className={styles.seeMore} onClick={onShowDetail}>
              {isDetail ? '' : t('seeMore')}
            </button>
          )}
        </>
      )}

      {/* {postTags?.length > 0 && postTags?.filter((i) => i?.type !== 'PRIVATE')?.length > 0 && (
        <div className={styles.tagsContainer} ref={refContainer}>
          {listTags?.map((item) => (
            <Tooltip
              key={item.tagId}
              title={item.name}
              placement="bottom"
              open={(item?.name?.length || 0) <= 8 ? false : undefined}
            >
              <div className={styles.tag} onClick={() => router.push({ query: { tag: item?.tagId } })}>
                {(item.name?.length ?? 0) > 8 ? `${item.name?.slice(0, 8)}...` : item.name ?? ''}
              </div>
            </Tooltip>
          ))}
          {itemListMoreTags?.length > 0 && (
            <Dropdown
              menu={{ items: itemListMoreTags }}
              placement={isSM ? 'bottomCenter' : 'bottomRight'}
              className={styles.dropdown}
              getPopupContainer={(element: HTMLElement) => element}
            >
              <div className={styles.tagMore}>{`+${itemListMoreTags.length}`}</div>
            </Dropdown>
          )}
        </div>
      )} */}

      {linkVideo && !listPostMedia?.length && !listAttachment?.length && (
        <IframeVideo linkVideo={linkVideo} className={styles.videoIframe} width="100%" height="385" />
      )}

      {listPostMedia?.length > 0 && (
        <PhotoProvider
          maskOpacity={0.8}
          bannerVisible={true}
          loop={1}
          photoWrapClassName={styles.photoWrap}
          photoClassName={styles.photo}
        >
          <div className={styles.mediaContainer}>
            {firstMedia?.url && (
              <PhotoView
                src={checkFirstImage ? firstMedia.url : undefined}
                render={(props) => (
                  <div {...props.attrs} className={styles.videoContainer}>
                    <video
                      ref={refVideo}
                      src={firstMedia.url}
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
                <div className={styles.mediaItem}>
                  {checkFirstImage ? (
                    <Image
                      src={firstMedia.url}
                      alt=""
                      fill
                      className={classNames(styles.mediaImage, { [styles.publicPage]: isPublicPage })}
                    />
                  ) : (
                    <div className={classNames(styles.videoWrapper, { [styles.publicPage]: isPublicPage })}>
                      <video src={firstMedia.url} className={styles.videoElement} />
                      <div className={styles.videoPlayButton}>
                        <VideoButtonIcon />
                      </div>
                    </div>
                  )}
                </div>
              </PhotoView>
            )}
            {secondMedia?.length > 0 && (
              <div className={styles.mediaSecondaryContainer}>
                {secondMedia.map((item, index) => {
                  const ext = item?.name?.split('.').pop()?.toLowerCase() || '';
                  const isImage = EXT_IMAGE.includes(ext);
                  return index < 2 ? (
                    <PhotoView
                      key={item.id}
                      src={isImage ? item.url : undefined}
                      render={(props) => (
                        <div {...props.attrs} className={styles.videoContainer}>
                          <video src={item.url} controls disablePictureInPicture className={styles.videoPlayer} />
                        </div>
                      )}
                    >
                      <div
                        className={classNames(styles.mediaSecondaryItem, {
                          [styles.mediaWithOverlay]: index === 1 && lengthMore > 1,
                        })}
                      >
                        {isImage ? (
                          <Image src={item.url} alt="" fill className={styles.mediaImage} />
                        ) : (
                          <div className={styles.videoWrapper}>
                            <video src={item.url} className={styles.videoElement} />
                            <div className={styles.videoPlayButton}>
                              <VideoButtonIcon />
                            </div>
                          </div>
                        )}
                        {lengthMore > 1 && index === 1 && (
                          <span className={styles.mediaOverlayText}>{`${lengthMore}+`}</span>
                        )}
                      </div>
                    </PhotoView>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </PhotoProvider>
      )}

      {listAttachment?.length > 0 && (
        <div className={styles.attachmentsContainer}>
          {listAttachment.map((item, index) => (
            <div key={index} className={styles.attachmentItem}>
              <div className={styles.attachmentInfo}>
              <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
                <span className={styles.attachmentName}>{item.name}</span>
              </div>
              <a href={item.url} download className={styles.attachmentDownload}>
                <DownloadFileIcon className={styles.downloadIcon} />
                <span className={styles.downloadText}>{t('download')}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentPost;
