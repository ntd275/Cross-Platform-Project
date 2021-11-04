export const loginReducer = (prevState, action) => {
    switch(action.type){
        case 'LOGIN': 
            return {
                ...prevState,
                userName: action.username,
                accessToken: action.accessToken,
                userId: action.userId,
                isLoading: false,
                socket:  action.socket,
            }
        case 'LOGOUT':
            return {
                ...prevState,
                userName: null,
                accessToken: null,
                userId: null,
                isLoading: false,
            }
    }
}



