import React from 'react';
import { currentUserSlice } from './current-user';
import { createStoreFromSlices, Provider } from './utils';

const store = createStoreFromSlices([currentUserSlice]);
window.store = store;
const ReduxProvider = ({ children }) => <Provider store={store}>{children}</Provider>;

export default ReduxProvider;
