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

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
interface props {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
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

export function ModalCreatePost({ isOpenModal, setIsOpenModal }: Readonly<props>) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const createPostMutation = useCreatePostMutation();
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const { setLoading } = useLoadingStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewScope, setViewScope] = useState<ViewScopeType>(ViewScopeType.Public);
  const [commentScope, setCommentScope] = useState<CommentScopeType>(CommentScopeType.Public);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  const [currentUploadType, setCurrentUploadType] = useState<MediaType>(MediaType.IMAGE);
  const handleClose = () => {
    setContent('');
    setViewScope(ViewScopeType.Public);
    setCommentScope(CommentScopeType.Public);
    setIsOpenModal(false);
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
    mediaFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append('media', file.originFileObj);
      }
    });
    documentFiles.forEach((file) => formData.append('documents', file));
    try {
      setLoading(true);
      await createPostMutation.mutateAsync(formData);
      message.success('Post created successfully!');
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
        <div className={styles.uploadSection}>
          <MediaUpload
            mediaUpload={currentUploadType}
            files={mediaFiles}
            setFiles={setMediaFiles}
            documentFiles={documentFiles}
            setDocumentFiles={setDocumentFiles}
          />
        </div>
        <div className={styles.documentPreview}>
          {documentFiles.map((file) => (
            <div key={file.name} className={styles.documentItem}>
              <Image src={image.fileIcon} alt="File Icon" width={20} height={20} />
              <span>{file.name}</span>
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

        <div className={styles.createPostFooter}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Add to your post</span>
          </div>
          <div className={styles.attach}>
            <div className={styles.item} onClick={() => setCurrentUploadType(MediaType.IMAGE)}>
              <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
              <span>{t('photoVideo')}</span>
            </div>

            <div className={styles.item} onClick={() => setCurrentUploadType(MediaType.FILE)}>
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
