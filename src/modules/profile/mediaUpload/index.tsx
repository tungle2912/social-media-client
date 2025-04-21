import AddDocumentIcon from '@/static/icon/addDocumentIcon';
import AddImageIcon from '@/static/icon/addImageIcon';
import { Button, Flex, Upload, UploadProps } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import ModalBasic from '~/components/modal/modalBasic';
import {
    acceptDocumentFiles,
    acceptFilesImage,
    acceptFilesVideo,
    LIMIT_UPLOAD_FILE,
    LIMIT_UPLOAD_IMAGE,
    LIMIT_UPLOAD_VIDEO,
    MAX_FILE_SIZE_DOCUMENT_MB,
    MAX_FILE_SIZE_IMAGE_MB,
    MAX_FILE_SIZE_VIDEOS_MB,
} from '~/definitions/constants/index.constant';
import { MediaType } from '~/definitions/enums/index.enum';
import styles from './styles.module.scss';

interface Props {
  mediaUpload: MediaType;
  files?: File[];
  documentFiles?: File[];
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  setDocumentFiles?: React.Dispatch<React.SetStateAction<File[]>>;
}

const { Dragger } = Upload;

const MediaUpload: React.FC<Props> = ({ mediaUpload, files, documentFiles, setFiles, setDocumentFiles }) => {
  const [openNoticeFile, setOpenNoticeFile] = useState<{ isOpen: boolean; type: MediaType }>({
    isOpen: false,
    type: MediaType.IMAGE,
  });
  const [openNoticeMaxFile, setOpenNoticeMaxFile] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  const checkFileValid = (typeFile: string, mediaType?: MediaType): boolean => {
    const validFiles = mediaType === MediaType.FILE ? acceptDocumentFiles : [...acceptFilesImage, ...acceptFilesVideo];
    return validFiles.includes(typeFile);
  };

  const acceptFile =
    mediaUpload === MediaType.FILE
      ? acceptDocumentFiles.join(', ')
      : [...acceptFilesImage, ...acceptFilesVideo].join(', ');

  const handleBeforeUpload = async (fileList: File[]) => {
    const processFile = async (file: File): Promise<File | null> => {
      const fileType = file.type;

      if (!checkFileValid(fileType, mediaUpload)) {
        setOpenNoticeMaxFile({
          isOpen: true,
          message: 'Cannot upload one or some media. Please check',
        });
        return null;
      }

      if (mediaUpload === MediaType.FILE) {
        if (documentFiles && documentFiles.length + fileList.length > LIMIT_UPLOAD_FILE) {
          setOpenNoticeMaxFile({
            isOpen: true,
            message: `Sorry, maximum allowed number of documents is ${LIMIT_UPLOAD_FILE}`,
          });
          return null;
        }
        if (file.size > MAX_FILE_SIZE_DOCUMENT_MB * 1024 * 1024) {
          setOpenNoticeFile({ isOpen: true, type: MediaType.FILE });
          return null;
        }
      } else {
        const isImage = acceptFilesImage.includes(fileType);
        const isVideo = acceptFilesVideo.includes(fileType);

        if (isImage) {
          if (
            files &&
            files.filter((f) => acceptFilesImage.includes(f.type)).length + fileList.length > LIMIT_UPLOAD_IMAGE
          ) {
            setOpenNoticeMaxFile({
              isOpen: true,
              message: `Maximum ${LIMIT_UPLOAD_IMAGE} images allowed`,
            });
            return null;
          }
          if (file.size > MAX_FILE_SIZE_IMAGE_MB * 1024 * 1024) {
            setOpenNoticeFile({ isOpen: true, type: MediaType.IMAGE });
            return null;
          }
        }

        if (isVideo) {
          if (
            files &&
            files.filter((f) => acceptFilesVideo.includes(f.type)).length + fileList.length > LIMIT_UPLOAD_VIDEO
          ) {
            setOpenNoticeMaxFile({
              isOpen: true,
              message: `Maximum ${LIMIT_UPLOAD_VIDEO} videos allowed`,
            });
            return null;
          }
          if (file.size > MAX_FILE_SIZE_VIDEOS_MB * 1024 * 1024) {
            setOpenNoticeFile({ isOpen: true, type: MediaType.VIDEO });
            return null;
          }
        }
      }

      return file;
    };

    const processedFiles = await Promise.all(fileList.map(processFile));
    const validFiles = processedFiles.filter((file): file is File => file !== null);

    if (mediaUpload === MediaType.FILE) {
      setDocumentFiles!([...(documentFiles || []), ...validFiles]);
    } else {
      setFiles!([...(files || []), ...validFiles]);
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: acceptFile,
    beforeUpload: (_, fileList) => {
      handleBeforeUpload(fileList.map((file) => file as File));
      return false;
    },
    showUploadList: false,
  };

  return (
    <>
      <Dragger className={classNames(styles.customUpload)} {...props}>
        <div className={styles.container}>
          {mediaUpload === MediaType.FILE ? (
            <>
              <AddImageIcon />
              <p className={styles.uploadHeader}>Upload Document</p>
              <p className={styles.uploadSubtitle}>Drag and drop files here</p>
              <p className={styles.uploadNote}>Maximum document size: {MAX_FILE_SIZE_DOCUMENT_MB}MB</p>
            </>
          ) : (
            <>
              <AddDocumentIcon />
              <p className={styles.uploadHeader}>Add Photo/Video</p>
              <p className={styles.uploadSubtitle}>Drag and drop files here</p>
              <p className={styles.uploadNote}>Maximum photo size: {MAX_FILE_SIZE_IMAGE_MB}MB</p>
              <p className={styles.uploadNote}>Maximum video size: {MAX_FILE_SIZE_VIDEOS_MB}MB</p>
            </>
          )}
        </div>
      </Dragger>
      <ModalBasic
        visible={openNoticeFile.isOpen}
        className={classNames(styles.customModalConfirm)}
        destroyOnClose={true}
        title=""
        closeIcon={false}
        footer={<>&nbsp;</>}
        onClosed={() => setOpenNoticeFile({ isOpen: false, type: MediaType.FILE })}
      >
        <div className={styles.modalContent}>
          <p className={styles.modalTitle}>Message</p>
          <p className={styles.modalMessage}>
            Exceeded the maximum file size.
            <br />
            {openNoticeFile.type === MediaType.IMAGE
              ? `The maximum file size for attached photos is ${MAX_FILE_SIZE_IMAGE_MB}MB per post.`
              : openNoticeFile.type === MediaType.VIDEO
                ? `The maximum file size for attached videos is ${MAX_FILE_SIZE_VIDEOS_MB}MB per post.`
                : `The maximum file size for attached documents is ${MAX_FILE_SIZE_DOCUMENT_MB}MB per post.`}
            <br />
            Please check again before posting
          </p>
          <Flex justify="center" className={styles.modalActions} gap={24}>
            <Button
              className={styles.modalButton}
              onClick={() => setOpenNoticeFile({ isOpen: false, type: MediaType.FILE })}
            >
              OK
            </Button>
          </Flex>
        </div>
      </ModalBasic>

      <ModalBasic
        visible={openNoticeMaxFile.isOpen}
        className={classNames(styles.customModalConfirm)}
        destroyOnClose={true}
        title=""
        closeIcon={false}
        footer={<>&nbsp;</>}
        onClosed={() => setOpenNoticeMaxFile({ isOpen: false, message: '' })}
      >
        <div className={styles.modalContent}>
          <p className={styles.modalTitle}>Message</p>
          <p className={styles.modalMessage}>{openNoticeMaxFile.message}</p>
          <Flex justify="center" className={styles.modalActions} gap={24}>
            <Button className={styles.modalButton} onClick={() => setOpenNoticeMaxFile({ isOpen: false, message: '' })}>
              OK
            </Button>
          </Flex>
        </div>
      </ModalBasic>
    </>
  );
};

export default MediaUpload;
