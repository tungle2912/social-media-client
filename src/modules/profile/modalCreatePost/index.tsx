import image from '@/static/image';
import { Avatar, message, Modal, Select, Upload, UploadFile } from 'antd';
import ImgCrop from 'antd-img-crop';
import { EmojiClickData } from 'emoji-picker-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SmileIcon, SomePeopleIcon, TagIcon } from '~/common/icon';
import { CommentScopeType, ViewScopeType } from '~/definitions/enums/index.enum';
import { useCreatePostMutation } from '~/hooks/data/post.data';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './styles.module.scss';
import AddImageIcon from '@/static/icon/addImageIcon';
import XCloseIcon from '@/static/icon/xCloseIcon';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
interface props {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  showUpload?: boolean;
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

export function ModalCreatePost({ isOpenModal, setIsOpenModal, showUpload = false }: Readonly<props>) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const createPostMutation = useCreatePostMutation();
  const { setLoading } = useLoadingStore();
  const [addImage, setAddImage] = useState(showUpload);
  const [mediaFiles, setMediaFiles] = useState<UploadFile[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<UploadFile[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewScope, setViewScope] = useState<ViewScopeType>(ViewScopeType.Public);
  const [commentScope, setCommentScope] = useState<CommentScopeType>(CommentScopeType.Public);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  const handleMediaUpload = async (file: File) => {
    const isImageOrVideo = ['image/jpeg', 'image/png', 'video/mp4'].includes(file.type);
    if (!isImageOrVideo) {
      message.error('Chỉ chấp nhận file ảnh hoặc video');
      return false;
    }
    return true;
  };

  // Xử lý upload attachment
  const handleAttachmentUpload = async (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error('File không được vượt quá 10MB');
      return false;
    }
    return true;
  };
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

    // Thêm attachment files
    attachmentFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append('attachments', file.originFileObj);
      }
    });
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
        {addImage && (
          <div className={styles.addImage}>
            <ImgCrop showReset rotationSlider aspectSlider>
              <Upload
                className={styles.upload}
                multiple
                fileList={mediaFiles}
                listType="picture-card"
                showUploadList={false}
                beforeUpload={handleMediaUpload}
                onChange={({ fileList }) => setMediaFiles(fileList)}
                accept="image/*,video/*"
              >
                <div className={styles.addImageContainer}>
                  <div className={styles.buttonClose} onClick={() => setAddImage(false)}>
                    <XCloseIcon />
                  </div>
                  <AddImageIcon />
                  <div>
                    <p className={styles.addImageTittle}>Add photos/videos</p>
                    <p className={styles.addImageText}>or drag and drop</p>
                    <p className={styles.addImageDescription}>Maximum photos (.gif/.png/.jpeg/.jpg) within 5MB</p>
                    <p className={styles.addImageDescription}>
                      Maximum videos (.mp4/.mpeg4/.mpe/.mpeg/.mpg/.wmv/.mov) within 20MB
                    </p>
                  </div>
                </div>
              </Upload>
            </ImgCrop>
          </div>
        )}
        {mediaFiles.length > 0 &&
          mediaFiles.map((file) => (
            <div key={file.uid} className={styles.imagePreview}>
              <div className={styles.imagePreviewContainer}>
                <Image
                  src={URL.createObjectURL(file.originFileObj!)}
                  alt="Preview"
                  width={100}
                  height={100}
                  className={styles.imagePreviewItem}
                />
              </div>
              <div
                className={styles.buttonClose}
                onClick={() => setMediaFiles((prev) => prev.filter((f) => f.uid !== file.uid))}
              >
                <XCloseIcon />
              </div>
            </div>
          ))}

        <div className={styles.createPostFooter}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Add to your post</span>
          </div>
          <div className={styles.attach}>
            <div className={styles.item} onClick={() => setAddImage(!addImage)}>
              <Image src={image.videoAndImage} width={26.67} height={26.67} alt={t('photoVideo')} />
              <span>{t('photoVideo')}</span>
            </div>

            <div className={styles.item}>
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
