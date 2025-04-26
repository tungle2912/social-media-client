/* eslint-disable @typescript-eslint/no-misused-promises */
import { Modal } from 'antd';
import React from 'react';
import Button from '~/components/form/Button';

interface Props {
  width?: number;
  onOk?: () => Promise<void>;
  onCancel?: () => void;
  textCancel?: string;
  textOk?: string;
  title?: string;
  description?: string | React.JSX.Element;
  isLoadingOk?: boolean;
  rootClassName?: any;
}

// can not control loading state of button anymore, if you want to control loading state, use useConfirmAlternative.tsx

const useConfirm = ({
  width = 450,
  onOk,
  onCancel,
  textCancel,
  textOk,
  title,
  description,
  rootClassName,
}: Props) => {
  const renderFooter = ({
    loading,
  }: {
    loading: boolean;
  }) => {
    return (
      <div className="text-center my-[24px]">
        <Button loading={loading} className="mr-[20px] font-bold" btnType="secondary" onClick={handleCancel}>
          {textCancel}
        </Button>
        <Button loading={loading} btnType="primary" onClick={handleOk} className="font-bold">
          {textOk}
        </Button>
      </div>
    );
  };

  const handleCancel = () => {
    Modal.destroyAll();
    if (onCancel) {
      onCancel();
    }
  };

  const handleOk = async () => {
    if (onOk) {
      showModal.update({
        footer: renderFooter({
          loading: true,
        }),
      });
      await onOk();
      Modal.destroyAll();
    } else {
      Modal.destroyAll();
    }
  };

  const defaultSetting = {
    width: width,
    wrapClassName: rootClassName,
    centered: true,
    title: <div className="text-center text-2xl text-base-dark-blue my-2">{title}</div>,
    content: <div className="text-center text-base text-black my-[30px]">{description}</div>,
    footer: renderFooter({
      loading: false,
    }),
  };

  const showModal = Modal.confirm(defaultSetting);
};

export default useConfirm;
