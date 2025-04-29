// import { Avatar, Checkbox, Drawer, Dropdown, Form, MenuProps, Spin, Tooltip } from 'antd';
// import { CheckboxChangeEvent } from 'antd/lib/checkbox';
// import classNames from 'classnames';
// import _ from 'lodash';
// import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/router';
// import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { useInfiniteQuery } from 'react-query';
// import { contact } from '~/api/contact';
// import { useCompanyRole, useCountryList } from '~/api/data/useActivityConfiguration';
// import { CloseIcon } from '~/components/elements/common/Icons';
// import SmartTooltip from '~/components/elements/common/SmartTooltip';
// import Button from '~/components/elements/form/Button';
// import InputSearch from '~/components/elements/form/Input/InputSearch';
// import ModalBasic from '~/components/elements/modal/CustomModal/ModalBasic';
// import useDebounce from '~/hooks/useDebounce';
// import { QUERY_KEY, getUsername } from '~/models';
// import { IUser } from '~/models/user';

// import styles from './styles.module.scss';
// import { USER_TYPE } from '~/utils/constant';
// import useProfile from '~/api/data/useProfile';
// import useMobileScreen from '~/hooks/useMobileScreen';

// interface Props {
//   attachedData: { field: string };
//   selectedValues: { viewScope: IUser[]; commentScope: IUser[] };
//   setSelectedValues: Dispatch<SetStateAction<any>>;
//   open: boolean;
//   onClosed: () => void;
//   onChangeValue: ({ viewScope, commentScope }: { viewScope: IUser[]; commentScope: IUser[] }) => void;
//   onUpdateView?: (select) => void;
//   onUpdateComment?: (select) => void;
// }

// const SelectPeopleCanViewAndComment: React.FC<Props> = ({
//   attachedData = { field: '' },
//   selectedValues,
//   open,
//   onClosed,
//   setSelectedValues,
//   onChangeValue,
//   onUpdateView,
//   onUpdateComment,
// }) => {
//   const t = useTranslations();
//   const [searchValue, setSearchValue] = useState<string>('');
//   const [selectedOriginal, setSelectedOriginal] = useState<{ viewScope: IUser[]; commentScope: IUser[] }>({
//     viewScope: [],
//     commentScope: [],
//   });
//   const [heightListUserSelected, setHeightListUserSelected] = useState<number>(0);
//   const [form] = Form.useForm();
//   const { locale: lng }: any = useRouter();
//   const { isMobile } = useMobileScreen(786);
//   const listUserRef = useRef<HTMLDivElement | null>(null);
//   const [listConnections, setListConnections] = useState<IUser[]>([]);
//   const { profile } = useProfile();
//   const isActivity = profile?.representationObject === USER_TYPE.ACTIVITY;

//   useEffect(() => {
//     setSelectedOriginal({
//       viewScope: selectedValues.viewScope,
//       commentScope: selectedValues.commentScope,
//     });
//   }, [open]);

//   useEffect(() => {
//     const handleResize = () => {
//       const offsetHeight = window.innerHeight < 700 ? 0 : 40;
//       const height = isMobile
//         ? window.innerHeight - (320 + (listUserRef.current?.clientHeight ?? 0) + offsetHeight)
//         : 450;
//       setHeightListUserSelected(height);
//     };

//     window.addEventListener('resize', handleResize);
//     window.addEventListener('scroll', handleResize);

//     handleResize();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       window.removeEventListener('scroll', handleResize);
//     };
//   }, [
//     listUserRef.current,
//     selectedValues.commentScope.length,
//     selectedValues.viewScope.length,
//     window.innerHeight,
//     window.innerWidth,
//   ]);

