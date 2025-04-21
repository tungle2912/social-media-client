import { Modal } from 'antd';
import { ModalProps } from 'antd/lib';
import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

interface ModalBasicProps extends ModalProps {
  visible: boolean;
  onClosed: () => void;
  children: React.ReactNode;
  title: string | React.ReactNode;
  className?: string;
  headerClassName?: string;
  closeIcon?: string | boolean | React.ReactElement;
}

export default function ModalBasic({
  visible,
  onClosed,
  children,
  title,
  className,
  headerClassName,
  closeIcon,
  ...props
}: ModalBasicProps) {
  return (
    <Modal
      title={title}
      className={classNames(styles.customInfoModal, className)}
      classNames={{
        header: classNames(styles.customHeader, headerClassName),
      }}
      centered={true}
      closeIcon={closeIcon}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      open={visible}
      destroyOnClose={true}
      onCancel={onClosed}
      {...props}
    >
      {children}
    </Modal>
  );
}
