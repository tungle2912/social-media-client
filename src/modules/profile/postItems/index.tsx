import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Button, Divider, Popover } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AngryIcon,
  CommentIcon,
  ForwardIcon,
  HahaIcon,
  LikeIcon,
  LikeIconButton,
  LoveIcon,
  MoreIcon,
  RepostIcon,
  SadIcon,
  ShareIcon,
  WowIcon,
} from '~/common/icon';
import { IPost, PostMedia } from '~/definitions/interfaces/post.interface';
import { useGetPostByIdQuery, useReactPostMutation } from '~/hooks/data/post.data';
import ContentPost from '~/modules/profile/postItems/contentPost';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import ReactCount from '~/modules/profile/postItems/reactCount';
import { useAuthStore } from '~/stores/auth.store';
import styles from './styles.module.scss';
import CommentComponent from '~/modules/profile/postItems/PostComment';
import classNames from 'classnames';
import { ModalRePost } from '~/modules/profile/modalRepost';
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
  openComment?: boolean;
}
function PostItem({ post, refetch, openComment = false }: PostItemProps) {
  const { user } = useAuthStore();
  const reactPostMutation = useReactPostMutation();
  const [localReaction, setLocalReaction] = useState(post.currentUserReaction || '');
  const { data: postDetail } = useGetPostByIdQuery(post.embeddedPost);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [showComment, setShowComment] = useState(openComment);
  const [showModalRepost, setShowModalRepost] = useState(false);
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
  const reactionIcons: Record<string, React.ReactNode> = useMemo(
    () => ({
      like: <LikeIcon />,
      love: <LoveIcon />,
      haha: <HahaIcon />,
      wow: <WowIcon />,
      sad: <SadIcon />,
      angry: <AngryIcon />,
    }),
    []
  );

  const handleReactionClick = useCallback(
    (reactionType: string) => {
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
    },
    [post._id, reactPostMutation, refetch]
  );

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
  const sharePopoverContent = (
    <div className={classNames('flex flex-col gap-3 py-2', styles.sharePopover)}>
      <Button
        type="text"
        icon={<ShareIcon />}
        className="w-[150px] flex items-center gap-5 justify-start px-2 py-2 align-self-center"
      >
        Share
      </Button>
      <Button
        onClick={() => {
          setShowModalRepost(true);
          setShareVisible(false);
        }}
        type="text"
        icon={<RepostIcon />}
        className="w-[150px] flex items-center gap-5 justify-start px-2 py-2"
      >
        Repost
      </Button>
      <Button type="text" icon={<ForwardIcon />} className="w-[150px] flex items-center gap-5 justify-start px-2 py-2">
        Forward
      </Button>
    </div>
  );
  return (
    <div className={styles.postItem}>
      <HeaderPost refetch={refetch} isMyPost={post?.author?._id === user?._id} post={post}></HeaderPost>
      <ContentPost
        content={post.content}
        postMedias={[...(post.media?.map(parseMedia) || []), ...(post?.attachments?.map(parseFile) || [])]}
      />
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
        <Button
          type="text"
          icon={<CommentIcon />}
          onClick={() => setShowComment((prev) => !prev)}
          className={styles.actionButton}
        >
          Comment
        </Button>
        <Popover
          open={shareVisible}
          onOpenChange={(visible) => setShareVisible(visible)}
          content={sharePopoverContent}
          trigger="click"
          placement="bottom"
        >
          <Button type="text" icon={<ShareIcon />} className={styles.actionButton}>
            Share
          </Button>
        </Popover>
        <Button type="text" icon={<MoreIcon />} className={styles.actionButton}>
          More
        </Button>
      </div>
      {showComment && <CommentComponent postId={post._id} />}
      <ModalRePost
        isOpenModal={showModalRepost}
        refetch={refetch}
        setIsOpenModal={setShowModalRepost}
        embeddedPost={post._id}
      />
    </div>
  );
}

export default PostItem;