//   const [params, setParams] = useState({
//     pageIndex: 1,
//     pageSize: 5,
//     keyword: searchValue,
//   });
//   const {
//     fetchNextPage,
//     hasNextPage,
//     isLoading: isLoadingListConnections,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: [QUERY_KEY.LIST_USER_COMMUNITY_CONNECTIONS, params],
//     queryFn: ({ pageParam }) => {
//       return contact.getContact({
//         keyword: params.keyword,
//         pageSize: 5,
//         pageIndex: pageParam,
//       });
//     },
//     enabled: !isActivity,
//     getNextPageParam: (lastPage) => {
//       const nextPage =
//         lastPage?.data?.pageIndex < lastPage?.data?.totalPages ? lastPage?.data?.pageIndex + 1 : undefined;
//       return nextPage;
//     },
//     onSuccess: (response) => {
//       const mappedData = response?.pages.reduce((acc, page) => acc.concat(page.data), []);
//       const mappedListConnections = mappedData.reduce((acc, page: any) => acc.concat(page?.data), []);
//       setListConnections(mappedListConnections);
//     },
//   });
//   const {
//     fetchNextPage: fetchNextPageAllContact,
//     hasNextPage: hasNextPageAllContact,
//     isLoading: isLoadingListConnectionsAllContact,
//     isFetchingNextPage: isFetchingNextPageAllContact,
//   } = useInfiniteQuery({
//     queryKey: ['LIST_FRIEND', params],
//     queryFn: ({ pageParam }) => {
//       return contact.getAllContactForActivity({
//         pageIndex: pageParam,
//         pageSize: 10,
//         keyword: searchValue,
//       });
//     },
//     getNextPageParam: (lastPage) => {
//       const nextPage =
//         lastPage?.data?.pageIndex < lastPage?.data?.totalPages ? lastPage?.data?.pageIndex + 1 : undefined;
//       return nextPage;
//     },
//     enabled: isActivity,
//     onSuccess: (response) => {
//       const mappedData = response?.pages.reduce((acc, page) => acc.concat(page.data), []);
//       const mappedListConnections = mappedData.reduce((acc, page: any) => acc.concat(page?.data), []);
//       setListConnections(mappedListConnections);
//     },
//   });

//   const onNextPage = () => {
//     if (!hasNextPage || !hasNextPageAllContact || isLoadingListConnections || isLoadingListConnectionsAllContact) {
//       return;
//     }
//     if (isActivity) {
//       fetchNextPageAllContact();
//     } else {
//       fetchNextPage();
//     }
//   };

//   const handleSearch = useDebounce((value) => setParams({ ...params, keyword: value }), 300);

//   const onChangeSelected = ({ event, user }: { event?: CheckboxChangeEvent; user: IUser }) => {
//     const userClone = { ...user };
//     if (event) {
//       const isChecked = _.get(event, 'target.checked', false);
//       const updatedUsers = isChecked
//         ? _.unionBy(selectedValues[attachedData.field], [userClone], 'id')
//         : _.filter(selectedValues[attachedData.field], (item) => Number(item.id) !== Number(userClone.id));

//       setSelectedValues({ ...selectedValues, [attachedData.field]: updatedUsers });
//     } else {
//       const updatedUsers = _.filter(
//         selectedValues[attachedData.field],
//         (item) => Number(item.id) !== Number(userClone.id)
//       );
//       setSelectedValues({ ...selectedValues, [attachedData.field]: updatedUsers });
//     }
//   };

//   const onCloseModal = () => {
//     onClosed();
//     setParams({ keyword: '', pageIndex: 1, pageSize: 5 });
//     setSearchValue('');
//     onChangeValue(selectedOriginal);
//   };

//   const onOk = () => {
//     if (onUpdateView) {
//       onUpdateView(selectedValues);
//     }
//     if (onUpdateComment) {
//       onUpdateComment(selectedValues);
//     }
//     onChangeValue(selectedValues);
//     setSearchValue('');
//     setParams({ keyword: '', pageIndex: 1, pageSize: 5 });
//     onClosed();
//   };

