import { Input } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import styles from './styles.module.scss';

interface IInputCreatPost {
  className?: string;
  setIsOpenModal?: any;
}
function InputCreatPost({ className, setIsOpenModal }: IInputCreatPost) {
  const t = useTranslations();
  return (
    <Input
      onClick={() => {
        setIsOpenModal(true);
      }}
      name="search"
      placeholder={t('yourPost')}
      className={classNames(styles.inputSearch, className)}
    />
  );
}
export default InputCreatPost;
