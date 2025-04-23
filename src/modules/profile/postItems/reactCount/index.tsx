import { Tabs, Tooltip } from 'antd';
import { useState } from 'react';
import { AngryIcon, HahaIcon, LikeIcon, LoveIcon, SadIcon, WowIcon } from '~/common/icon';
import ModalBasic from '~/components/modal/modalBasic';
import styles from './styles.module.scss';
interface User {
  _id: string;
  user_name: string;
}

interface Reaction extends User {
  reactionType: string;
}

interface Props {
  reactions: Reaction[];
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
export default function ReactCount({ reactions }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const reactionGroups = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.reactionType]) {
        acc[reaction.reactionType] = [];
      }
      acc[reaction.reactionType].push({ _id: reaction._id, user_name: reaction.user_name });
      return acc;
    },
    {} as Record<string, User[]>
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

  // Hiển thị nội dung modal với các tab
  const renderModalContent = () => (
    <Tabs defaultActiveKey="all">
      <Tabs.TabPane tab="Tất cả" key="all">
        <div>
          {reactions.map((reaction) => (
            <div key={reaction._id}>{reaction.user_name}</div>
          ))}
        </div>
      </Tabs.TabPane>
      {sortedReactionTypes.map((type) => (
        <Tabs.TabPane tab={type} key={type}>
          <div>
            {reactionGroups[type].map((user) => (
              <div key={user._id}>{user.user_name}</div>
            ))}
          </div>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );

  return (
    <div>
      <div className={styles.reactionCount}>
        {renderReactionIcons()}
        {renderTotalCount()}
      </div>
      <ModalBasic
        title="Chi tiết lượt thả cảm xúc"
        visible={isModalVisible}
        onClosed={closeModal}
        onCancel={closeModal}
        footer={null}
        width={400}
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
