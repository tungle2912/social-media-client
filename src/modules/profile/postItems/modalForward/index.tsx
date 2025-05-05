import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Empty, Input, Spin } from 'antd';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CheckSuccessIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import ModalBasic from '~/components/modal/modalBasic';
import { UserType } from '~/definitions';
import { messageType } from '~/definitions/enums/index.enum';
import { SearchParams } from '~/definitions/interfaces/interface';
import { QUERY_KEY } from '~/definitions/models';
import { ConversationType } from '~/definitions/models/message';
import { useCreateMessageMutation } from '~/hooks/data/conservation.data';
import { messageApi } from '~/services/api/message.api';
import useListOnline from '~/stores/listOnline.data';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';

interface IPropsModalForward {
  open: boolean;
  onClose: () => void;
  name?: string;
  avatar?: string;
  postId: string;
}

const ModalForward = ({ open, onClose, name, avatar, postId }: IPropsModalForward) => {
  const router = useRouter();
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

  const handleSendMessage = async (item: any) => {
    console.log('item', item);
    const formData = new FormData();
    formData.append('message', valueMsg);
    formData.append('conversationId', item?._id);
    formData.append('type', messageType.Post.toString());
    formData.append('additionalData', `${postId}`);
    await createMessageMutation.mutateAsync(formData, {
      onSuccess: () => {
        setOpenMessage(true);
        setValueMsg('');
      },
    });
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
        <div className="flex items-start gap-[12px] rounded-[10px] bg-[#E8E9EE] py-[8px] px-[20px] my-[24px]">
          <div className={styles.avatar}>
            {avatar ? (
              <Avatar shape="circle" size={40} src={avatar} />
            ) : (
              <Avatar shape="circle" size={40}>
                {name?.slice(0, 1)}
              </Avatar>
            )}
          </div>
          <div>
            <SmartTooltip text={name || ''} className="text-sm not-italic font-bold text-[#3E3E3E]" />
            <a
              href={`${process.env.NEXT_PUBLIC_DOMAIN}?postId=${postId}`}
              target="_blank"
              className=" text-sm max-xs:text-xs not-italic font-normal leading-[24px] mt-[4px] line-clamp-2"
              rel="noreferrer"
            >{`${process.env.NEXT_PUBLIC_DOMAIN}?postId=${postId}`}</a>
          </div>
        </div>
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
                    <div
                      className={styles.avatarConnect}
                      onClick={() => {
                        if (contact?.type === ConversationType.GROUP_CHAT) {
                          router.push(`/connect/message?roomId=${contact?._id}`);
                        }
                      }}
                    >
                      {contact?.avatar ? (
                        <Avatar shape="circle" size={72} src={contact?.avatar} />
                      ) : (
                        <Avatar shape="circle" size={72}>
                          {contact?.title?.slice(0, 1)}
                        </Avatar>
                      )}
                    </div>
                    <div>
                      <SmartTooltip
                        onClick={() => {
                          if (contact?.type === ConversationType.GROUP_CHAT) {
                            router.push(`/message?roomId=${contact?._id}`);
                          }
                        }}
                        text={contact?.title}
                        className="text-sm not-italic font-bold text-[#3E3E3E] cursor-pointer hover:underline"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      const formData = new FormData();
                      formData.append('message', valueMsg);
                      formData.append('conversationId', contact?._id);
                      formData.append('type', messageType.Post.toString());
                      formData.append('additionalData', `${postId}`);
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

export default ModalForward;
