import { Avatar, Tabs, Tooltip } from 'antd';
import { useState } from 'react';
import { AngryIcon, HahaIcon, LikeIcon, LoveIcon, SadIcon, WowIcon } from '~/common/icon';
import ModalBasic from '~/components/modal/modalBasic';
import styles from './styles.module.scss';
import Button from '~/components/form/Button';
import { useRouter } from 'next/navigation';
interface User {
  _id: string;
  userId: string;
  user_name: string;
  avatar?: string;
}

interface Reaction extends User {
  reactionType: string;
}

interface Props {
  reactions: Reaction[];
  comments?: any[];
  setShowComment?: (show: boolean) => void;
}

const reactionIcons: Record<string, React.ReactNode> = {
  like: <LikeIcon fontSize={18} />,
  love: <LoveIcon fontSize={18} />,
  haha: <HahaIcon fontSize={18} />,
  wow: <WowIcon fontSize={18} />,
  sad: <SadIcon fontSize={18} />,
  angry: <AngryIcon fontSize={18} />,
};
const reactionOrder = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

export default function ReactCount({ reactions, comments, setShowComment }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const reactionGroups = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.reactionType]) {
        acc[reaction.reactionType] = [];
      }
      acc[reaction.reactionType].push({
        _id: reaction._id,
        user_name: reaction.user_name,
        avatar: reaction.avatar,
        userId: reaction.userId,
        reactionType: reaction.reactionType,
      });
      return acc;
    },
    {} as Record<string, Reaction[]>
  );

  const sortedReactionTypes = reactionOrder.filter((type) => reactionGroups[type]);
  const totalReactions = reactions.length;

  const formatTooltip = (users: User[], limit: number = 10) => {
    const displayedUsers = users.slice(0, limit); // Lấy tối đa `limit` người dùng
    const remainingCount = users.length - limit; // Số người dùng còn lại

    return (
      <div className={styles.tooltip}>
        {displayedUsers.map((user) => (
          <div key={user._id} className={styles.userName}>
            {user.user_name}
          </div>
        ))}
        {remainingCount > 0 && <div>và {remainingCount} người nữa</div>}
      </div>
    );
  };
  // Mở modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Hiển thị các biểu tượng cảm xúc
  const renderReactionIcons = () => {
    return sortedReactionTypes.map((type) => (
      <Tooltip key={type} title={formatTooltip(reactionGroups[type])}>
        <span onClick={openModal} className={styles.iconReact}>
          {reactionIcons[type]}
        </span>
      </Tooltip>
    ));
  };

  // Hiển thị tổng số lượt thả
  const renderTotalCount = () =>
    totalReactions > 0 && (
      <Tooltip title={formatTooltip(reactions)}>
        <span onClick={openModal} style={{ cursor: 'pointer' }}>
          {totalReactions}
        </span>
      </Tooltip>
    );
  const renderUserList = (users: Reaction[]) => (
    <div className="flex flex-col gap-4 min-h-[300px]">
      {users.map((user, index) => (
        <div key={index} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center relative">
              <Avatar size={45} src={user.avatar} className={styles.avatar} />
              <div className="mt-1 absolute bottom-0 right-0">{reactionIcons[user.reactionType]}</div>
            </div>
            <div>{user.user_name}</div>
          </div>
          <Button className="rounded-[50px]" onClick={() => handleViewProfile(user.userId)}>
            View profile
          </Button>
        </div>
      ))}
    </div>
  );
  // Hiển thị nội dung modal với các tab
  const renderModalContent = () => (
    <Tabs defaultActiveKey="all">
      <Tabs.TabPane tab={<span>Tất cả</span>} key="all">
        {renderUserList(reactions)}
      </Tabs.TabPane>
      {sortedReactionTypes.map((type) => (
        <Tabs.TabPane tab={<span>{reactionIcons[type]}</span>} key={type}>
          {renderUserList(reactionGroups[type])}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );

  return (
    <div className="flex items-center justify-between gap-2">
      <div className={styles.reactionCount}>
        {renderReactionIcons()}
        {renderTotalCount()}
      </div>
      {comments && (
        <div className={styles.commentCount}>
          <span onClick={() => setShowComment?.(true)} style={{ cursor: 'pointer' }}>
            {comments.length} bình luận
          </span>
        </div>
      )}

      <ModalBasic
        title="Chi tiết lượt thả cảm xúc"
        visible={isModalVisible}
        onClosed={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        {renderModalContent()}
      </ModalBasic>
    </div>
  );
}

export enum ReactionType {
  Like = 'like',
  Love = 'love',
  Haha = 'haha',
  Wow = 'wow',
  Sad = 'sad',
  Angry = 'angry',
}
