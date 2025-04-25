import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Button, Divider, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  AngryIcon,
  CommentIcon,
  HahaIcon,
  LikeIcon,
  LikeIconButton,
  LoveIcon,
  MoreIcon,
  SadIcon,
  ShareIcon,
  WowIcon,
} from '~/common/icon';
import { IPost, PostMedia } from '~/definitions/interfaces/post.interface';
import { useReactPostMutation } from '~/hooks/data/post.data';
import ContentPost from '~/modules/profile/postItems/contentPost';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import ReactCount from '~/modules/profile/postItems/reactCount';
import { useAuthStore } from '~/stores/auth.store';
import styles from './styles.module.scss';
interface PostItemProps {
  post: IPost;
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
function PostItem({ post, refetch }: PostItemProps) {
  const { user } = useAuthStore();
  const reactPostMutation = useReactPostMutation();
  const [localReaction, setLocalReaction] = useState(post.currentUserReaction || '');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
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
  useEffect(() => {
    setLocalReaction(post.currentUserReaction || '');
  }, [post.currentUserReaction]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);
  const reactionIcons: Record<string, React.ReactNode> = {
    like: <LikeIcon />,
    love: <LoveIcon />,
    haha: <HahaIcon />,
    wow: <WowIcon />,
    sad: <SadIcon />,
    angry: <AngryIcon />,
  };
  const handleReactionClick = (reactionType: string) => {
    const previousReaction = localReaction;
    const newReaction = reactionType === previousReaction ? '' : reactionType;
    setLocalReaction(newReaction);
    setPopoverVisible(false);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      reactPostMutation.mutate(
        {
          targetId: post._id,
          reactionType: reactionType,
          targetType: 0,
        },
        {
          onSuccess: async () => {
            await refetch();
          },
          onError: () => {
            setLocalReaction(previousReaction);
          },
        }
      );
    }, 500);
  };

  const reactionPopoverContent = (
    <div className={styles.reactionPopover}>
      {['like', 'love', 'haha', 'wow', 'sad', 'angry'].map((reaction) => (
        <Button
          key={reaction}
          type="text"
          icon={reactionIcons[reaction]}
          onClick={() => handleReactionClick(reaction)}
          className={styles.reactionButton}
        />
      ))}
    </div>
  );
  return (
    <div className={styles.postItem}>
      <HeaderPost refetch={refetch} isMyPost={post.authorId === user?._id} post={post}></HeaderPost>
      <ContentPost
        content={post.content}
        postMedias={[...(post.media?.map(parseMedia) || []), ...(post.attachments?.map(parseMedia) || [])]}
      />
      <div className={styles.metaDataPost}>
        <ReactCount reactions={post.reactions || []} />
      </div>
      <Divider />
      <div className={styles.actions}>
        <Popover
          content={reactionPopoverContent}
          trigger="hover"
          placement="top"
          open={popoverVisible}
          onOpenChange={(visible) => setPopoverVisible(visible)}
        >
          <Button
            type="text"
            onClick={() => handleReactionClick(localReaction || 'like')}
            icon={localReaction ? reactionIcons[localReaction] : <LikeIconButton />}
            className={styles.actionButton}
          >
            {localReaction ? localReaction.charAt(0).toUpperCase() + localReaction.slice(1) : 'Like'}
          </Button>
        </Popover>
        <Button type="text" icon={<CommentIcon />} className={styles.actionButton}>
          Comment
        </Button>
        <Button type="text" icon={<ShareIcon />} className={styles.actionButton}>
          Share
        </Button>
        <Button type="text" icon={<MoreIcon />} className={styles.actionButton}>
          More
        </Button>
      </div>
    </div>
  );
}

export default PostItem;
