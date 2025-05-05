import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Avatar, message, Modal, Select } from 'antd';
import { EmojiClickData } from 'emoji-picker-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SmileIcon, SomePeopleIcon, TagIcon } from '~/common/icon';
import { UserType } from '~/definitions';
import { CommentScopeType, MediaType, ViewScopeType } from '~/definitions/enums/index.enum';
import { IPost, PostMedia } from '~/definitions/interfaces/post.interface';
import { useCreatePostMutation, useGetPostByIdQuery } from '~/hooks/data/post.data';
import { useModalController } from '~/hooks/useModalController';
import AddTag from '~/modules/profile/modalCreatePost/addTag';
import SelectPeopleCanViewAndComment from '~/modules/profile/modalCreatePost/selectPeople';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './styles.module.scss';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import ContentPost from '~/modules/profile/postItems/contentPost';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
interface props {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  type?: MediaType;
  showUpload?: boolean;
  embeddedPost?: string;
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

export function ModalRePost({ isOpenModal, setIsOpenModal, refetch, embeddedPost }: Readonly<props>) {
  const t = useTranslations();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const createPostMutation = useCreatePostMutation();
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const { setLoading } = useLoadingStore();
  const peopleCanViewAndCommentCtrl = useModalController();
  const { data: postDetail } = useGetPostByIdQuery(embeddedPost);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewScope, setViewScope] = useState<ViewScopeType>(ViewScopeType.Public);
  const [commentScope, setCommentScope] = useState<CommentScopeType>(CommentScopeType.Public);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  const handleClose = () => {
    setContent('');
    setMediaFiles([]);
    setDocumentFiles([]);
    setViewScope(ViewScopeType.Public);
    setCommentScope(CommentScopeType.Public);
    setIsOpenModal(false);
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
    formData.append('embeddedPost', embeddedPost || '');
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

  const onHandleSelectPermission = (value: ViewScopeType, field: string) => {
    if (value === ViewScopeType.SomeOne) {
      peopleCanViewAndCommentCtrl.open(true, { field });
    }
    setViewScope(value);
  };
  const parseMedia = (url: string): PostMedia => {
    const fileName = url.split('/').pop() || '';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    return {
      url,
      name: fileName,
      type: ['gif', 'png', 'jpeg', 'jpg'].includes(ext)
        ? 'image'
        : ['mp4', 'mpeg', 'mov'].includes(ext)
          ? 'video'
          : 'file',
      id: undefined,
    };
  };
  const parseFile = (file: any): PostMedia => {
    return {
      url: file.url,
      name: file.name,
      type: 'file',
      id: undefined,
    };
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
          {postDetail?.result && (
            <div className={styles.wrapRepost}>
              <HeaderPost refetch={refetch} isMyPost={false} post={postDetail.result} />
              <ContentPost
                content={postDetail.result.content}
                postMedias={[
                  ...(postDetail.result.media?.map(parseMedia) || []),
                  ...(postDetail.result.attachments?.map(parseFile) || []),
                ]}
              />
            </div>
          )}
          <div className={styles.createPostFooter}>
            <div className={styles.divider}>
              <span className={styles.dividerText}>Add to your post</span>
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
      <SelectPeopleCanViewAndComment
        open={!!peopleCanViewAndCommentCtrl.key}
        attachedData={peopleCanViewAndCommentCtrl.attachedData}
        onClosed={() => peopleCanViewAndCommentCtrl.close()}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        onChangeValue={setSelectedValues}
      />
    </>
  );
}
