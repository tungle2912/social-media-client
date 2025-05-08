import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import styles from './styles.module.scss';
import ModalBasic from '~/components/modal/modalBasic';
import Button from '~/components/form/Button';

interface IPropsModalDisconnect {
  isMultiple?: boolean;
  isLoading?: boolean;
  open: boolean;
  onOk?: () => void;
  onClose: () => void;
}

const ModalDisconnect = (props: IPropsModalDisconnect) => {
  const t = useTranslations();
  const { isMultiple, isLoading, open, onOk, onClose } = props;

  return (
    <>
      <ModalBasic
        visible={open}
        onClosed={onClose}
        title={<p className="text-2xl not-italic font-bold text-[#3E3E3E] text-center">{t('modalConfirm.message')}</p>}
        closeIcon={false}
        className={styles.modalStyle}
      >
        <div className={classNames('flex justify-center items-center')}>
          <div className="mt-12 mb-16 flex flex-col justify-center items-center text-center">
            <div className="text-sm not-italic font-normal leading-[24px] text-center text-[#636363]">
              {isMultiple
                ? t('connectLocale.confirmMessageDeleteConnectionMultiple')
                : t('connectLocale.confirmMessageDeleteConnection')}
            </div>
            <div className="text-sm not-italic font-normal leading-[24px] text-center text-[#636363]">
              {t('contactLocale.restrictAccess')}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-6">
          <Button btnType="secondary" onClick={onClose} className="min-w-[170px]">
            {t('no')}
          </Button>
          <Button loading={isLoading} btnType="primary" onClick={onOk} className="min-w-[170px]">
            {t('yes')}
          </Button>
        </div>
      </ModalBasic>
    </>
  );
};

export default ModalDisconnect;
