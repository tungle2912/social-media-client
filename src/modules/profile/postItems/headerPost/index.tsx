'use client';
import { EllipsisOutlined } from '@ant-design/icons';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Avatar, Button, message, Popover, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AllConnectedIcon, DeleteIcon, OnlyMeIcon, PublicIcon, SomePeopleIcon } from '~/common/icon';
import SmartTooltip from '~/common/smartTooltip';
import ModalConfirm from '~/components/modal/modalConfirm';
import { ViewScopeType } from '~/definitions/enums/index.enum';
import { IPost } from '~/definitions/interfaces/post.interface';
import { useDeletePostMutation } from '~/hooks/data/post.data';
import { convertTimestampToString, convertTimeStampToStringDate } from '~/lib/utils';
import styles from './styles.module.scss';
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const deletePostMutation = useDeletePostMutation();
  const handleClickAvatar = (id: string) => {
    router.push(`/profile/${id}`);
  };

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
      <div className={styles.iconTime}>
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
        <div onClick={() => setShowConfirmDelete(true)} className={styles.optionItem}>
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
            {/* {!isProfilePage && !isMyPost && (
              <div className={styles.friendStatus}>{post.isFriend ? 'Friend' : 'Add friend'}</div>
            )} */}
          </div>
          {renderTime()}
        </div>
      </div>
      <Popover  content={renderOptions} trigger={'click'} placement="bottomRight">
        <Button shape="circle" icon={<EllipsisOutlined />} />
      </Popover>
      <ModalConfirm
        onOk={handleDeletePost}
        visible={showConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        onClosed={() => setShowConfirmDelete(false)}
        title='Message'
        description='Are you sure you want to delete this post?'
        textOk='Delete'
        textCancel='Cancel'
      />
    </div>
  );
}
