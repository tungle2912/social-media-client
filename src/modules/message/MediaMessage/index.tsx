import classNames from 'classnames';
import Image from 'next/image';
import React, { useMemo, useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import styles from './index.module.scss';
import { DocumentDownloadIcon, VideoButtonIcon, ZoomIcon } from '~/common/icon';

interface IPropsMediaMessage {
  listMedia: any;
  handleDownload: () => void;
}

const MediaMessage = ({ listMedia, handleDownload }: IPropsMediaMessage) => {
  const refFirstImage: any = useRef(null);
  const refFirstVideo: any = useRef(null);

  const { firstMedia, secondMedia, lengthMore, checkFirstImage } = useMemo(() => {
    const firstMedia = listMedia?.[0];
    const secondMedia = listMedia?.slice(1);
    const lengthMore = listMedia?.slice(2)?.length;

    const checkFirstImage = firstMedia?.type === 'IMAGE';

    return {
      firstMedia,
      secondMedia,
      lengthMore,
      checkFirstImage,
    };
  }, [listMedia]);

  const onDownload = () => {
    handleDownload();
  };

  return (
    <div className="relative">
      <div className={styles.wrapBtnAction}>
        <div
          className={styles.btnAction}
          onClick={() => {
            if (refFirstImage?.current) {
              refFirstImage?.current.click();
            }
            if (refFirstVideo?.current) {
              refFirstVideo?.current.click();
            }
          }}
        >
          <ZoomIcon />
        </div>
        <div className={styles.btnAction} onClick={onDownload}>
          <DocumentDownloadIcon />
        </div>
      </div>
      <PhotoProvider
        maskOpacity={0.8}
        bannerVisible={true}
        loop={1}
        photoWrapClassName={styles.photoWrap}
        photoClassName={styles.photo}
      >
        <div className={classNames(styles.wrapMedia, { [styles.oneMedia]: listMedia?.length === 1 })}>
          {firstMedia?.url && (
            <PhotoView
              src={checkFirstImage ? firstMedia?.url : undefined}
              // src={firstMedia?.url}
              width={772}
              height={485}
              render={(props) => {
                return (
                  <div
                    style={props.attrs.style}
                    onMouseDown={props.attrs.onMouseDown}
                    onWheel={props.attrs.onWheel}
                    className="relative"
                  >
                    <video
                      src={firstMedia?.url}
                      controls
                      disablePictureInPicture
                      // controlsList="noplaybackrate nodownload"
                      style={props.attrs.style}
                      className="bg-black"
                      // ref={refVideo}
                    />
                    {/* {refVideo?.current?.paused && (
                        <div
                          className="absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() => {
                            if (refVideo.current) {
                              refVideo.current.play();
                            }
                          }}
                        >
                          <VideoButtonIcon />
                        </div>
                      )} */}
                  </div>
                );
              }}
            >
              <div className={styles.item}>
                {checkFirstImage ? (
                  <Image
                    src={firstMedia?.url}
                    alt=""
                    width={390}
                    height={253}
                    className={classNames('rounded-[10px]', { [styles.oneMedia]: listMedia?.length === 1 })}
                    ref={refFirstImage}
                  />
                ) : (
                  <div className={classNames(styles.wrapVideo, { [styles.oneMedia]: listMedia?.length === 1 })}>
                    <video ref={refFirstVideo} src={firstMedia?.url} />
                    <div className={styles.videoButton}>
                      <VideoButtonIcon />
                    </div>
                  </div>
                )}
              </div>
            </PhotoView>
          )}
          {secondMedia?.length > 0 && (
            <div className={classNames(styles.item, { [styles.listItem]: secondMedia?.length > 1 })}>
              {secondMedia?.map((item: any, index: any) => {
                const checkImage = item?.type === 'IMAGE';
                return index < 2 ? (
                  <PhotoView
                    key={index}
                    src={checkImage ? item?.url : undefined}
                    // src={item?.url}
                    width={772}
                    height={485}
                    render={(props) => {
                      return (
                        <div
                          style={props.attrs.style}
                          onMouseDown={props.attrs.onMouseDown}
                          onWheel={props.attrs.onWheel}
                          className="relative"
                        >
                          <video
                            src={item?.url}
                            controls
                            disablePictureInPicture
                            style={props.attrs.style}
                            className="bg-black"
                            // ref={refVideo}
                          />
                          {/* {refVideo?.current?.paused && (
                          <div
                            className="absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => {
                              if (refVideo.current) {
                                refVideo.current.play();
                              }
                            }}
                          >
                            <VideoButtonIcon />
                          </div>
                        )} */}
                        </div>
                      );
                    }}
                  >
                    <div className={classNames(styles.itemSecond, { [styles.more]: index === 1 && lengthMore > 1 })}>
                      {checkImage ? (
                        <Image src={item?.url} alt="" width={390} height={253} className="rounded-[10px]" />
                      ) : (
                        <div className={styles.wrapVideo}>
                          <video src={item?.url} />
                          <div className={styles.videoButton}>
                            <VideoButtonIcon />
                          </div>
                        </div>
                      )}
                      {lengthMore > 1 && <span>{`${lengthMore}+`}</span>}
                    </div>
                  </PhotoView>
                ) : (
                  <PhotoView
                    key={index}
                    src={checkImage ? item?.url : undefined}
                    // src={item?.url}
                    width={772}
                    height={485}
                    render={(props) => {
                      return (
                        <div
                          style={props.attrs.style}
                          onMouseDown={props.attrs.onMouseDown}
                          onWheel={props.attrs.onWheel}
                        >
                          <video
                            src={item?.url}
                            controls
                            disablePictureInPicture
                            style={props.attrs.style}
                            className="bg-black"
                          />
                        </div>
                      );
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default MediaMessage;
