export const loginReducer = (prevState, action) => {
    switch(action.type){
        case 'LOGIN': 
            return {
                ...prevState,
                userName: action.userName,
                accessToken: action.accessToken,
                userId: action.userId,
                isLoading: false,
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



