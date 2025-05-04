import { InputProps } from 'antd/lib';
import classNames from 'classnames';
import React from 'react';


import styles from './styles.module.scss'
import InputBasic from '~/common/input/InputBasic';
import { SearchIcon } from '~/common/icon';

interface ICustomInputProps extends InputProps {
  className?: string;
  border?: boolean;
  rounded?: boolean;
  placement?: string;
}

export default function InputSearch({ border = true, className, placement = '',...props }: ICustomInputProps) {
  return (
    <InputBasic
      className={classNames(styles.customInput, styles.inputSearch, className, {
        [styles.border]: border,
      })}
      {...props}
      prefix={ <SearchIcon />}
    />
  );
}
