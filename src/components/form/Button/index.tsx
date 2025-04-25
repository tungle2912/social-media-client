import React from 'react';
import { Button as ButtonLib, ButtonProps } from 'antd';
import classNames from 'classnames';
import styles from './styles.module.scss';
interface Props extends ButtonProps {
  className?: string
  btnType?: 'primary' | 'secondary' | 'negative' | 'gradient' | 'white' | 'coral' | 'tag' | 'ghost' | 'orange' | 'text' | 'textViolet' | 'dashed'
  sizeType?: 'xl' | 'large' | 'medium' | 'small'
  rounded?: 'small' | 'medium' | 'large' 
}

const Button: React.FC<Props> = ({
  type,
  children,
  rounded = 'large',
  className,
  btnType = 'white',
  sizeType = 'medium',
  ...props
}) => {
  return (
    <ButtonLib
      className={classNames(className, styles.customButton, {
        [styles.gradient]: btnType === 'gradient',
        [styles.white]: btnType === 'white',
        [styles.coral]: btnType === 'coral',
        [styles.tag]: btnType === 'tag',
        [styles.ghost]: btnType === 'ghost',
        [styles.orange]: btnType === 'orange',
        [styles.text]: btnType === 'text',
        [styles.dashed]: btnType === 'dashed',
        [styles.textViolet]: btnType === 'textViolet',
        [styles.typePrimary]: btnType === 'primary',
        [styles.typeSecondary]: btnType === 'secondary',
        [styles.typeNegative]: btnType === 'negative',
        [styles.sizeXl]: sizeType === 'xl',
        [styles.sizeLarge]: sizeType === 'large',
        [styles.sizeMedium]: sizeType === 'medium',
        [styles.sizeSmall]: sizeType === 'small',
        [styles.roundedSmall]: rounded === 'small',
        [styles.roundedMedium]: rounded === 'medium',
        [styles.roundedLarge]: rounded === 'large',
      })}
      type={type}
      {...props}
    >
      {children}
    </ButtonLib>
  );
};

export default Button;
