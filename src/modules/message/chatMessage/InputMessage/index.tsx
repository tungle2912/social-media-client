// import MediaUpload from '~/modules/community/components/MediaUpload';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Image, Input, message, Spin, Tooltip, Upload, UploadProps } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { useEffect, useRef, useState } from 'react';

import { CloseIcon, IconAttatchment2, SendIcon } from '~/common/icon';
import Button from '~/components/form/Button';
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
  MAX_FILE_SIZE_VIDEOS_MESSAGE_MB,
  MAX_LENGTH_CONTENT_MESSENGER,
} from '~/definitions/constants/index.constant';
import styles from './styles.module.scss';
import image from '@/static/image';

interface IProps {
  defaultValue: string;
  defaultFile?: any;
  handleSendMsg: (msgValue: any, file: any, documents: any) => void;
}
interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  url?: string;
  type: string;
  size: number;
  originFileObj?: File;
}
interface UploadErrorProps {
  open: boolean;
  onclose: () => void;
  message1: string;
  message2: string;
  limit: number;
}

const InputMessage = ({ defaultValue = '', defaultFile = [], handleSendMsg }: IProps) => {
  // const me: any = getMe();
  const t = useTranslations();
  const [maxLengthTextArea, setMaxLengthTextArea] = useState<number>(500);
  const [documentFiles, setDocumentFiles] = useState<any>([]);
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState<string | null>(null);
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openNoticeFile, setOpenNoticeFile] = useState<{
    isOpen: boolean;
    message1: string;
    message2: string;
    limit: number;
  }>({
    isOpen: false,
    message1: 'exceedNumberOfFiles',
    message2: 'maxNumberOfDocument',
    limit: LIMIT_UPLOAD_FILE,
  });
  const [disabledTooltip, setDisabledTooltip] = useState(false);
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    fileList: [],
    showUploadList: false,
    beforeUpload: async (file: UploadFile, fileList) => {
      const updatedFiles = [...files];
      const updatedDocumentFiles = [...documentFiles];
      fileList.forEach((i) => {
        if (acceptDocumentFiles.includes(i?.type)) {
          updatedDocumentFiles.push(i);
        } else if (acceptFilesImage.includes(i?.type) || acceptFilesVideo.includes(i?.type)) {
          updatedFiles.push(i);
        }
      });
      const imagesFile = updatedFiles.filter((imageFile) => acceptFilesImage.includes(imageFile?.type));
      const videosFile = updatedFiles.filter((videoFile) => acceptFilesVideo.includes(videoFile?.type));
      if (imagesFile.length > LIMIT_UPLOAD_IMAGE) {
        setOpenNoticeFile({
          isOpen: true,
          message1: 'exceedNumberOfFiles',
          message2: 'maxNumberOfImage',
          limit: LIMIT_UPLOAD_IMAGE,
        });
        return false;
      }
      if (videosFile.length > LIMIT_UPLOAD_VIDEO) {
        setOpenNoticeFile({
          isOpen: true,
          message1: 'exceedNumberOfFiles',
          message2: 'maxNumberOfVideo',
          limit: LIMIT_UPLOAD_VIDEO,
        });
        return false;
      }
      if (updatedDocumentFiles.length > LIMIT_UPLOAD_FILE) {
        setOpenNoticeFile({
          isOpen: true,
          message1: 'exceedNumberOfFiles',
          message2: 'maxNumberOfDocument',
          limit: LIMIT_UPLOAD_FILE,
        });
        return false;
      }
      if (
        !acceptFilesVideo.includes(file?.type + '') &&
        !acceptFilesImage.includes(file?.type + '') &&
        !acceptDocumentFiles.includes(file?.type + '')
      ) {
        return message.error(t('message.unsupportedMediaType'));
      }
      if (acceptFilesImage.includes(file?.type + '')) {
        if (file?.size / 1024 / 1024 > MAX_FILE_SIZE_DOCUMENT_MB) {
          setOpenNoticeFile({
            isOpen: true,
            message1: 'exceededMaxFileSize',
            message2: 'maxFileImage',
            limit: MAX_FILE_SIZE_IMAGE_MB,
          });
          return false;
        }
      }
      if (acceptDocumentFiles.includes(file?.type + '')) {
        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_DOCUMENT_MB) {
          setOpenNoticeFile({
            isOpen: true,
            message1: 'exceededMaxFileSize',
            message2: 'maxFileDocument',
            limit: MAX_FILE_SIZE_DOCUMENT_MB,
          });
          return false;
        }
      }
      if (acceptFilesVideo.includes(file?.type + '')) {
        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_VIDEOS_MESSAGE_MB) {
          setOpenNoticeFile({
            isOpen: true,
            message1: 'exceededMaxFileSize',
            message2: 'maxFileVideo',
            limit: MAX_FILE_SIZE_VIDEOS_MESSAGE_MB,
          });
          return false;
        }
      }
      const fileObjectUrl = URL.createObjectURL(file as any);
      const fileObj = {
        name: file?.name,
        size: file?.size,
        src: fileObjectUrl,
        file: file,
        type: file.type,
      };
      if (acceptDocumentFiles.includes(file?.type + '')) {
        setDocumentFiles((prev: any) => [...prev, fileObj]);
      } else setFiles((prev: any) => [...prev, fileObj]);
      inputRef?.current?.focus();
      return Promise.reject(file);
    },
  };

  useEffect(() => {
    inputRef?.current?.focus();
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [documentFiles, files]);

  useEffect(() => {
    if (defaultFile) {
      setFiles(defaultFile);
    }
  }, []);
  const UploadErrorModal = ({ open, onclose, message1, message2, limit }: UploadErrorProps) => {
    return (
      <ModalBasic
        visible={open}
        width={600}
        destroyOnClose={true}
        title=""
        closeIcon={false}
        footer={<>&nbsp;</>}
        onClosed={onclose}
      >
        <div className="text-center">
          <p className="text-base-black-200 text-[24px] font-bold">{t('sizeExceedingMessage.message')}</p>
          <p className="mt-[61px] text-base-black-300 leading-[24px]">
            {t(`sizeExceedingMessage.${message1}`)}
            <br />
            {t(`message.${message2}`, { field: limit })}
            <br />
            {t('sizeExceedingMessage.pleaseCheckFileAgain')}
          </p>
          <Flex justify="center" className="mt-[61px]" gap={24}>
            <Button btnType="primary" className="h-[48px] min-w-[170px]" onClick={onclose}>
              {t('common.ok')}
            </Button>
          </Flex>
        </div>
      </ModalBasic>
    );
  };
  // const handleAddEmoji = (e: any) => {
  //   if (value?.length === MAX_LENGTH_CONTENT_MESSENGER - 1) return;
  //   const input = inputRef?.current?.resizableTextArea;
  //   const position = input?.textArea?.selectionStart;
  //   const newValue = value?.slice(0, position) + e + value?.slice(position, value?.length);
  //   setValue(newValue);
  //   input.selectionStart = input.selectionEnd = position + 2;
  //   inputRef?.current?.focus();
  // };
  const handleSubmit = () => {
    if (loading || (value?.trim() === '' && files?.length === 0 && documentFiles?.length === 0)) return;
    setLoading(true);
    setTimeout(() => {
      handleSendMsg(value, files, documentFiles);
      setValue('');
      setFiles([]);
      setDocumentFiles([]);
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (value) {
      const contentDecIcon = value || '';
      if (contentDecIcon.length >= MAX_LENGTH_CONTENT_MESSENGER) {
        if (contentDecIcon.length === MAX_LENGTH_CONTENT_MESSENGER + 1) {
          setValue(contentDecIcon.slice(0, MAX_LENGTH_CONTENT_MESSENGER - 1).trim());
        } else setValue(contentDecIcon.slice(0, MAX_LENGTH_CONTENT_MESSENGER).trim());
      } else {
        setMaxLengthTextArea(MAX_LENGTH_CONTENT_MESSENGER);
      }
    }
  }, [value]);

  const renderActions = () => {
    return (
      <Flex className="w-full h-[45px] justify-between items-center">
        <Flex className="justify-between items-center">
          <Tooltip title={<span className="text-xs">{t('common.uploadImage')}</span>}>
            <div className="mt-[4px] mx-4 cursor-pointer">
              <Upload {...props}>
                <IconAttatchment2 />
              </Upload>
            </div>
          </Tooltip>
          <Tooltip title={disabledTooltip ? '' : <span className="text-xs">{t('common.emoji')}</span>}>
            <div className="mr-4 cursor-pointer" onClick={() => setDisabledTooltip(!disabledTooltip)}>
              {/* <SelectEmoji onSelectEmoji={handleAddEmoji} classNameItem="text-[20px]" rawChildren={true}>
                <EmoticonIcon />
              </SelectEmoji> */}
            </div>
          </Tooltip>
        </Flex>
        <Tooltip title={<span className="text-xs">{t('common.send')}</span>}>
          <div
            className={classNames(
              'mr-4 cursor-pointer',
              value?.trim() === '' && !files[0]?.file && documentFiles.length === 0 && styles.cursorNotAllow
            )}
            onClick={handleSubmit}
          >
            {loading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : (
              <SendIcon
                pathColor={
                  value?.trim() === '' && !files[0]?.file && documentFiles.length === 0 ? '#B5B5B5' : "#8951ff"
                }
              />
            )}
          </div>
        </Tooltip>
      </Flex>
    );
  };

  const onRemoveDocuments = (document: File) => {
    const updatedFiles = documentFiles.filter((file: any) => file !== document);
    setDocumentFiles(updatedFiles);
  };

  const onRemoveFiles = (fileRemove: File) => {
    const updatedFiles = files.filter((file: any) => file !== fileRemove);
    setFiles(updatedFiles);
  };

  return (
    <div className={styles.inputMsgContainer}>
      <div
        className={classNames(
          'w-full h-auto relative rounded-[10px] px-[10px] pt-[10px] pb-[50px] bg-[#F8F8FF]',
          loading ? 'opacity-[0.5]' : ''
        )}
      >
        <Input.TextArea
          ref={inputRef}
          maxLength={maxLengthTextArea}
          value={value || ''}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              return handleSubmit();
            }
          }}
          onChange={(e) => {
            setValue(e?.target?.value);
          }}
          autoSize={{ minRows: 1, maxRows: 10 }}
          placeholder={t('common.message')}
          className={styles.inputMessage}
        />
        <Flex className="w-[99%] absolute bottom-[1px] rounded-bl-[10px] rounded-br-[10px] left-[5px] z-10 bg-[#F8F8FF] justify-center items-center">
          {renderActions()}
        </Flex>
      </div>
      <div className="mt-2">
        {files && (
          <div className="flex flex-row justify-start items-center">
            {files?.map((file: any, index: any) => {
              if (acceptFilesVideo.includes(file?.type) || file?.type === 'VIDEO') {
                return (
                  <div key={index} className="relative bg-[#636363] mr-[10px]">
                    <video
                      width="100px"
                      height="100px"
                      src={file?.src || file?.url}
                      className="rounded-[10px] w-[100px] h-[100px] "
                    ></video>
                    <div
                      className="absolute right-[5px] top-[5px] cursor-pointer bg-[#FFF] rounded-[5px]"
                      onClick={() => onRemoveFiles(file)}
                    >
                      <CloseIcon />
                    </div>
                  </div>
                );
              } else
                return (
                  <div key={index} className="relative bg-[#636363] mr-[10px]">
                    <img className="w-[100px] h-[100px] object-contain" src={file?.src || file?.url} alt="file" />
                    <div
                      className="absolute right-[5px] top-[5px] cursor-pointer bg-[#FFF] rounded-[5px]"
                      onClick={() => onRemoveFiles(file)}
                    >
                      <CloseIcon />
                    </div>
                  </div>
                );
            })}
          </div>
        )}
        {documentFiles.map((file: File, index: number) => (
          <div className={styles.documentFile} key={index}>
            <div className="flex gap-[9px] items-center">
              <div className="h-[26.67px]">
                <Image preview={false} alt='image' src={image.attachment} width={26.67} height={26.67} />
              </div>
              <div className={classNames(styles.name, 'line-clamp-1')}>{file.name}</div>
            </div>
            <div className="pr-[22px] cursor-pointer" onClick={() => onRemoveDocuments(file)}>
              <CloseIcon />
            </div>
          </div>
        ))}
      </div>
      <UploadErrorModal
        open={openNoticeFile.isOpen}
        message1={openNoticeFile.message1}
        message2={openNoticeFile.message2}
        limit={openNoticeFile.limit}
        onclose={() => {
          setOpenNoticeFile({
            isOpen: false,
            message1: 'exceedNumberOfFiles',
            message2: 'maxNumberOfDocument',
            limit: LIMIT_UPLOAD_FILE,
          });
        }}
      />
    </div>
  );
};

export default InputMessage;