//   const getMoreConnections = (field: string) => {
//     const listConnectionsShow = selectedValues[field]?.slice(0, isMobile ? 4 : 6);
//     const listConnectionMore: MenuProps['items'] = selectedValues[field]
//       ?.slice(isMobile ? 4 : 6)
//       ?.map((item: IUser, index) => ({
//         label: getUsername(item?.basicPersonalInfo),
//         key: index,
//         value: item.id,
//         ...item,
//       }));

//     return { listConnectionsShow, listConnectionMore } as any;
//   };
//   const { listConnectionsShow, listConnectionMore } = getMoreConnections(attachedData.field);
//   const renderForm = () => {
//     return (
//       <Form form={form}>
//         <div className="border-t-[1px] border-color-[#E8E9EE] my-[12px] max-sm:mb-[16px]" />
//         <InputSearch
//           className={styles.customInput}
//           placeholder={t('search')}
//           value={searchValue}
//           onChange={(e) => {
//             handleSearch(e.target.value);
//             setSearchValue(e.target.value);
//           }}
//         />
//         <div
//           className={classNames({
//             'mt-[24px]': !isMobile,
//             'mt-[12px]': isMobile,
//           })}
//         >
//           {listConnectionsShow?.length ? (
//             <div
//               ref={listUserRef}
//               className={classNames(styles.listSelectedUser, 'flex-wrap', {
//                 'my-[24px]': !isMobile,
//                 'my-[8px]': isMobile,
//               })}
//             >
//               {listConnectionsShow?.map((user: any, index: number) => (
//                 <Tooltip key={index} title={getUsername(user?.basicPersonalInfo || user)} trigger={['hover']}>
//                   <div className={styles.user} key={user.id}>
//                     {user?.profilePhoto || user?.basicPersonalInfo?.profilePhoto ? (
//                       <div>
//                         <Avatar src={user.profilePhoto || user.basicPersonalInfo?.profilePhoto} alt={t('avatar')} />
//                       </div>
//                     ) : (
//                       <div className={classNames(styles.defaultAvatar, 'w-[32px] h-[32px]')}>
//                         <Avatar src="" className={styles.userName}>
//                           {getUsername(user?.basicPersonalInfo || user, true)}
//                         </Avatar>
//                       </div>
//                     )}
//                     <div className="flex justify-between gap-[8px] w-full items-center">
//                       <div className="line-clamp-1">{getUsername(user?.basicPersonalInfo || user)}</div>
//                       <div className="cursor-pointer" onClick={() => onChangeSelected({ user })}>
//                         <CloseIcon />
//                       </div>
//                     </div>
//                   </div>
//                 </Tooltip>
//               ))}
//               {listConnectionMore?.length > 0 ? (
//                 <Dropdown
//                   menu={{ items: listConnectionMore }}
//                   placement="bottomRight"
//                   rootClassName={styles.dropdownTag}
//                   trigger={['click']}
//                   dropdownRender={() => {
//                     return (
//                       <div className={styles.dropdownRender}>
//                         {listConnectionMore.map((user, index: number) => (
//                           <div key={index} className={styles.item}>
//                             <div className="text-white">{user?.label}</div>
//                             <div onClick={() => onChangeSelected({ user })}>
//                               <CloseIcon color="#ffffff" />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     );
//                   }}
//                 >
//                   <div className="flex shrink-0 px-[8px] py-[4px] justify-center items-center gap-[10px] rounded-[5px] border-[1px] border-solid border-[#E8E9EE] bg-[#F7F7F7] cursor-pointer text-blue-500 text-[12px] font-bold">
//                     {`+${listConnectionMore.length}`}...
//                   </div>
//                 </Dropdown>
//               ) : null}
//             </div>
//           ) : null}

