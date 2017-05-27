import { combineReducers } from 'redux';
import { authReducer } from '@auth';
import userReducer from './user';
import userEventsReducer from './userEvents';
import repositoryReducer from './repository';
import organizationReducer from './organization';
import issueReducer from './issue';
import { searchReducer } from '@search';
import { notificationsReducer } from '@notifications';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  userEvents: userEventsReducer,
  repository: repositoryReducer,
  organization: organizationReducer,
  issue: issueReducer,
  search: searchReducer,
  notifications: notificationsReducer,
});

export default rootReducer;
