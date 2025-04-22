import XCloseIcon from '@/static/icon/xCloseIcon';
import image from '@/static/image';
import { Avatar, message, Modal, Select } from 'antd';
import { EmojiClickData } from 'emoji-picker-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SmileIcon, SomePeopleIcon, TagIcon } from '~/common/icon';
import { CommentScopeType, MediaType, ViewScopeType } from '~/definitions/enums/index.enum';
import { useCreatePostMutation } from '~/hooks/data/post.data';
import MediaUpload from '~/modules/profile/mediaUpload';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './styles.module.scss';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { IPost } from '~/definitions/interfaces/post.interface';

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
    setViewScope(ViewScopeType.Public);
    setCommentScope(CommentScopeType.Public);
    setIsOpenModal(false);
  };
  const handleClickAttach = (type: MediaType) => {
    setIsShowUpload(true);
    setCurrentUploadType(type);
  };
  const handleCreatePost = async () => {
    if (!content.trim()) {
      message.error('Please enter post content');
      return;
    }
    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('viewScope', viewScope.toString());
    formData.append('commentScope', commentScope.toString());
    console.log('media', mediaFiles);
    mediaFiles.forEach((file) => {
      formData.append('media', file);
    });

    documentFiles.forEach((file) => formData.append('attachment', file));
    console.log('documentFiles', documentFiles);
    try {
      setLoading(true);
      await createPostMutation.mutateAsync(formData);
      message.success('Post created successfully!');
      refetch();
      handleClose();
    } catch (error) {
      message.error('Failed to create post');
      console.error('Post creation error:', error);
    } finally {
      setContent('');
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create a post"
      centered
      open={isOpenModal}
      className={styles.modalCreatePost}
      onCancel={() => {
        setIsOpenModal(false);
      }}
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
            content={content}
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
            <div className={styles.btnAddTag}>
              <TagIcon />
              Add Tag
            </div>
          </div>
        </div>
        <div className={styles.uploadContainer}>
          {isShowUpload && (
            <div className={styles.uploadSection}>
              <MediaUpload
                mediaUpload={currentUploadType}
                files={mediaFiles}
                setShowUpload={setIsShowUpload}
                setFiles={setMediaFiles}
                documentFiles={documentFiles}
                setDocumentFiles={setDocumentFiles}
              />
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
            {mediaFiles.map((file) => (
              <div key={file.name} className={styles.previewItem}>
                {file.type.startsWith('image/') ? (
                  <Image src={URL.createObjectURL(file)} alt="Preview" width={100} height={100} />
                ) : (
                  <video controls src={URL.createObjectURL(file)} />
                )}
                <button
                  onClick={() => setMediaFiles((prev) => prev.filter((f) => f.name !== file.name))}
                  className={styles.removeButton}
                >
                  <XCloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.createPostFooter}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Add to your post</span>
          </div>
          <div className={styles.attach}>
            <div className={styles.item} onClick={() => handleClickAttach(MediaType.IMAGE)}>
              <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
              <span>{t('photoVideo')}</span>
            </div>

            <div className={styles.item} onClick={() => handleClickAttach(MediaType.FILE)}>
              <Image src={image.attachment} width={26.67} height={26.67} alt={t('attachmentAlt')} />
              <span>{t('attachment')}</span>
            </div>
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
            <button onClick={handleCreatePost} className={styles.postButton}>
              Post
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
