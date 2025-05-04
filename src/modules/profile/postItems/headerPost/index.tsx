'use client';
import { EllipsisOutlined } from '@ant-design/icons';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Avatar, Button, message, Popover, Select, Tooltip } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  AllConnectedIcon,
  ArrowRight,
  CommentIcon,
  DeleteIcon,
  EyeIcon,
  OnlyMeIcon,
  PublicIcon,
  SomePeopleIcon,
} from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import ModalConfirm from '~/components/modal/modalConfirm';
import { CommentScopeType, contactStatus, ViewScopeType } from '~/definitions/enums/index.enum';
import { IPost } from '~/definitions/interfaces/post.interface';
import { useDeletePostMutation, useUpdatePostMutation } from '~/hooks/data/post.data';
import { convertTimestampToString, convertTimeStampToStringDate } from '~/lib/utils';
import styles from './styles.module.scss';
import { useFollowMutation } from '~/hooks/data/user.data';
import SelectPeopleCanViewAndComment from '~/modules/profile/modalCreatePost/selectPeople';
import { UserType } from '~/definitions';
interface Props {
  post: IPost;
  isMyPost: boolean;
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
export default function HeaderPost({ post, refetch }: Props) {
  const time = convertTimeStampToStringDate(post.createdAt);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewPopoverOpen, setViewPopoverOpen] = useState(false);
  const [commentPopoverOpen, setCommentPopoverOpen] = useState(false);
  const [selectFriendsModalOpen, setSelectFriendsModalOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<{ viewScope: any[] }>({
    viewScope: post.specificFriends ?? [],
  });

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const followMutation = useFollowMutation(post?.author?._id || '');
  const handleClickAvatar = (id: string) => {
    router.push(`/profile/${id}`);
  };
  const handleFollow = async () => {
    await followMutation.mutateAsync(undefined, {
      onSuccess: async () => {
        await refetch();
        message.success('Follow successfully', 3);
      },
    });
  };
  const viewScopeOptions = [
    { value: ViewScopeType.Public, label: 'Public', icon: <PublicIcon width={16} height={16} /> },
    { value: ViewScopeType.Friend, label: 'Friend', icon: <AllConnectedIcon width={16} height={16} /> },
    { value: ViewScopeType.SomeOne, label: 'SomeOne', icon: <SomePeopleIcon width={16} height={16} /> },
    { value: ViewScopeType.Private, label: 'Private', icon: <OnlyMeIcon width={16} height={16} /> },
  ];

  const commentScopeOptions = [
    { value: CommentScopeType.Public, label: 'Public', icon: <PublicIcon width={16} height={16} /> },
    { value: CommentScopeType.Friend, label: 'Friend', icon: <AllConnectedIcon width={16} height={16} /> },
    { value: CommentScopeType.Private, label: 'Private', icon: <OnlyMeIcon width={16} height={16} /> },
  ];

  const handleViewScopeChange = async (value: ViewScopeType) => {
    if (value === (ViewScopeType.SomeOne as unknown as ViewScopeType)) {
      setSelectFriendsModalOpen(true);
    } else {
      try {
        const formData = new FormData();
        formData.append('viewScope', String(value));
        await updatePostMutation.mutateAsync({
          id: post._id,
          data: formData,
        });
        await refetch();
        message.success('View permission updated successfully', 3);
      } catch (error) {
        console.error('Error updating view permission:', error);
        message.error('Failed to update view permission', 3);
      }
    }
    setViewPopoverOpen(false);
  };

  const handleCommentScopeChange = async (value: CommentScopeType) => {
    try {
      const formData = new FormData();
      formData.append('commentScope', String(value));
      await updatePostMutation.mutateAsync({
        id: post._id,
        data: formData,
      });
      message.success('Comment permission updated successfully', 3);
    } catch (error) {
      console.error('Error updating comment permission:', error);
      message.error('Failed to update comment permission', 3);
    }
    setCommentPopoverOpen(false);
  };
  const handleSelectFriends = (values: { viewScope: any[] }) => {
    setSelectedValues(values);
    const formData = new FormData();
    formData.append('viewScope', String(ViewScopeType.SomeOne));
    formData.append('specificFriends', JSON.stringify(values.viewScope.map((item: UserType) => item._id)));
    updatePostMutation
      .mutateAsync({
        id: post._id,
        data: formData,
      })
      .then(async () => {
        await refetch();
        message.success('View permission updated successfully', 3);
      })
      .catch((error) => {
        console.error('Error updating view permission with friends:', error);
        message.error('Failed to update view permission', 3);
      });
    setSelectFriendsModalOpen(false);
  };
  const viewPopoverContent = (
    <div className={styles.popoverContent}>
      {viewScopeOptions.map((option) => (
        <div
          key={option.value}
          className={`${styles.popoverOption} ${post.viewScope === option.value ? styles.active : ''}`}
          onClick={() => handleViewScopeChange(option.value)}
        >
          {option.icon}
          {option.label}
        </div>
      ))}
    </div>
  );

  const commentPopoverContent = (
    <div className={styles.popoverContent}>
      {commentScopeOptions.map((option) => (
        <div
          key={option.value}
          className={`${styles.popoverOption} ${post.commentScope === option.value ? styles.active : ''}`}
          onClick={() => handleCommentScopeChange(option.value)}
        >
          {option.icon}
          {option.label}
        </div>
      ))}
    </div>
  );

  const renderTime = () => {
    const iconMap: Record<ViewScopeType, JSX.Element> = {
      [ViewScopeType.Public]: <PublicIcon width={16} height={16} />,
      [ViewScopeType.Friend]: <AllConnectedIcon width={16} height={16} />,
      [ViewScopeType.SomeOne]: <SomePeopleIcon width={16} height={16} />,
      [ViewScopeType.Private]: <OnlyMeIcon width={16} height={16} />,
      [ViewScopeType.Group]: <div></div>,
      [ViewScopeType.Course]: <div></div>,
    };

    return (
      <div
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('postId', post._id);
          router.push(`?${params.toString()}`);
        }}
        className={styles.iconTime}
      >
        {iconMap[post.viewScope]}
        <Tooltip title={<div style={{ fontSize: '10px' }}>{convertTimestampToString(post.createdAt)}</div>}>
          {time}
        </Tooltip>
      </div>
    );
  };
  const renderOptions = () => {
    return (
      <div className={styles.options}>
        <Popover
          content={viewPopoverContent}
          trigger="click"
          open={viewPopoverOpen}
          onOpenChange={setViewPopoverOpen}
          placement="right"
        >
          <div className={styles.optionItem}>
            <EyeIcon />
            <span className={styles.optionText}>Who can view</span>
            <ArrowRight />
          </div>
        </Popover>
        <Popover
          content={commentPopoverContent}
          trigger="click"
          open={commentPopoverOpen}
          onOpenChange={setCommentPopoverOpen}
          placement="right"
        >
          <div className={styles.optionItem}>
            <CommentIcon />
            <span className={styles.optionText}>Who can comment</span>
            <ArrowRight />
          </div>
        </Popover>
        <div
          onClick={() => {
            setShowConfirmDelete(true);
            setViewPopoverOpen(false);
          }}
          className={styles.optionItem}
        >
          <DeleteIcon />
          <span className={styles.optionText}>Delete</span>
        </div>
      </div>
    );
  };
  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(post._id, {
        onSuccess: async () => {
          await refetch();
          message.success('Delete post successfully', 3);
        },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  return (
    <div className={styles.header}>
      <div className={styles.wrapInfo}>
        <div onClick={() => handleClickAvatar} className={styles.avatar}>
          <Avatar shape="circle" size={56} src={post.author?.avatar}></Avatar>
        </div>
        <div className={styles.details}>
          <div className={styles.wrapName}>
            <SmartTooltip onClick={() => handleClickAvatar} text={post.author?.user_name ?? ''} />
            <div className={styles.contactStatus}>
              {post.author?.contactStatus === contactStatus.friend ||
              post.author?.contactStatus === contactStatus.none ? null : post.author?.contactStatus ===
                contactStatus.noContact ? (
                <button className={styles.followButton} onClick={handleFollow}>
                  Follow
                </button>
              ) : (
                <span>{post.author?.contactStatus === contactStatus.follower ? 'follower' : 'following'}</span>
              )}
            </div>
          </div>
          {renderTime()}
        </div>
      </div>
      <Popover content={renderOptions} trigger={'click'} placement="bottomRight">
        <Button shape="circle" icon={<EllipsisOutlined />} />
      </Popover>
      <ModalConfirm
        onOk={handleDeletePost}
        visible={showConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        onClosed={() => setShowConfirmDelete(false)}
        title="Message"
        description="Are you sure you want to delete this post?"
        textOk="Delete"
        textCancel="Cancel"
      />
      <SelectPeopleCanViewAndComment
        open={selectFriendsModalOpen}
        attachedData={{ field: 'viewScope' }}
        onClosed={() => setSelectFriendsModalOpen(false)}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        onChangeValue={setSelectedValues}
        onUpdateView={handleSelectFriends}
      />
    </div>
  );
}
