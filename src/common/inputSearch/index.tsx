import { Input } from 'antd';
import classNames from 'classnames';
import { SearchIcon } from '~/common/icon';
import styles from './styles.module.scss';
import { useTranslations } from 'next-intl';
interface InputSearchProps {
  placeholder?: string;
  className?: string;
}
function InputSearch({ className }: InputSearchProps) {
  const t = useTranslations();
  return (
    <Input
      name="search"
      placeholder={t('search')}
      className={classNames(styles.inputSearch, className)}
      prefix={<SearchIcon />}
    />
  );
}
export default InputSearch;