//           <div className={styles.listUser}>
//             <div className="mt-0">
//               {!listConnections?.length ? <div className="text-center">{t('noData')}</div> : ''}
//               <InfiniteScroll
//                 className="scroll-bar"
//                 dataLength={listConnections.length || 0}
//                 hasMore={!!hasNextPage}
//                 loader={
//                   isFetchingNextPage || isFetchingNextPageAllContact ? (
//                     <div className="text-center">
//                       <Spin />
//                     </div>
//                   ) : null
//                 }
//                 height={heightListUserSelected}
//                 next={onNextPage}
//               >
//                 <Checkbox.Group value={_.map(selectedValues[attachedData?.field], 'id').map(Number)} className="w-full">
//                   {listConnections?.map((item: any, index: number) => (
//                     <React.Fragment key={index}>
//                       <div
//                         className={classNames(
//                           'p-[12px] hover:bg-[#F8F8FF] hover:rounded-[10px] w-full max-sm:mt-[5px] mr-[5px]',
//                           { ['mt-[24px]']: index },
//                           { ['border-b-[1px]']: index !== listConnections.length - 1 }
//                         )}
//                       >
//                         <Checkbox
//                           value={Number(item?.userId)}
//                           className={styles.checkbox}
//                           onChange={(event: CheckboxChangeEvent) => onChangeSelected({ event, user: item.userInfo })}
//                         >
//                           <div className="flex items-center gap-[12px]">
//                             <div>
//                               {item?.userInfo?.profilePhoto ? (
//                                 <div>
//                                   <Avatar
//                                     className="w-[64px] h-[64px]"
//                                     src={item?.userInfo?.profilePhoto}
//                                     alt={t('avatar')}
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className={styles.defaultAvatar}>
//                                   <span className={styles.userName}>{getUsername(item?.userInfo, true)}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </Checkbox>
//                       </div>
//                       <div className="border-t-[1px] border-color-[#E8E9EE]" />
//                     </React.Fragment>
//                   ))}
//                 </Checkbox.Group>
//               </InfiniteScroll>
//             </div>
//           </div>
//         </div>
//         <div className={styles.divider}></div>
//         <div className="mt-[15px] max-sm:absolute bottom-[10px] max-sm:h-[60px] max-sm:left-0 max-sm:w-full">
//           <div className="flex gap-[10px] max-sm:gap-[24px] max-sm:px-[16px]">
//             <Button btnType="secondary" className="w-full h-[48px]" onClick={onCloseModal}>
//               {t('cancel')}
//             </Button>
//             <Button btnType="primary" className="w-full h-[48px]" onClick={onOk}>
//               {t('ok')}
//             </Button>
//           </div>
//         </div>
//       </Form>
//     );
//   };

//   return isMobile ? (
//     <Drawer
//       width={720}
//       closable={false}
//       open={open}
//       contentWrapperStyle={{
//         borderTopLeftRadius: 25,
//         borderBottomLeftRadius: 25,
//       }}
//       placement="bottom"
//       height={isMobile ? '90%' : undefined}
//       rootClassName="overflow-hidden"
//       className={classNames(styles.customDrawer)}
//       onClose={onCloseModal}
//       destroyOnClose
//       afterOpenChange={(visible) => {
//         if (!visible) {
//           form.resetFields();
//         }
//       }}
//     >
//       <div className="flex justify-between items-center">
//         <div className="text-xl text-base-black-200 font-bold">{t('communityLocale.selectPeople')}</div>
//         <div className="cursor-pointer" onClick={onCloseModal}>
//           <CloseIcon />
//         </div>
//       </div>
//       {renderForm()}
//     </Drawer>
//   ) : (
//     <ModalBasic
//       visible={open}
//       className="md:w-[600px] rounded-[25px]"
//       destroyOnClose={true}
//       title={
//         <div className="flex items-center justify-between">
//           <span className={styles.titleModal}>{t('communityLocale.selectPeople')}</span>
//           <div className="cursor-pointer" onClick={onCloseModal}>
//             <CloseIcon />
//           </div>
//         </div>
//       }
//       closeIcon={false}
//       onClosed={onCloseModal}
//     >
//       {renderForm()}
//     </ModalBasic>
//   );
// };

// export default SelectPeopleCanViewAndComment;
