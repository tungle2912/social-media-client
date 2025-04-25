import React, { useState, ReactNode } from 'react';
import styles from './styles.module.scss';
import ModalBasic from '~/components/modal/modalBasic';
import Button from '~/components/form/Button';

interface ConfirmProps {
  visible: boolean;
  onClosed: () => void;
  title: ReactNode;
  description: ReactNode;
  textOk?: string;
  textCancel?: string;
  onOk: () => Promise<void>;
  onCancel?: () => void;
}

const ModalConfirm: React.FC<ConfirmProps> = ({
  visible,
  onClosed,
  title,
  description,
  textOk = 'Yes',
  textCancel = 'No',
  onOk,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = async () => {
    setIsLoading(true);
    try {
      await onOk();
    } finally {
      setIsLoading(false);
      onClosed();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClosed();
  };

  return (
    <ModalBasic visible={visible} onClosed={onClosed} title={title} closeIcon={false} className={styles.modalStyle}>
      <div className={styles.centerContent}>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.buttonGroup}>
        <Button btnType="secondary" onClick={handleCancel} className={styles.button}>
          {textCancel}
        </Button>
        <Button loading={isLoading} btnType="primary" onClick={handleOk} className={styles.button}>
          {textOk}
        </Button>
      </div>
    </ModalBasic>
  );
};

export default ModalConfirm;
