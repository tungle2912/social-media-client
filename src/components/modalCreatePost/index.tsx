import { Avatar, Modal, Select } from 'antd';
import styles from './styles.module.scss';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SmileIcon, SomePeopleIcon, TagIcon } from '~/common/icon';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CommentScopeType, ViewScopeType } from '~/definitions/enums/index.enum';
import image from '@/static/image';

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
    value: ViewScopeType.Friends,
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
    value: CommentScopeType.Friends,
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

export function ModalCreatePost({ isOpenModal, setIsOpenModal }: props) {
  const t = useTranslations();
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
            <Avatar
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1739413637/kaz83swuhggnsi0exrk3.jpg"
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.userDetails}>
              <p className={styles.username}>Tung le</p>
              <div className={styles.privacySettings}>
                <Select defaultValue={viewScopeOptions[0].value} style={{ width: 160 }} options={viewScopeOptions} />
                <Select
                  defaultValue={commentScopeOptions[0].value}
                  style={{ width: 160 }}
                  options={commentScopeOptions}
                />
              </div>
            </div>
          </div>

          <textarea className={styles.textArea} placeholder="Write something here ..."></textarea>

          <div className={styles.emojiTag}>
            <div className={styles.btnAddEmoji}>
              <SmileIcon />
              Add emoji
            </div>
            <div className={styles.btnAddTag}>
              <TagIcon />
              Add Tag
            </div>
          </div>
        </div>

        <div className={styles.createPostFooter}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Add to your post</span>
          </div>
          <div className={styles.attach}>
            <div className={styles.item}>
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
            <button className={styles.postButton}>Post</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
