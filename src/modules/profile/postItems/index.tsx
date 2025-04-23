import { Button } from 'antd';
import { CommentIcon, LikeIcon, MoreIcon, ShareIcon } from '~/common/icon';
import { IPost, PostMedia } from '~/definitions/interfaces/post.interface';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import styles from './styles.module.scss';
import { useAuthStore } from '~/stores/auth.store';
import ContentPost from '~/modules/profile/postItems/contentPost';
interface PostItemProps {
  post: IPost;
}
function PostItem({ post }: PostItemProps) {
  const { user } = useAuthStore();
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
  return (
    <div className={styles.postItem}>
      <HeaderPost isMyPost={post.authorId === user?._id} post={post}></HeaderPost>
      <ContentPost
        content={post.content}
        postMedias={[...(post.media?.map(parseMedia) || []), ...(post.attachments?.map(parseMedia) || [])]}
      />
      <div className={styles.actions}>
        <Button type="text" icon={<LikeIcon />} className={styles.actionButton}>
          Like
        </Button>
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
