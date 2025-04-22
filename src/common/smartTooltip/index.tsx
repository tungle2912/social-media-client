import { Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useDimension } from '~/hooks';


interface IProps {
  text: string;
  className?: string;
  title?: string;
  isCalendar?: boolean;
  isDraft?: boolean;
  onClick?: any;
}

const SmartTooltip = ({ text, title, className, isCalendar = false, onClick, isDraft = false }: IProps) => {
  const textRef = useRef<HTMLInputElement>(null);
  const [hasTooltip, setHasTooltip] = useState(false);
  const { isSM } = useDimension();

  useEffect(() => {
    const handleCollapse = () => {
      if (textRef.current) {
        if (
          textRef.current.offsetHeight < textRef.current.scrollHeight - 1 ||
          textRef.current.offsetWidth < textRef.current.scrollWidth - 1
        ) {
          setHasTooltip(true);
        } else {
          setHasTooltip(false);
        }
      }
    };
    handleCollapse();
  }, [text]);

  return hasTooltip ? (
    <Tooltip title={title || text} placement={isDraft && !isSM ? 'right' : 'topLeft'} rootClassName={isDraft ? styles.tooltipContent : undefined}>
      <p
        className={classNames({ [styles.lineClamp]: !isCalendar, [styles.lineClampNoDot]: isCalendar }, className)}
        ref={textRef}
        onClick={onClick}
      >
        {text}
      </p>
    </Tooltip>
  ) : (
    <p
      className={classNames({ [styles.lineClamp]: !isCalendar, [styles.lineClampNoDot]: isCalendar }, className)}
      ref={textRef}
      onClick={onClick}
    >
      {text}
    </p>
  );
};

export default SmartTooltip;
