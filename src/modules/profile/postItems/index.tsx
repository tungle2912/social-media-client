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
import { useSearchParams } from 'next/navigation';
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
import ModalForward from '~/modules/profile/postItems/modalForward';
import { useDimension } from '~/hooks';
import Image from 'next/image';
import { parseFile, parseMedia } from '~/lib/helper';
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
  isPreview?: boolean;
  commentId?: string;
}
function PostItem({ post, refetch, openComment = false, isPreview = false, commentId }: PostItemProps) {
  const { user } = useAuthStore();
  const reactPostMutation = useReactPostMutation();
  const [localReaction, setLocalReaction] = useState(post.currentUserReaction || '');
  const { data: postDetail } = useGetPostByIdQuery(post.embeddedPost);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [showComment, setShowComment] = useState(openComment);
  const [showModalRepost, setShowModalRepost] = useState(false);
  const [openForward, setOpenForward] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { isSM } = useDimension();
  const roomId = searchParams.get('roomId');
  const isForward = useMemo(() => {
    return !!roomId;
  }, [roomId]);

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
      {/* <Button
        type="text"
        icon={<ShareIcon />}
        className="w-[150px] flex items-center gap-5 justify-start px-2 py-2 align-self-center"
      >
        Share
      </Button> */}
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
      <Button
        type="text"
        icon={<ForwardIcon />}
        onClick={() => {
          setOpenForward(true);
          setShareVisible(false);
        }}
        className="w-[150px] flex items-center gap-5 justify-start px-2 py-2"
      >
        Forward
      </Button>
    </div>
  );
  return isForward && isSM && postDetail?.result ? (
    <div className="flex justify-center items-center bg-gray-600 rounded-[10px] p-2 h-[120px]">
      <button className="text-white" onClick={() => window.open(`/post/${post._id}`, '_blank')}>
        <Image
          alt="logo"
          width={200}
          height={100}
          src="https://res.cloudinary.com/dflvvu32c/image/upload/v1745035787/logo_wjj1t5.png"
          className={styles.logo}
        />
        Nhấn để xem bài viết
      </button>
    </div>
  ) : (
    <div className={classNames(styles.postItem, isForward && styles.postItemForward)}>
      <HeaderPost refetch={refetch} isMyPost={post?.author?._id === user?._id && !isPreview} post={post}></HeaderPost>
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
      {!isPreview && (
        <>
          <div className={styles.metaDataPost}>
            <ReactCount reactions={post.reactions || []} comments={post.comments} />
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
          {showComment && <CommentComponent focusCommentId={commentId} postId={post._id} />}
          {showModalRepost && (
            <ModalRePost
              isOpenModal={showModalRepost}
              refetch={refetch}
              setIsOpenModal={setShowModalRepost}
              embeddedPost={post._id}
            />
          )}
          {openForward && (
            <ModalForward
              open={openForward}
              onClose={() => setOpenForward(false)}
              name={post?.author?.user_name}
              avatar={post?.author?.avatar}
              postId={post?._id}
            />
          )}
        </>
      )}
    </div>
  );
}

export default PostItem;
