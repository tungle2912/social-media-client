import { Button } from 'antd';
import { CommentIcon, LikeIcon, MoreIcon, ShareIcon } from '~/common/icon';
import { IPost } from '~/definitions/interfaces/post.interface';
import HeaderPost from '~/modules/profile/postItems/headerPost';
import styles from './styles.module.scss';
import { useAuthStore } from '~/stores/auth.store';
interface PostItemProps {
  post: IPost;
}
function PostItem({ post }: PostItemProps) {
  const { user } = useAuthStore();
  return (
    <div className={styles.postItem}>
      <HeaderPost isMyPost={post.authorId === user?._id} post={post}></HeaderPost>
      <div className={styles.content}>
        <p>{post.content}</p>
      </div>
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
