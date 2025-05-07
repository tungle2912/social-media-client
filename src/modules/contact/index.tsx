import { Tabs } from 'antd';
import styles from './styles.module.scss';
import { TabsProps } from 'antd/lib';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { AllRecommend } from '~/modules/contact/allRecommend';
import MyContact from '~/modules/contact/myContact';
export default function ListContact() {
  const t = useTranslations();
  const searchParam = useSearchParams();
  const dataParams = Object.fromEntries(searchParam.entries());
  const onChange = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', key);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: t('contact.allRecommend'),
    },
    {
      key: 'contact',
      label: t('contact.myContact'),
    },
    {
      key: 'invitation',
      label: t('contact.myInvitation'),
    },
    {
      key: 'beingInvited',
      label: t('contact.beingInvited'),
    },
  ];
  return (
    <div className={styles.wrap}>
      <Tabs
        items={items}
        className={styles.tabs}
        activeKey={String(dataParams?.tab) === 'undefined' ? 'all' : String(dataParams?.tab)}
        onChange={onChange}
        defaultActiveKey="all"
        tabBarExtraContent={
          {
            //   left: <MobileMenu placement="contact" />,
          }
        }
      />
      {dataParams.tab === 'all' && <AllRecommend />}
      {(dataParams.tab === 'contact' || !dataParams.tab) && <MyContact />}
      {/* {dataParams.tab === 'invitation' && <MyInvitation />}
      {dataParams.tab === 'beingInvited' && <BeingInvited />} */}
    </div>
  );
}
