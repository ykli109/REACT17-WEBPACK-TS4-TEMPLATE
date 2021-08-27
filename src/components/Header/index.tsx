/*
 * @file: 头部
 * @author: liyunkun
 */

import React, {useState} from 'react';
import styles from './index.module.less';

export default function Header() {
    const [count, useCount] = useState(0);

    return (
        <div className={styles.header}>
            <span className={styles.cartIcon}></span>
            <span className={styles.title}>
                购物车（{count}）
            </span>
        </div>
    );
}
