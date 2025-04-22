import { Avatar, Button, Tooltip } from 'antd';
import styles from './styles.module.scss';
import { EllipsisOutlined } from '@ant-design/icons';
import { IPost } from '~/definitions/interfaces/post.interface';
import { convertTimestampToString, convertTimeStampToStringDate } from '~/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import SmartTooltip from '~/common/smartTooltip';
import { ViewScopeType } from '~/definitions/enums/index.enum';
import { AllConnectedIcon, OnlyMeIcon, PublicIcon, SomePeopleIcon } from '~/common/icon';
interface Props {
  post: IPost;
  isMyPost: boolean;
}
export default function HeaderPost({ post, isMyPost }: Props) {
  const time = convertTimeStampToStringDate(post.createdAt);
  const router = useRouter();
  const pathname = usePathname();
  const isProfilePage = pathname?.includes('/profile/');
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
  return (
    <div className={styles.header}>
      <div className={styles.wrapInfo}>
        <div onClick={() => handleClickAvatar} className={styles.avatar}>
          <Avatar shape="circle" size={56} src={post.author?.avatar}></Avatar>
        </div>
        <div className={styles.details}>
          <div className={styles.wrapName}>
            <SmartTooltip onClick={() => handleClickAvatar} text={post.author?.user_name ?? ''} />
            {!isProfilePage && !isMyPost && (
              <div className={styles.friendStatus}>{post.isFriend ? 'Friend' : 'Add friend'}</div>
            )}
          </div>
          {renderTime()}
        </div>
      </div>
      <Tooltip title="More options">
        <Button shape="circle" icon={<EllipsisOutlined />} />
      </Tooltip>
    </div>
  );
}
