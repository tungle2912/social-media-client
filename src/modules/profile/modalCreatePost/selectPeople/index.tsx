import { useInfiniteQuery } from '@tanstack/react-query';
import { Avatar, Checkbox, Drawer, Dropdown, Form, MenuProps, Spin, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CloseIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import SmartTooltip from '~/common/smartTooltip';
import Button from '~/components/form/Button';
import ModalBasic from '~/components/modal/modalBasic';
import { UserType } from '~/definitions';
import { useDimension } from '~/hooks';
import useDebounce from '~/hooks/useDebounce';
import { contactApi } from '~/services/api/contact.api';
import styles from './styles.module.scss';

interface Props {
  attachedData: { field: 'viewScope' };
  selectedValues: { viewScope: UserType[] };
  setSelectedValues: Dispatch<SetStateAction<any>>;
  open: boolean;
  onClosed: () => void;
  onChangeValue: ({ viewScope }: { viewScope: UserType[] }) => void;
  onUpdateView?: (select: any) => void;
}

const SelectPeopleCanViewAndComment: React.FC<Props> = ({
  attachedData = { field: 'viewScope' },
  selectedValues,
  open,
  onClosed,
  setSelectedValues,
  onChangeValue,
  onUpdateView,
}) => {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedOriginal, setSelectedOriginal] = useState<{ viewScope: UserType[] }>({
    viewScope: [],
  });
  const [heightListUserSelected, setHeightListUserSelected] = useState<number>(0);
  const [form] = Form.useForm();
  const { isSM } = useDimension();
  const listUserRef = useRef<HTMLDivElement | null>(null);
  const [listConnections, setListConnections] = useState<UserType[]>([]);
  const { data } = useSession();
  const profile = data?.user;

  useEffect(() => {
    setSelectedOriginal({
      viewScope: selectedValues.viewScope,
    });
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      const offsetHeight = window.innerHeight < 700 ? 0 : 40;
      const height = isSM ? window.innerHeight - (320 + (listUserRef.current?.clientHeight ?? 0) + offsetHeight) : 450;
      setHeightListUserSelected(height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [listUserRef.current, selectedValues.viewScope.length, window.innerHeight, window.innerWidth]);
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    search: searchValue,
  });
  const {
    data: dataResponse,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingListConnections,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['FRIENDS', params],
    queryFn: ({ pageParam }) => {
      return contactApi.getFriends(params);
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage?.data?.pageIndex < lastPage?.data?.totalPages ? lastPage?.data?.pageIndex + 1 : undefined;
      return nextPage;
    },
    enabled: !!open,
    initialPageParam: 1,
  });
  useEffect(() => {
    if (dataResponse?.pages) {
      const newListConnections = dataResponse.pages.reduce((acc, page) => {
        return [...acc, ...(page?.result.users || [])];
      }, []);
      setListConnections(newListConnections);
    }
  }, [dataResponse]);

  const onNextPage = () => {
    if (!hasNextPage || isLoadingListConnections) {
      return;
    }

    fetchNextPage();
  };

  const handleSearch = useDebounce((value) => setParams({ ...params, search: value }), 300);

  const onChangeSelected = ({ event, user }: { event?: CheckboxChangeEvent; user: UserType }) => {
    const userClone = { ...user };
    const currentField = attachedData.field;

    setSelectedValues((prev: any) => {
      if (event) {
        const isChecked = event.target.checked;
        const updatedUsers = isChecked
          ? _.unionBy(prev[currentField], [userClone], '_id')
          : _.filter(prev[currentField], (item) => item._id !== userClone._id);

        return { ...prev, [currentField]: updatedUsers };
      } else {
        const updatedUsers = _.filter(prev[currentField], (item) => item._id !== userClone._id);
        return { ...prev, [currentField]: updatedUsers };
      }
    });
  };

  const onCloseModal = () => {
    onClosed();
    setParams({ search: '', page: 1, limit: 5 });
    setSearchValue('');
    onChangeValue(selectedOriginal);
  };

  const onOk = () => {
    if (onUpdateView) {
      onUpdateView(selectedValues);
    }
    onChangeValue(selectedValues);
    setSearchValue('');
    setParams({ search: '', page: 1, limit: 5 });
    onClosed();
  };

  const getMoreConnections = (field: string) => {
    const listConnectionsShow = selectedValues[field as 'viewScope']?.slice(0, isSM ? 4 : 6);
    const listConnectionMore: MenuProps['items'] = selectedValues[field as 'viewScope']
      ?.slice(isSM ? 4 : 6)
      ?.map((item: UserType, index) => ({
        label: item.user_name,
        key: index,
        value: item._id,
        ...item,
      }));

    return { listConnectionsShow, listConnectionMore } as any;
  };
  const { listConnectionsShow, listConnectionMore } = getMoreConnections(attachedData.field);
  const renderForm = () => {
    return (
      <Form form={form}>
        <div className="border-t-[1px] border-color-[#E8E9EE] my-[12px] max-sm:mb-[16px]" />
        <InputSearch
          className={styles.customInput}
          placeholder={t('search')}
          value={searchValue}
          onChange={(e) => {
            handleSearch(e.target.value);
            setSearchValue(e.target.value);
          }}
        />
        <div
          className={classNames({
            'mt-[24px]': !isSM,
            'mt-[12px]': isSM,
          })}
        >
          {listConnectionsShow?.length ? (
            <div
              ref={listUserRef}
              className={classNames(styles.listSelectedUser, 'flex-wrap', {
                'my-[24px]': !isSM,
                'my-[8px]': isSM,
              })}
            >
              {listConnectionsShow?.map((user: any) => (
                <Tooltip key={user._id} title={user.user_name} trigger={['hover']}>
                  <div className={styles.user} key={user._id}>
                    {user?.avatar ? (
                      <div>
                        <Avatar src={user.avatar} alt={t('avatar')} />
                      </div>
                    ) : (
                      <div className={classNames(styles.defaultAvatar, 'w-[32px] h-[32px]')}>
                        <Avatar src="" className={styles.userName}>
                          {user.user_name}
                        </Avatar>
                      </div>
                    )}
                    <div className="flex justify-between gap-[8px] w-full items-center">
                      <div className="line-clamp-1">{user.user_name}</div>
                      <div className="cursor-pointer" onClick={() => onChangeSelected({ user })}>
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
              {listConnectionMore?.length > 0 ? (
                <Dropdown
                  menu={{ items: listConnectionMore }}
                  placement="bottomRight"
                  rootClassName={styles.dropdownTag}
                  trigger={['click']}
                  dropdownRender={() => {
                    return (
                      <div className={styles.dropdownRender}>
                        {listConnectionMore.map((user: any) => (
                          <div key={user._id} className={styles.item}>
                            <div className="text-white">{user?.label}</div>
                            <div onClick={() => onChangeSelected({ user })}>
                              <CloseIcon color="#ffffff" />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                >
                  <div className="flex shrink-0 px-[8px] py-[4px] justify-center items-center gap-[10px] rounded-[5px] border-[1px] border-solid border-[#E8E9EE] bg-[#F7F7F7] cursor-pointer text-blue-500 text-[12px] font-bold">
                    {`+${listConnectionMore.length}`}...
                  </div>
                </Dropdown>
              ) : null}
            </div>
          ) : null}

          <div className={styles.listUser}>
            <div className="mt-0">
              {!listConnections?.length ? <div className="text-center">{t('noData')}</div> : ''}
              <InfiniteScroll
                className="scroll-bar"
                dataLength={listConnections.length || 0}
                hasMore={!!hasNextPage}
                loader={
                  isFetchingNextPage ? (
                    <div className="text-center">
                      <Spin />
                    </div>
                  ) : null
                }
                height={heightListUserSelected}
                next={onNextPage}
              >
                <div className="w-full">
                  {listConnections?.map((item: any, index: number) => (
                    <React.Fragment key={index}>
                      <div
                        className={classNames(
                          'p-[12px] hover:bg-[#F8F8FF] hover:rounded-[10px] w-full max-sm:mt-[5px] mr-[5px]',
                          { ['mt-[24px]']: index },
                          { ['border-b-[1px]']: index !== listConnections.length - 1 }
                        )}
                      >
                        <Checkbox
                          value={Number(item?._id)}
                          checked={selectedValues.viewScope.some((u) => u._id === item._id)}
                          className={styles.checkbox}
                          onChange={(event: CheckboxChangeEvent) => onChangeSelected({ event, user: item })}
                        >
                          <div className="flex items-center gap-[12px]">
                            <div>
                              {item?.avatar ? (
                                <div>
                                  <Avatar className="w-[64px] h-[64px]" src={item?.avatar} alt={t('avatar')} />
                                </div>
                              ) : (
                                <div className={styles.defaultAvatar}>
                                  <span className={styles.userName}>{item.user_name}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <SmartTooltip className="text-[#3E3E3E] font-bold" text={item.user_name} />
                            </div>
                          </div>
                        </Checkbox>
                      </div>
                      <div className="border-t-[1px] border-color-[#E8E9EE]" />
                    </React.Fragment>
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className="mt-[15px] max-sm:absolute bottom-[10px] max-sm:h-[60px] max-sm:left-0 max-sm:w-full">
          <div className="flex gap-[10px] max-sm:gap-[24px] max-sm:px-[16px]">
            <Button btnType="secondary" className="w-full h-[48px]" onClick={onCloseModal}>
              {t('cancel')}
            </Button>
            <Button btnType="primary" className="w-full h-[48px]" onClick={onOk}>
              {t('ok')}
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  return isSM ? (
    <Drawer
      width={720}
      closable={false}
      open={open}
      contentWrapperStyle={{
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
      }}
      placement="bottom"
      height={isSM ? '90%' : undefined}
      rootClassName="overflow-hidden"
      className={classNames(styles.customDrawer)}
      onClose={onCloseModal}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields();
        }
      }}
    >
      <div className="flex justify-between items-center">
        <div className="text-xl text-base-black-200 font-bold">{t('community.selectPeople')}</div>
        <div className="cursor-pointer" onClick={onCloseModal}>
          <CloseIcon />
        </div>
      </div>
      {renderForm()}
    </Drawer>
  ) : (
    <ModalBasic
      visible={open}
      className="md:w-[600px] rounded-[25px]"
      destroyOnClose={true}
      title={
        <div className="flex items-center justify-between">
          <span className={styles.titleModal}>{t('community.selectPeople')}</span>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <CloseIcon />
          </div>
        </div>
      }
      closeIcon={false}
      onClosed={onCloseModal}
    >
      {renderForm()}
    </ModalBasic>
  );
};

export default SelectPeopleCanViewAndComment;
