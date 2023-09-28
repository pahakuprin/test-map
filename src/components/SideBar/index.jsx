import { useCallback } from 'react';

import { MOVE_TOOL, MEASURE_TOOL } from '../../constants';
import styles from './SideBar.module.css';

function SideBar({ currentCursor, onChange }) {
  const changeTool = useCallback(
    (event) => onChange?.(event?.target.dataset.type),
    [onChange]
  );

  const buttons = [
    {
      type: MOVE_TOOL,
      onChange: changeTool,
      label: 'move tool',
      title: 'Move tool [V]',
      text: 'move',
    },
    {
      type: MEASURE_TOOL,
      onChange: changeTool,
      label: 'measure population tool',
      title: 'Measure population tool [M]',
      text: 'measure',
    },
  ];

  return (
    <nav className={styles.sideBar}>
      {buttons.map((button) => (
        <label key={button.type} className={styles.button} title={button.title}>
          <input
            type='radio'
            checked={currentCursor === button.type}
            onChange={button.onChange}
            data-type={button.type}
            name='app-tool'
            area-label={button.label}
            className={styles.control}
          />
          {button.text}
        </label>
      ))}
    </nav>
  );
}

export default SideBar;
