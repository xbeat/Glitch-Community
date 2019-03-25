import { currentUserSlice } from './current-user';
import { createStoreFromSlices, Provider } from '../utils';

const store = createStoreFromSlices([currentUserSlice]);

export const ReduxProvider = ({ children }) => <Provider store={store} />;
