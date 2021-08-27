/*
 * @file: 项目入口
 * @author: ykli109@outlook.com
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './index.less';

export const setup = () => {
    const reactAppContainer = document.createElement('div');
    reactAppContainer.id = 'react-app-wrapper';
    document.body.appendChild(reactAppContainer);

    ReactDOM.render(
        <App />,
        reactAppContainer
    );
};
