export const loginReducer = (prevState, action) => {
    switch(action.type){
        case 'LOGIN': 
            return {
                ...prevState,
                userName: action.userName,
                accessToken: action.accessToken,
                isLoading: false,
            }
        case 'LOGOUT':
            return {
                ...prevState,
                userName: null,
                accessToken: null,
                isLoading: false,
            }
    }
}



