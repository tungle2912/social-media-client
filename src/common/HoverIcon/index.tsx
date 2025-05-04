import { Tooltip } from 'antd';
import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';
import colorSystem from '~/theme/color'

interface Props {
  disabled?: boolean;
  icon: React.ReactElement;
  color?: 'primary' | 'white';
  onClick?: () => void;
  tooltipTitle?: string;
}

const HoverIcon: React.FC<Props> = ({ disabled, color = 'primary', icon, onClick, tooltipTitle }) => {
  return (
    <Tooltip overlayClassName={styles.modalTooltip} title={tooltipTitle} color={colorSystem.black[100]}>
      <div
        className={classNames(styles.deleteIcon, styles[color], { ['pointer-events-none']: disabled })}
        onClick={() => onClick && onClick()}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default HoverIcon;
