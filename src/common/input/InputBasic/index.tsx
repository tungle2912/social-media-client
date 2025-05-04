import { Input, InputProps } from 'antd';
import styles from '../styles.module.scss';
import classNames from 'classnames';

interface ICustomInputProps extends InputProps {
  className?: string
  rounded?: boolean
}

export default function InputBasic({ rounded, className, ...props }: ICustomInputProps) {
  return (
    <div className={classNames(className, styles.customInput, {
      [styles.rounded]: rounded,
    })}>
      <Input {...props}/>
    </div>
  );
}
