import { Input } from 'antd';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import styles from './styles.module.scss';

interface IInputCreatePost {
  className?: string;
  setIsOpenModal?: any;
}
function InputCreatePost({ className, setIsOpenModal }: IInputCreatePost) {
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
export default InputCreatePost;
