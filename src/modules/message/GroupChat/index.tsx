/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Button as ButtonAntd, Drawer, Empty, Flex, message, Spin, Upload } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CloseIcon, CloseIcon2, IconPlus } from '~/common/icon';
import InputBasic from '~/common/input/InputBasic';
import InputSearch from '~/common/inputSearch';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import { UserType } from '~/definitions';
import { QUERY_KEY } from '~/definitions/models';
import { useCreateGroupConservationMutation } from '~/hooks/data/conservation.data';
import useConfirm from '~/hooks/useConfirm';
import useDebounce from '~/hooks/useDebounce';
import { contactApi } from '~/services/api/contact.api';
import styles from './styles.module.scss';
import image from '@/static/image';
import Image from 'next/image';

const MAX_MEMBER_ADD_TO_GROUP = 50;
const MAX_SIZE_AVATAR_GROUP_MB = 5;

interface Props {
  drawerCtrl: {
    key: unknown;
    open: (value: any) => void;
    close: () => void;
  };
  refetchListMessage?: () => void;
}

const GroupChat: React.FC<Props> = ({ drawerCtrl, refetchListMessage }) => {
  const t = useTranslations();
  const [groupName, setGroupName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSearchKeyword, setSelectedSearchKeyword] = useState('');
  const [params, setParams] = useState({
    page: 1,
    pageSize: MAX_MEMBER_ADD_TO_GROUP,
    keyword: '',
  });
  const [listUserConnections, setListUserConnections] = useState<any[]>([]);
  const [listUserSelected, setListUserSelected] = useState<any[]>([]);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const [listUserHasSearch, setListUserHasSearch] = useState<any[]>([]);
  const { data } = useSession();
  const profile = data?.user as UserType;
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onSearch = useDebounce((event) => {
    setParams({ ...params, keyword: event?.target.value });
  }, 500);

  const createGroup = useCreateGroupConservationMutation();

  const onCloseDrawer = () => {
    drawerCtrl.close();
    setGroupName('');
    setSearchKeyword('');
    setSelectedSearchKeyword('');
    setListUserSelected([]);
    setListUserConnections([]);
    setAvatarFile(null);
    setParams({
      page: 1,
      pageSize: MAX_MEMBER_ADD_TO_GROUP,
      keyword: '',
    });
  };

  const {
    data: listFriendsResponse,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingListFriends,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LIST_FRIEND, params],
    queryFn: ({ pageParam }) => {
      return contactApi.getFriends({
        search: params.keyword,
        page: pageParam,
        limit: params.pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.result.length === params.pageSize ? lastPage?.data?.page + 1 : undefined;
    },
    enabled: !!drawerCtrl.key,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (listFriendsResponse) {
      const friends = listFriendsResponse.pages[0].result;
      const filteredFriends = friends.filter(
        (friend: any) => !listUserSelected.some((selected) => selected._id === friend._id)
      );
      setListUserConnections(filteredFriends);
    }
  }, [listFriendsResponse, listUserSelected]);

  const onSelectedUser = (item: any, type = 'add') => {
    const listUserSelectedOriginal = _.clone(listUserSelected);
    const listUserConnectionsOriginal = _.clone(listUserConnections);
    const userIdxSelected = _.findIndex(listUserSelectedOriginal, { _id: item._id });
    const userIdxConnections = _.findIndex(listUserConnectionsOriginal, { _id: item._id });

    if (type === 'add') {
      if (userIdxSelected === -1) {
        listUserSelectedOriginal.push(item);
        if (userIdxConnections > -1) {
          _.remove(listUserConnectionsOriginal, { _id: item._id });
        }
      }
    } else if (type === 'remove') {
      if (userIdxSelected > -1) {
        _.remove(listUserSelectedOriginal, { _id: item._id });
        if (userIdxConnections === -1) {
          listUserConnectionsOriginal.push(item);
        }
      }
    }

    setListUserSelected(listUserSelectedOriginal);
    setListUserConnections(listUserConnectionsOriginal);
  };

  const onConfirmCancel = () => {
    const isConfirmClosed = !!groupName || listUserSelected.length > 0 || avatarFile;
    if (!isConfirmClosed) {
      onCloseDrawer();
    } else {
      useConfirm({
        onOk: async () => onCloseDrawer(),
        textCancel: t('modalConfirm.no'),
        textOk: t('modalConfirm.yes'),
        title: t('modalConfirm.message'),
        description: t('notify.cancel'),
      });
    }
  };

  const disabledSubmit = !groupName?.trim() || listUserSelected.length < 1;

  const normalizeString = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const filterUsersByName = (users: any, query: string): any[] => {
    if (!query) return users;
    const normalizedQuery = normalizeString(query);
    return users.filter((item: any) => {
      const fullName = `${item?.first_name} ${item?.last_name}`;
      return normalizeString(fullName).includes(normalizedQuery);
    });
  };

  useEffect(() => {
    const listUserHasSearch = filterUsersByName(listUserSelected, selectedSearchKeyword);
    setListUserHasSearch(listUserHasSearch);
  }, [selectedSearchKeyword, listUserSelected]);

  const renderListUserSelected = (listUsers: any[]) => {
    if (!listUserSelected.length && !selectedSearchKeyword) {
      return (
        <div className="flex justify-center items-center h-full">
          <span className="text-[#333333]">{t('message.memberRequirement')}</span>
        </div>
      );
    }
    return listUsers.length > 0 ? (
      listUsers.map((item: any, index: number) => (
        <div key={index} className="px-[12px] py-[8px] pr-[30px]">
          <div className="flex gap-[12px] items-center">
            <div className="cursor-pointer" onClick={() => {}}>
              {item?.avatar ? (
                <Avatar className="w-[72px] h-[72px]" src={item?.avatar || ''} />
              ) : (
                <Avatar className="bg-[#fff0f6] w-[72px] h-[72px] text-[#eb2f96] text-[16px] font-bold">
                  {`${item?.first_name?.[0]}${item?.last_name?.[0]}`.toUpperCase()}
                </Avatar>
              )}
            </div>
            <div className="flex justify-between gap-[24px] items-center w-full">
              <div>
                <SmartTooltip
                  onClick={() => {}}
                  className="text-[#3E3E3E] font-bold cursor-pointer hover:underline"
                  text={`${item?.first_name} ${item?.last_name}`}
                />
              </div>
              <ButtonAntd
                type="link"
                disabled={isLoadingSubmit || createGroup.isPending}
                className={classNames(styles.iconAdd, 'cursor-pointer')}
                onClick={() => onSelectedUser(item, 'remove')}
              >
                <CloseIcon2 />
              </ButtonAntd>
            </div>
          </div>
          {listUsers.length - 1 !== index && <div className="h-[1px] bg-[#E8E9EE] w-full mt-[12px]" />}
        </div>
      ))
    ) : (
      <div className="flex justify-center items-center h-full">
        <Empty description={t('common.noData')} />
      </div>
    );
  };

  const handleAvatarSelection = (file: File) => {
    const fileType = file.type;
    const acceptFilesImage = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptFilesImage.includes(fileType)) {
      message.error(t('message.invalidFileType'));
      return;
    }
    if (file.size > MAX_SIZE_AVATAR_GROUP_MB * 1024 * 1024) {
      message.error(t('message.fileSizeExceeds', { size: MAX_SIZE_AVATAR_GROUP_MB }));
      return;
    }
    setAvatarFile(file);
  };

  const avatarUploadProps = {
    multiple: false,
    accept: 'image/jpeg,image/png,image/jpg',
    onChange: (info: any) => {
      if (info.file.status === 'done') {
        handleAvatarSelection(info.fileList[0].originFileObj);
      }
    },
    showUploadList: false,
    beforeUpload: () => false,
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      message.error(t('message.pleaseEnterName', { field: 'group name' }));
      return;
    }
    if (groupName.length > 100) {
      message.error(t('message.maxLengthInput', { number: 101 }));
      return;
    }
    if (listUserSelected.length < 1) {
      message.error(t('message.memberRequirement'));
      return;
    }
    setIsLoadingSubmit(true);
    try {
      const participants = [...listUserSelected.map((user) => user._id), ...[profile._id]];
      const formData = new FormData();
      formData.append('title', groupName);
      formData.append('participants', JSON.stringify(participants));
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await createGroup.mutateAsync(formData as any, {
        onSuccess: () => {},
      });
      onCloseDrawer();
      refetchListMessage?.();
    } catch (error) {
      message.error(t('message.createGroupError'));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <Drawer
      width={980}
      closable={false}
      open={!!drawerCtrl.key}
      contentWrapperStyle={{
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
      }}
      height={'90%'}
      rootClassName={classNames('overflow-hidden', styles.rootClassNameDrawer)}
      className="rounded-l-[25px]"
      onClose={onConfirmCancel}
      classNames={{
        body: 'flex flex-col px-[24px] pt-[40px]',
      }}
    >
      <div className="flex-1" ref={drawerRef}>
        <div className="flex items-center justify-between">
          <span className="text-[#3E3E3E] text-[20px] font-bold">{t('message.groupChat')}</span>
          <div className="cursor-pointer" onClick={onConfirmCancel}>
            <CloseIcon />
          </div>
        </div>
        <div className="border-t-[1px] border-[#E8E9EE] my-[12px]"></div>
        <div className="pt-[17px]">
          <div className="flex justify-center mb-3">
            <Upload className={classNames(styles.customUpload)} {...avatarUploadProps}>
              <div className={styles.container}>
                <Image
                  src={avatarFile ? URL.createObjectURL(avatarFile) : image.imageDefault}
                  alt="avatar"
                  className="w-[106px] h-[106px] rounded-[50%] object-cover mb-2"
                />
                <p className={styles.uploadHeader}>{t('message.addAvatar')}</p>
              </div>
            </Upload>
          </div>
          <div className="mb-[32px]">
            <div className="text-[#3E3E3E]">
              {t('message.groupName')} <span className="text-red-500">*</span>
            </div>
            <InputBasic
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              readOnly={isLoadingSubmit || createGroup.isPending}
              placeholder={t('common.typeHere')}
              className={styles.groupNameInput}
              maxLength={100}
            />
          </div>
          <div className="flex h-full">
            <div className="w-[50%]">
              <div className="text-[#636363] font-bold text-base">{t('message.allMembersList')}</div>
              <div className="mt-[23px] pr-[25px]">
                <InputSearch
                  className={styles.customInputSearch}
                  value={searchKeyword}
                  placeholder={t('search')}
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    onSearch(event);
                  }}
                />
              </div>
              <InfiniteScroll
                className="scroll-bar mr-[5px]"
                dataLength={listUserConnections.length || 0}
                hasMore={!!hasNextPage}
                loader={
                  isFetchingNextPage ? (
                    <div className="text-center">
                      <Spin />
                    </div>
                  ) : null
                }
                height={400}
                next={fetchNextPage}
              >
                {listUserConnections.length ? (
                  listUserConnections.map((item: any, index: number) => (
                    <div key={index} className="px-[12px] py-[8px] pr-[30px]">
                      <div className="flex gap-[12px] items-center">
                        <div className="cursor-pointer" onClick={() => {}}>
                          {item?.avatar ? (
                            <Avatar className="w-[72px] h-[72px]" src={item?.avatar || ''} />
                          ) : (
                            <Avatar className="bg-[#fff0f6] w-[72px] h-[72px] text-[#eb2f96] text-[16px] font-bold">
                              {`${item?.user_name?.[0]}`.toUpperCase()}
                            </Avatar>
                          )}
                        </div>
                        <div className="flex justify-between gap-[24px] items-center w-full">
                          <div>
                            <SmartTooltip
                              className="text-[#3E3E3E] font-bold cursor-pointer hover:underline"
                              text={`${item?.first_name} ${item?.last_name}`}
                              onClick={() => {}}
                            />
                          </div>
                          <ButtonAntd
                            disabled={
                              listUserSelected.length >= MAX_MEMBER_ADD_TO_GROUP ||
                              isLoadingSubmit ||
                              createGroup.isPending
                            }
                            type="link"
                            className={classNames(styles.iconAdd, 'cursor-pointer')}
                            onClick={() => onSelectedUser(item)}
                          >
                            <IconPlus color="#05A660" />
                          </ButtonAntd>
                        </div>
                      </div>
                      {listUserConnections.length - 1 !== index && (
                        <div className="h-[1px] bg-[#E8E9EE] w-full mt-[12px]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Empty description={t('common.noData')} />
                  </div>
                )}
              </InfiniteScroll>
            </div>
            <div className="bg-[#E8E9EE] w-[1px] mr-[26px]"></div>
            <div className="w-[50%]">
              <div className="text-[#636363] font-bold text-base">
                {t('message.memberChosenList')} ({listUserSelected.length + 1})
              </div>
              <div className="mt-[23px]">
                <InputSearch
                  className={styles.customInputSearch}
                  value={selectedSearchKeyword}
                  placeholder={t('search')}
                  onChange={(e) => setSelectedSearchKeyword(e.target.value)}
                />
                <div className="overflow-y-scroll scroll-bar -mr-[20px]" style={{ height: 400 }}>
                  <div className="px-[12px] py-[8px] pr-[30px]">
                    <div className="flex gap-[12px] items-center">
                      <Avatar
                        className="w-[72px] h-[72px]"
                        src={profile?.avatar || ''}
                        style={{
                          backgroundColor: !profile?.avatar ? '#fff0f6' : undefined,
                          color: '#eb2f96',
                          fontWeight: 'bold',
                        }}
                      >
                        {!profile?.avatar && `${profile?.user_name?.[0]}`.toUpperCase()}
                      </Avatar>
                      <div className="flex justify-between gap-[24px] items-center w-full">
                        <SmartTooltip
                          className="text-[#3E3E3E] font-bold cursor-pointer hover:underline"
                          text={`${profile?.user_name}`}
                        />
                      </div>
                    </div>
                  </div>
                  {renderListUserSelected(selectedSearchKeyword ? listUserHasSearch : listUserSelected)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#E8E9EE] w-full h-[1px] mb-[24px]"></div>
        <Flex gap={24} justify="center">
          <Button
            disabled={isLoadingSubmit || createGroup.isPending}
            btnType="secondary"
            onClick={onConfirmCancel}
            className="min-w-[170px] h-[48px]"
          >
            {t('common.cancel')}
          </Button>
          <Button
            btnType="primary"
            loading={isLoadingSubmit || createGroup.isPending}
            disabled={disabledSubmit || isLoadingSubmit || createGroup.isPending}
            onClick={handleSubmit}
            className="min-w-[170px] h-[48px]"
          >
            {t('common.ok')}
          </Button>
        </Flex>
      </div>
    </Drawer>
  );
};

export default GroupChat;
