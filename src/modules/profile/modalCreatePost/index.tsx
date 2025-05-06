import AddDocumentIcon from '@/static/icon/addDocumentIcon';
import AddImageIcon from '@/static/icon/addImageIcon';
import XCloseIcon from '@/static/icon/xCloseIcon';
import image from '@/static/image';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Avatar, message, Modal, Select, Upload } from 'antd';
import { UploadProps } from 'antd/lib';
import classNames from 'classnames';
import { EmojiClickData } from 'emoji-picker-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SmileIcon, SomePeopleIcon, TagIcon } from '~/common/icon';
import { UserType } from '~/definitions';
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
import { CommentScopeType, MediaType, ViewScopeType } from '~/definitions/enums/index.enum';
import { IPost } from '~/definitions/interfaces/post.interface';
import { useCreatePostMutation } from '~/hooks/data/post.data';
import { useModalController } from '~/hooks/useModalController';
import SelectPeopleCanViewAndComment from '~/modules/profile/modalCreatePost/selectPeople';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './styles.module.scss';
import AddTag from '~/modules/profile/modalCreatePost/addTag';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
interface props {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  type?: MediaType;
  showUpload?: boolean;
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        result: IPost[];
        message: string;
      },
      Error
    >
  >;
}
const viewScopeOptions = [
  {
    value: ViewScopeType.Public,
    label: (
      <div className={styles.permissionItems}>
        <PublicIcon />
        <p>Anyone can view</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.Friend,
    label: (
      <div className={styles.permissionItems}>
        <AllConnectedIcon />
        <p>Friends</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.SomeOne,
    label: (
      <div className={styles.permissionItems}>
        <SomePeopleIcon />
        <p>Someone can view</p>
      </div>
    ),
  },
  {
    value: ViewScopeType.Private,
    label: (
      <div className={styles.permissionItems}>
        <OnlyMeIcon />
        <p>Only me</p>
      </div>
    ),
  },
];

const commentScopeOptions = [
  {
    value: CommentScopeType.Public,
    label: (
      <div className={styles.permissionItems}>
        <PublicIcon />
        <p>Anyone can comment</p>
      </div>
    ),
  },
  {
    value: CommentScopeType.Friend,
    label: (
      <div className={styles.permissionItems}>
        <AllConnectedIcon />
        <p>Followers</p>
      </div>
    ),
  },
  {
    value: CommentScopeType.Private,
    label: (
      <div className={styles.permissionItems}>
        <OnlyMeIcon />
        <p>Only me</p>
      </div>
    ),
  },
];

export function ModalCreatePost({
  isOpenModal,
  setIsOpenModal,
  type = MediaType.IMAGE,
  showUpload = false,
  refetch,
}: Readonly<props>) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const createPostMutation = useCreatePostMutation();
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const { setLoading } = useLoadingStore();
  const peopleCanViewAndCommentCtrl = useModalController();
  const [isShowUpload, setIsShowUpload] = useState(showUpload);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewScope, setViewScope] = useState<ViewScopeType>(ViewScopeType.Public);
  const [commentScope, setCommentScope] = useState<CommentScopeType>(CommentScopeType.Public);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  const [currentUploadType, setCurrentUploadType] = useState<MediaType>(type);
  const handleClose = () => {
    setContent('');
    setMediaFiles([]);
    setDocumentFiles([]);
    setViewScope(ViewScopeType.Public);
    setCommentScope(CommentScopeType.Public);
    setIsShowUpload(false);
    setIsOpenModal(false);
  };
  const handleClickAttach = (type: MediaType) => {
    setIsShowUpload(true);
    setCurrentUploadType(type);
  };
  const [selectedValues, setSelectedValues] = useState<{ viewScope: UserType[] }>({
    viewScope: [],
  });
  const handleCreatePost = async () => {
    if (!content.trim() && mediaFiles.length === 0 && documentFiles.length === 0) {
      message.error('Please enter post content or add media/files');
      return;
    }
    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('viewScope', viewScope.toString());
    formData.append('commentScope', commentScope.toString());
    formData.append('specificFriends', JSON.stringify(selectedValues.viewScope.map((friend) => friend._id)));
    mediaFiles.forEach((file) => {
      formData.append('media', file);
    });

    documentFiles.forEach((file) => formData.append('attachment', file));
    try {
      setLoading(true);
      await createPostMutation.mutateAsync(formData, {
        onSuccess: async () => {
          message.success('Post created successfully!');
          await refetch();
          await handleClose();
        },
      });
    } catch (error) {
      message.error('Failed to create post');
      console.error('Post creation error:', error);
    } finally {
      setContent('');
      setLoading(false);
    }
  };
  const numberOfFiles = mediaFiles.length;
  const handleFileSelection = (file: any, type: MediaType) => {
    const fileType = file.type;
    if (type === MediaType.FILE) {
      const documentFile: File[] = [...documentFiles, ...[file]];
      if (!acceptDocumentFiles.includes(fileType)) {
        message.error(`Invalid file type: ${file.name}`);
        return;
      }
      if (documentFile.length > LIMIT_UPLOAD_FILE) {
        message.error(`Maximum ${LIMIT_UPLOAD_FILE} documents allowed`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_DOCUMENT_MB * 1024 * 1024) {
        message.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_DOCUMENT_MB}MB`);
        return;
      }
      setDocumentFiles(() => [...documentFile]);
    } else {
      const mediaFile: File[] = [...mediaFiles, ...[file]];
      if (![...acceptFilesImage, ...acceptFilesVideo].includes(fileType)) {
        message.error(`Invalid file type: ${file.name}`);
        return;
      }
      const isImage = acceptFilesImage.includes(fileType);
      const isVideo = acceptFilesVideo.includes(fileType);
      if (isImage) {
        if (mediaFile.filter((f) => acceptFilesImage.includes(f.type)).length > LIMIT_UPLOAD_IMAGE) {
          message.error(`Maximum ${LIMIT_UPLOAD_IMAGE} images allowed`);
          return;
        }
        if (file.size > MAX_FILE_SIZE_IMAGE_MB * 1024 * 1024) {
          message.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_IMAGE_MB}MB`);
          return;
        }
      } else if (isVideo) {
        const currentVideos = mediaFiles.filter((f) => acceptFilesVideo.includes(f.type));
        if (
          currentVideos.length + mediaFile.filter((f) => acceptFilesVideo.includes(f.type)).length >=
          LIMIT_UPLOAD_VIDEO
        ) {
          message.error(`Maximum ${LIMIT_UPLOAD_VIDEO} videos allowed`);
          return;
        }
        if (file.size > MAX_FILE_SIZE_VIDEOS_MB * 1024 * 1024) {
          message.error(`File ${file.name} exceeds ${MAX_FILE_SIZE_VIDEOS_MB}MB`);
          return;
        }
      }

      setMediaFiles(() => [...mediaFile]);
    }
    setIsShowUpload(false);
  };

  const mediaUploadProps: UploadProps = {
    multiple: true,
    accept: [...acceptFilesImage, ...acceptFilesVideo].join(', '),
    onChange: (info) => {
      if (info.file.status === 'done') {
        handleFileSelection(info?.file?.originFileObj, MediaType.IMAGE);
      }
    },
    showUploadList: false,
    beforeUpload: () => true,
  };

  const documentUploadProps: UploadProps = {
    multiple: true,
    accept: acceptDocumentFiles.join(', '),
    onChange: (info) => {
      if (info.file.status === 'done') {
        handleFileSelection(info?.file?.originFileObj, MediaType.FILE);
      }
      // const fileList = info.fileList.map((file) => file.originFileObj as File);
      // handleFileSelection(fileList, MediaType.FILE);
    },
    showUploadList: false,
    beforeUpload: () => true,
  };
  useEffect(() => {
    setIsShowUpload(showUpload);
    setCurrentUploadType(type);
  }, [showUpload, type]);

  const onHandleSelectPermission = (value: ViewScopeType, field: string) => {
    if (value === ViewScopeType.SomeOne) {
      peopleCanViewAndCommentCtrl.open(true, { field });
    }
    setViewScope(value);
  };

  return (
    <>
      <Modal
        title="Create a post"
        centered
        onCancel={handleClose}
        open={isOpenModal}
        className={styles.modalCreatePost}
      >
        <div className={styles.createPostContainer}>
          <div className={styles.createPostContent}>
            <div className={styles.userInfo}>
              <Avatar src={user?.avatar} alt="Avatar" className={styles.avatar} />
              <div className={styles.userDetails}>
                <p className={styles.username}>{user?.user_name}</p>
                <div className={styles.privacySettings}>
                  <Select
                    defaultValue={viewScopeOptions[0].value}
                    onChange={setViewScope}
                    style={{ width: 160 }}
                    options={viewScopeOptions}
                    onSelect={(value) => onHandleSelectPermission(value, 'viewScope')}
                  />
                  <Select
                    defaultValue={commentScopeOptions[0].value}
                    onChange={setCommentScope}
                    style={{ width: 160 }}
                    options={commentScopeOptions}
                  />
                </div>
              </div>
            </div>

            <textarea
              className={styles.textArea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something here ..."
            ></textarea>

            <div className={styles.emojiTag}>
              <div className={styles.btnAddEmoji} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <SmileIcon />
                Add emoji
              </div>
              {showEmojiPicker && (
                <div className={styles.emojiPickerContainer}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <AddTag keyword={''} setKeyword={() => {}}>
                <div className={styles.btnAddTag}>
                  <TagIcon />
                  Add Tag
                </div>
              </AddTag>
            </div>
          </div>
          <div className={styles.uploadContainer}>
            {isShowUpload && (
              <div className={styles.uploadSection}>
                {currentUploadType === MediaType.IMAGE ? (
                  <Upload className={classNames(styles.customUpload)} {...mediaUploadProps}>
                    <div className={styles.container}>
                      <AddDocumentIcon />
                      <p className={styles.uploadHeader}>Add Photo/Video</p>
                      <p className={styles.uploadSubtitle}>Drag and drop files here</p>
                      <p className={styles.uploadNote}>Maximum photo size: {MAX_FILE_SIZE_IMAGE_MB}MB</p>
                      <p className={styles.uploadNote}>Maximum video size: {MAX_FILE_SIZE_VIDEOS_MB}MB</p>
                    </div>
                  </Upload>
                ) : (
                  <Upload className={classNames(styles.customUpload)} {...documentUploadProps}>
                    <div className={styles.container}>
                      <AddImageIcon />
                      <p className={styles.uploadHeader}>Upload Document</p>
                      <p className={styles.uploadSubtitle}>Drag and drop files here</p>
                      <p className={styles.uploadNote}>Maximum document size: {MAX_FILE_SIZE_DOCUMENT_MB}MB</p>
                    </div>
                  </Upload>
                )}
              </div>
            )}
            <div className={styles.documentPreview}>
              {documentFiles.map((file) => (
                <div key={file.name} className={styles.documentItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: '10px' }}>
                    <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={() => setDocumentFiles((prev) => prev.filter((f) => f.name !== file.name))}
                    className={styles.removeButton}
                  >
                    <XCloseIcon />
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.mediaPreview}>
              {/* Trường hợp 1 tệp */}
              {numberOfFiles === 1 && (
                <div className={classNames(styles.previewItem, styles.oneFile)}>
                  {mediaFiles[0].type.startsWith('image/') ? (
                    <Image src={URL.createObjectURL(mediaFiles[0])} alt="Preview" width={100} height={100} />
                  ) : (
                    <video controls src={URL.createObjectURL(mediaFiles[0])} />
                  )}
                </div>
              )}

              {/* Trường hợp 2 tệp */}
              {numberOfFiles === 2 && (
                <>
                  {mediaFiles.map((file) => (
                    <div key={file.name} className={classNames(styles.previewItem, styles.twoFiles)}>
                      {file.type.startsWith('image/') ? (
                        <Image src={URL.createObjectURL(file)} alt="Preview" width={100} height={100} />
                      ) : (
                        <video controls src={URL.createObjectURL(file)} />
                      )}
                    </div>
                  ))}
                </>
              )}
              {numberOfFiles >= 3 && (
                <>
                  <div className={classNames(styles.previewItem, styles.threeFilesFirst)}>
                    {mediaFiles[0].type.startsWith('image/') ? (
                      <Image src={URL.createObjectURL(mediaFiles[0])} alt="Preview" width={100} height={100} />
                    ) : (
                      <video controls src={URL.createObjectURL(mediaFiles[0])} />
                    )}
                  </div>
                  <div className={styles.threeFilesContainer}>
                    <div className={classNames(styles.previewItem, styles.threeFilesSecond)}>
                      {mediaFiles[1].type.startsWith('image/') ? (
                        <Image src={URL.createObjectURL(mediaFiles[1])} alt="Preview" width={100} height={100} />
                      ) : (
                        <video controls src={URL.createObjectURL(mediaFiles[1])} />
                      )}
                    </div>
                    <div className={classNames(styles.previewItem, styles.threeFilesThird)}>
                      {mediaFiles[2].type.startsWith('image/') ? (
                        <Image src={URL.createObjectURL(mediaFiles[2])} alt="Preview" width={100} height={100} />
                      ) : (
                        <video controls src={URL.createObjectURL(mediaFiles[2])} />
                      )}

                      {numberOfFiles > 3 && <div className={styles.moreFilesOverlay}>+{numberOfFiles - 3}</div>}
                    </div>
                  </div>
                </>
              )}
              {numberOfFiles > 0 && (
                <button onClick={() => setMediaFiles([])} className={styles.removeButton}>
                  <XCloseIcon />
                </button>
              )}
            </div>
          </div>
          <div className={styles.createPostFooter}>
            <div className={styles.divider}>
              <span className={styles.dividerText}>Add to your post</span>
            </div>
            <div className={styles.attach}>
              {mediaFiles.length > 0 || documentFiles.length > 0 ? (
                <>
                  <Upload {...mediaUploadProps}>
                    <div className={styles.item}>
                      <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
                      <span>{t('photoVideo')}</span>
                    </div>
                  </Upload>
                  <Upload {...documentUploadProps}>
                    <div className={styles.item}>
                      <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
                      <span>{t('attachment')}</span>
                    </div>
                  </Upload>
                </>
              ) : (
                <>
                  <div onClick={() => handleClickAttach(MediaType.IMAGE)} className={styles.item}>
                    <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
                    <span>{t('photoVideo')}</span>
                  </div>{' '}
                  <div onClick={() => handleClickAttach(MediaType.FILE)} className={styles.item}>
                    <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
                    <span>{t('attachment')}</span>
                  </div>
                </>
              )}
            </div>
            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                onClick={() => {
                  setIsOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button disabled={createPostMutation.isPending} onClick={handleCreatePost} className={styles.postButton}>
                Post
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {!!peopleCanViewAndCommentCtrl.key && (
        <SelectPeopleCanViewAndComment
          open={!!peopleCanViewAndCommentCtrl.key}
          attachedData={peopleCanViewAndCommentCtrl.attachedData}
          onClosed={() => peopleCanViewAndCommentCtrl.close()}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          onChangeValue={setSelectedValues}
        />
      )}
    </>
  );
}
