import {
  EllipsisOutlined
} from "@ant-design/icons";
import { Avatar, Button, Tooltip } from "antd";
import { CommentIcon, LikeIcon, MoreIcon, ShareIcon } from "~/common/icon";
import styles from "./styles.module.scss";
interface PostItemProps {
  name: string;
  timeAgo: string;
  content: string;
  image?: string;
}
function PostItem({ name, image, timeAgo, content }: PostItemProps) {
  return (
    <div className={styles.postItem}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar src={image||"https://res.cloudinary.com/dflvvu32c/image/upload/v1724205205/cd4bd9b0ea2807611ba3a67c331bff0b_pjwbyx.png"} className={styles.avatar}></Avatar>
          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{name}</h3>
              <span className={styles.following}>Following</span>
              <span className={styles.connected}>• Connected</span>
            </div>
            <p className={styles.timeAgo}>{timeAgo}</p>
          </div>
        </div>
        <Tooltip title="More options">
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </Tooltip>
      </div>
      <div className={styles.content}>
        <p>{content}</p>
      </div>
      <div className={styles.actions}>
        <Button type="text" icon={<LikeIcon />} className={styles.actionButton}>
          Like
        </Button>
        <Button
          type="text"
          icon={<CommentIcon />}
          className={styles.actionButton}
        >
          Comment
        </Button>
        <Button
          type="text"
          icon={<ShareIcon />}
          className={styles.actionButton}
        >
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
