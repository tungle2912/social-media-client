/* eslint-disable react-hooks/rules-of-hooks */
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Input, Dropdown, Menu, Popover } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { UserRole } from '~/definitions/enums/index.enum';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '~/hooks/data/comment.data';
import { useReactPostMutation } from '~/hooks/data/post.data';
import { commentApi } from '~/services/api/comment.api';
import useLoadingStore from '~/stores/loading.store';
import { LikeIcon, LoveIcon, HahaIcon, WowIcon, SadIcon, AngryIcon, LikeIconButton } from '~/common/icon';
import ReactCount from '~/modules/profile/postItems/reactCount';
import styles from './styles.module.scss';
import { UserType } from '~/definitions';

interface IProps {
  postId: string;
  initialComments?: Comment[];
  focusCommentId?: string;
}

export default function CommentComponent({ postId, initialComments = [], focusCommentId }: IProps) {
  const { data: dataSession } = useSession();
  const user = dataSession?.user as UserType;
  const router = useRouter();
  const t = useTranslations();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const focusedCommentRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoadingStore();
  const queryClient = useQueryClient();
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => commentApi.getComments(postId, pageParam, 10).then((res) => res.data),
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    initialData: initialComments.length > 0 ? { pages: [{ comments: initialComments }], pageParams: [1] } : undefined,
    initialPageParam: 1,
  });

  const createComment = useCreateCommentMutation(postId);
  const deleteComment = useDeleteCommentMutation(postId);
  const updateComment = useUpdateCommentMutation(postId);

  useEffect(() => {
    if (focusCommentId && focusedCommentRef.current) {
      focusedCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      focusedCommentRef.current.style.backgroundColor = '#f0f2ff';
      setTimeout(() => (focusedCommentRef.current!.style.backgroundColor = ''), 2000);
    }
  }, [focusCommentId]);

  const canEditDelete = useCallback(
    (commentAuthor: any) => user?.role === UserRole.Admin || user?._id === commentAuthor._id,
    [user]
  );

  const handleCreateComment = async (content: string, parentId: string | null = null) => {
    try {
      const mentions = extractMentions(content);
      await createComment.mutateAsync(
        {
          postId,
          content,
          parentId,
          mentions,
        },
        {
          onSuccess: async () => {
            await refetch();
          },
        }
      );
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      setLoading(true);
      await updateComment.mutateAsync(
        { commentId, data: { content } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const extractMentions = (content: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const mentions: { username: string; userId: string }[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push({ username: match[1], userId: match[2] });
    }
    return mentions;
  };

  const renderCommentContent = (content: string): JSX.Element | JSX.Element[] => {
    if (!content) {
      return <span>No content</span>;
    }
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <span
            key={index}
            className="text-blue-600  cursor-pointer hover:underline"
            onClick={() => router.push(`/profile/${match[2]}`)}
          >
            @{match[1]}
          </span>
        );
      }
      return (
        <span className="text-lg" key={index}>
          {part}
        </span>
      );
    });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComments = (comments: any[], level = 0, isRoot = true) => {
    return comments.map((comment) => {
      if (isRoot && comment.parentId) return null;
      return (
        <div key={comment._id}>
          <CommentItem
            comment={comment}
            level={level}
            handleUpdateComment={handleUpdateComment}
            handleDeleteComment={handleDeleteComment}
            handleCreateComment={handleCreateComment}
            postId={postId}
            renderCommentContent={renderCommentContent}
            canEditDelete={canEditDelete}
            ref={comment._id === focusCommentId ? focusedCommentRef : null}
          />
          {comment.comments?.length > 0 && (
            <div>
              {expandedComments[comment._id] && <div>{renderComments(comment.comments, level + 1, false)}</div>}
              <Button type="link" onClick={() => toggleReplies(comment._id)}>
                {expandedComments[comment._id] ? 'Ẩn phản hồi' : `Xem tất cả ${comment.comments.length} phản hồi`}
              </Button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="comment-section bg-white p-4 rounded-lg">
      {commentsData?.pages?.map((page, i) => <div key={i}>{renderComments(page.comments, 0, true)}</div>)}
      {hasNextPage && (
        <Button className="mt-4 w-full text-gray-600" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
          Load More Comments
        </Button>
      )}
      <div className="mt-4">
        <CommentForm onSubmit={(content) => handleCreateComment(content)} />
      </div>
    </div>
  );
}

const CommentItem = ({
  comment,
  level,
  handleUpdateComment,
  handleDeleteComment,
  handleCreateComment,
  postId,
  renderCommentContent,
  canEditDelete,
  ref,
}: {
  comment: any;
  level: number;
  handleUpdateComment: (commentId: string, content: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleCreateComment: (content: string, parentId?: string | null) => void;
  postId: string;
  renderCommentContent: any;
  canEditDelete: (commentAuthor: any) => boolean;
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { data: dataSession } = useSession();
  const user = dataSession?.user;
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [localReaction, setLocalReaction] = useState(comment.currentUserReaction || '');
  const reactPostMutation = useReactPostMutation();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalReaction(comment.currentUserReaction || '');
  }, [comment.currentUserReaction]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);
  const handleReactionClick = (reactionType: any) => {
    const previousReaction = localReaction;
    const newReaction = reactionType === previousReaction ? '' : reactionType;
    setLocalReaction(newReaction);
    timeoutId.current = setTimeout(() => {
      reactPostMutation.mutate(
        {
          targetId: comment._id,
          reactionType: newReaction,
          targetType: 1, // 1 for comments
        },
        {
          onSuccess: () => {},
          onError: () => {
            setLocalReaction(previousReaction);
          },
        }
      );
    }, 500);
  };

  const reactionIcons: Record<string, ReactNode> = {
    like: <LikeIcon />,
    love: <LoveIcon />,
    haha: <HahaIcon />,
    wow: <WowIcon />,
    sad: <SadIcon />,
    angry: <AngryIcon />,
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
    <div ref={ref} className="p-3 bg-white" style={{ marginLeft: `${level * 40}px` }}>
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.author.avatar}
          size={32}
          onClick={() => router.push(`/profile/${comment.author._id}`)}
          className="cursor-pointer"
        />
        <div className="flex-1">
          <div className="rounded-[8px] bg-gray-100 px-3 py-1 flex items-center justify-between">
            <div>
              <div className="flex items-center justify-start ">
                <span className="font-semibold text-sm text-gray-900">{comment.author.user_name}</span>
                <div className="ml-2 text-xs text-gray-500">
                  {dayjs(comment.createdAt).format('MMM D, YYYY h:mm A')}
                  {comment.updatedAt > comment.createdAt && ' (edited)'}
                </div>
              </div>
              {editing ? (
                <EditCommentForm
                  initialContent={comment.content}
                  onCancel={() => setEditing(false)}
                  onSave={(content: any) => {
                    handleUpdateComment(comment._id, content);
                    setEditing(false);
                  }}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-800 mt-1">{renderCommentContent(comment.content)}</div>
                </div>
              )}
            </div>
            {canEditDelete(comment.author) && (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={() => setEditing(true)}>
                      Edit
                    </Menu.Item>
                    <Menu.Item key="delete" onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button type="text" icon={<MoreOutlined />} size="small" className="text-gray-500" />
              </Dropdown>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
            <Popover content={reactionPopoverContent} trigger="hover" placement="top">
              <Button
                type="text"
                onClick={() => handleReactionClick(localReaction || 'like')}
                icon={localReaction ? reactionIcons[localReaction] : <LikeIconButton />}
                className={styles.actionButton}
              >
                {localReaction ? localReaction.charAt(0).toUpperCase() + localReaction.slice(1) : 'Like'}
              </Button>
            </Popover>
            <span className="cursor-pointer hover:underline" onClick={() => setReplying(true)}>
              Reply
            </span>
            {comment.reactions && comment.reactions.length > 0 && <ReactCount reactions={comment.reactions} />}
          </div>
          {replying && (
            <div className="mt-2">
              <CommentForm
                onSubmit={(content: any, parentId: any) => handleCreateComment(content, parentId)}
                mentionTag={`@${comment.author.user_name}`}
                parentId={comment._id}
                onCancel={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({
  onSubmit,
  mentionTag = '',
  parentId = null,
  onCancel,
}: {
  onSubmit: (content: string, parentId?: string | null) => void;
  mentionTag?: string;
  parentId?: string | null;
  onCancel?: () => void;
}) => {
  const [content, setContent] = useState(mentionTag);
  const { data: dataSession } = useSession();
  const user = dataSession?.user as any;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, parentId);
      setContent('');
      if (onCancel) onCancel();
    }
  };

  return (
    <div className="flex gap-3 items-start">
      <Avatar src={user?.avatar ?? ''} size={32} />
      <div className="flex-1">
        <Input.TextArea
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          rows={2}
          autoSize={{ minRows: 2, maxRows: 5 }}
          className="rounded-lg bg-gray-100 border-none"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        {parentId && (
          <div className="mt-2 flex justify-end gap-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Reply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditCommentForm = ({ initialContent, onCancel, onSave }: { initialContent: any; onCancel: any; onSave: any }) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col gap-2">
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoSize={{ minRows: 2, maxRows: 5 }}
        className="rounded-lg bg-gray-100 border-none"
      />
      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={() => onSave(content)}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
