import { Button } from 'antd';
import styles from './styles.module.scss';
import clsx from 'clsx';
interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  placement?: string;
}
export default function AuthButton({ children, icon, onClick, loading, disabled, className }: Readonly<Props>) {
  return (
    <div className={clsx(styles.authButton, className)}>
      <Button htmlType="submit" icon={icon} onClick={onClick} loading={loading} disabled={disabled} className="w-full">
        {children}
      </Button>
    </div>
  );
}
