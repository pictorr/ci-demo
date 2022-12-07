import cloneDeep from 'lodash/cloneDeep';

export default function usersReducer(state = cloneDeep(defaultState), action) {
    let newState = cloneDeep(state);
    switch (action.type) {
        case 'GET_USER': {
            newState.fetchingUser = true;
            newState.fetchingUserError = '';
            return newState;
        }
        case 'GET_USER_FULFILLED': {
            newState.fetchingUser = false;
            newState.user = action.payload.user;
            return newState;
        }
        case 'GET_USER_REJECTED': {
            newState.fetchingUser = false;
            newState.fetchingUserError = action.payload.error;
            return newState;
        }
        case 'GET_USERS': {
            newState.fetchingUsers = true;
            newState.fetchingUsersError = '';
            return newState;
        }
        case 'GET_USERS_FULFILLED': {
            newState.fetchingUsers = false;
            newState.users = action.payload.users;
            return newState;
        }
        case 'GET_USERS_REJECTED': {
            newState.fetchingUsers = false;
            newState.fetchingUsersError = action.payload.error;
            return newState;
        }
        case 'UPDATE_USER': {
            newState.savingUser = true;
            newState.savingUserError = '';
            return newState;
        }
        case 'UPDATE_USER_FULFILLED': {
            newState.savingUser = false;
            let findUserIndex = newState.users.findIndex(user => {
                return user.id === action.payload.user.id;
            });
            if (findUserIndex !== -1) {
                newState.users[findUserIndex] = action.payload.user;
            }
            return newState;
        }
        case 'UPDATE_USER_REJECTED':
        case 'SAVE_USER_REJECTED': {
            newState.savingUser = false;
            newState.savingUserError = action.payload.error;
            return newState;
        }
        default:
            return newState;
    }
}

const defaultState = {
    fetchingUsers: true,
    fetchingUsersError: '',
    fetchingUser: true,
    fetchingUserError: '',
    user:{},
    users: [],
    savingUser: false,
    savingUserError: '',
};