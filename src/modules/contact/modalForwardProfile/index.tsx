import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Empty, Input, Spin } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CheckSuccessIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import ModalBasic from '~/components/modal/modalBasic';
import { messageType } from '~/definitions/enums/index.enum';
import { SearchParams } from '~/definitions/interfaces/interface';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationType } from '~/definitions/models/message';
import { useCreateMessageMutation } from '~/hooks/data/conservation.data';
import { messageApi } from '~/services/api/message.api';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';

interface IPropsModalForward {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ModalForwardProfile = ({ open, onClose, userId }: IPropsModalForward) => {
  const t = useTranslations();
  const [valueMsg, setValueMsg] = useState<string>('');
  const [valueSearch, setValueSearch] = useState<string>('');
  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [params, setParams] = useState<SearchParams>({ pageIndex: 1, pageSize: 10 });
  const listOnline = useListOnline((state) => state.listOnline);
  const {
    data: listMessages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch: refetchListMessage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LIST_RECENT_MESSAGE, params],
    queryFn: ({ pageParam }) => {
      const cloneParams = { ...params, pageIndex: pageParam };

      return messageApi.getConversationRecentMessage(cloneParams);
    },
    getNextPageParam: (lastPage: any) => {
      const nextPage = lastPage.pageIndex < lastPage?.totalPages ? lastPage.pageIndex + 1 : undefined;
      return nextPage;
    },
    // cacheTime: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    initialPageParam: 1,
  });

  const _listContact = useMemo(() => {
    const oldData = listMessages?.pages.flatMap((page: any) => page.data) || [];
    return oldData?.map((item) => {
      item.isOnline = Array.from(listOnline).includes(item?.partner?._id) || false;
      return item;
    });
  }, [listMessages?.pages, listOnline]);
  const createMessageMutation = useCreateMessageMutation();

  const serviceLoadMore = () => {
    if (!hasNextPage || isLoading || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  const handleSearch = (e: any) => {
    setValueSearch(e.target.value);
    setParams({ ...params, search: e.target.value });
  };

  return (
    <>
      <ModalBasic
        width={560}
        visible={open}
        onClosed={onClose}
        title={<p className="text-2xl not-italic font-bold text-center text-[#3E3E3E]">{'Forward post'}</p>}
        closeIcon={false}
        className={styles.modalStyle}
      >
        <div className="w-full min-h-[48px] relative rounded-[10px] py-[10px] bg-[#F8F8FF]">
          <Input.TextArea
            maxLength={300}
            value={valueMsg}
            onChange={(e) => {
              setValueMsg(e?.target?.value);
            }}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder={t('typeHere')}
            className={styles.inputMessage}
          />
        </div>
        <InputSearch
          className="mt-[24px]"
          value={valueSearch}
          onChange={(e) => {
            handleSearch(e);
          }}
          placeholder={t('searchPeopleAndGroup')}
        />
        {_listContact?.length > 0 ? (
          <InfiniteScroll
            className="scroll-bar flex flex-col gap-[12px] mt-[12px] "
            dataLength={_listContact.length || 0}
            next={serviceLoadMore}
            hasMore={!!hasNextPage}
            loader={
              isLoading || isFetchingNextPage ? (
                <div className="text-center">
                  <Spin />
                </div>
              ) : null
            }
            height={422}
          >
            {_listContact?.map((contact) => {
              return (
                <div key={contact?.id} className={styles.userItem}>
                  <div className="flex gap-[12px] items-center">
                    <div className="relative">
                      <Avatar
                        className="bg-[#fff0f6] w-[56px] h-[56px]"
                        src={
                          contact?.type === ConversationType.GROUP_CHAT
                            ? contact?.avatar
                            : contact.partner?.avatar || ''
                        }
                      >
                        {(contact?.type !== ConversationType.GROUP_CHAT && !contact.partner?.avatar) ||
                        (contact?.type === ConversationType.GROUP_CHAT && !contact?.avatar) ? (
                          <span className="text-[#eb2f96] text-base font-bold">
                            {contact?.type === ConversationType.GROUP_CHAT
                              ? contact?.title?.charAt(0)
                              : contact.partner?.title?.charAt(0)}
                          </span>
                        ) : null}
                      </Avatar>

                      {contact?.isOnline && (
                        <div
                          className={classNames(styles.status, styles.online, 'absolute right-[2px] bottom-0')}
                        ></div>
                      )}
                      {!contact?.isOnline && contact?.type !== ConversationType.GROUP_CHAT && (
                        <div className={classNames(styles.status, styles.offline, 'absolute right-[2px] bottom-0')} />
                      )}
                    </div>
                    <SmartTooltip
                      className="text-[#3E3E3E] font-bold "
                      text={
                        contact?.type === ConversationType.DIRECT_MESSAGE ? contact?.partner?.user_name : contact?.title
                      }
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append('message', valueMsg);
                      formData.append('conversationId', contact?._id);
                      formData.append('type', messageType.Profile.toString());
                      formData.append('additionalData', `${userId}`);
                      await createMessageMutation.mutateAsync(formData, {
                        onSuccess: () => {
                          setOpenMessage(true);
                          setValueMsg('');
                        },
                      });
                    }}
                    className={classNames(styles.btnSend)}
                  >
                    {t('send')}
                  </Button>
                </div>
              );
            })}
          </InfiniteScroll>
        ) : (
          <div className="h-[422px] mt-[12px] flex items-center justify-center">
            <Empty description={t('noFriendToSharePosts')} />
          </div>
        )}
      </ModalBasic>
      <ModalBasic
        visible={openMessage}
        className={classNames('w-[460px]', styles.customModalNotice)}
        destroyOnClose={true}
        title=""
        closeIcon={false}
        onClosed={() => {
          setOpenMessage(false);
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <CheckSuccessIcon />
          <p className="mt-[10px] text-base-green-500 font-bold text-base">The post was forwarded successfully</p>
        </div>
      </ModalBasic>
    </>
  );
};

export default ModalForwardProfile;
