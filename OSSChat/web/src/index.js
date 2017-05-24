
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import Stores from '../../js/stores';
import {
  StitchClient,
} from 'stitch';
import App from './App';

const storesInstance = new Stores();
storesInstance.initialize({ StitchClient });
window.stores = storesInstance;

const Root = () => (
  <Provider
    store={storesInstance}
    groupStore={storesInstance.groupStore}
    uploader={storesInstance.uploader}
    uiState={storesInstance.uiState}
    nativeStore={storesInstance.nativeStore}
  >
    <App />
  </Provider>
);

render(<Root />, document.querySelector('#app'));
