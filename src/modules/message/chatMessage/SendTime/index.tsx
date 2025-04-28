import { Avatar, Flex, Popover, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'use-intl';

import styles from './styles.module.scss';
import { ConversationType } from '~/definitions/models/message';
import { IconRead, IconSent } from '~/common/icon';
import { getUsername } from '~/services/helpers';
import SmartTooltip from '~/common/smartTooltip';

interface SendTimeProps {
  createdAt: string;
  isRead: boolean;
  isOwn: boolean;
  lastMsg?: boolean;
  deliveredByUsers?: any;
  readByUsers?: any;
  dataConversation: any;
}
const SendTime = ({
  createdAt,
  isRead,
  isOwn,
  deliveredByUsers,
  readByUsers,
  lastMsg = false,
  dataConversation,
}: SendTimeProps) => {
  const t = useTranslations();
  return (
    <Flex className="mt-2 text-right" justify="end" align="center">
      <span className="text-xs mr-2 text-[#636363]">
        <Tooltip
          rootClassName={styles.tooltipTime}
          placement="bottom"
          title={<span className="text-[10px]">{dayjs(createdAt).format('HH:mm MMMM DD, YYYY')}</span>}
        >
          {dayjs(createdAt).format('HH:mm')}
        </Tooltip>
      </span>
      {isOwn && lastMsg && (
        <span>
          {isRead ? (
            dataConversation?.type === ConversationType.GROUP_CHAT ? (
              <Popover
                content={
                  <div className="w-[395px] max-h-[400px] overflow-auto">
                    <div className="flex items-center gap-[10px] mb-[16px]">
                      <IconRead />
                      <p>Read by</p>
                    </div>
                    <div className="mb-[18px]">
                      {readByUsers?.map((item: any, index: any) => {
                        return (
                          <div key={index} className="flex items-center gap-[8px]">
                            <div>
                              {item?.basicPersonalInfo?.profilePhoto ? (
                                <Avatar
                                  src={item?.basicPersonalInfo?.profilePhoto || ''}
                                  alt={t('avatar')}
                                  className={styles.avatar}
                                />
                              ) : (
                                <div className={styles.avatar}>{getUsername(item?.basicPersonalInfo, true)}</div>
                              )}
                            </div>
                            <SmartTooltip
                              className="text-sm not-italic font-normal leading-[24px] max-w-[300px] text-[#636363]"
                              text={getUsername(item?.basicPersonalInfo)}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-[10px] mb-[16px]">
                      <IconSent />
                      <p>{t('message.deliveredBy')}</p>
                    </div>
                    <div>
                      {deliveredByUsers?.map((item: any, index: any) => {
                        return (
                          <div key={index} className="flex items-center gap-[8px]">
                            <div>
                              {item?.basicPersonalInfo?.profilePhoto ? (
                                <Avatar
                                  src={item?.basicPersonalInfo?.profilePhoto || ''}
                                  alt={t('avatar')}
                                  className={styles.avatarSeenUser}
                                />
                              ) : (
                                <div className={styles.avatarSeenUser}>
                                  {getUsername(item?.basicPersonalInfo, true)}
                                </div>
                              )}
                            </div>
                            <SmartTooltip
                              className="text-sm not-italic font-normal leading-[24px] max-w-[300px] text-[#636363]"
                              text={getUsername(item?.basicPersonalInfo)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                }
                placement="bottomRight"
                arrow={false}
              >
                <div>
                  <IconRead />
                </div>
              </Popover>
            ) : (
              <IconRead />
            )
          ) : (
            <IconSent />
          )}
        </span>
      )}
    </Flex>
  );
};
export default SendTime;
