import { Flex, Popover } from 'antd';
import InputSearch from '~/common/inputSearch';
import styles from './styles.module.scss';
import { ChangeEventHandler, useState } from 'react';
import Button from '~/components/form/Button';
import { IconPlus } from '~/common/icon';
import HoverIcon from '~/common/HoverIcon';
import { useTranslations } from 'next-intl';
import Input from '~/common/input';

interface Props {
  keyword: string;
  setKeyword: ChangeEventHandler<HTMLInputElement>;
  children?: React.ReactNode;
}
export default function AddTag({ keyword, setKeyword, children }: Props) {
  const [isAddTag, setIsAddTag] = useState(false);
  const t = useTranslations();
  const content = (
    <Flex vertical gap={'small'}>
      <div className="px-[12px]">
        <InputSearch value={keyword} className={styles.customInputSearch} rounded onChange={setKeyword} />
      </div>
      <Button
        icon={<HoverIcon icon={<IconPlus />} />}
        btnType="text"
        className={styles.btnNewTag}
        onClick={() => {
          setIsAddTag(true);
        }}
      >
        {t('newTag')}
      </Button>
      <Flex gap={'small'}>
        {' '}
        <Input name="tag"></Input>
        <Button>Add</Button>
      </Flex>
    </Flex>
  );
  return (
    <Popover content={content} trigger="click" placement='bottom' >
      {children}
    </Popover>
  );
}
