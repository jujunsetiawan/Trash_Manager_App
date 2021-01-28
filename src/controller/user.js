import AsyncStorage from "@react-native-community/async-storage";

const defaultstate = {
    login: false,
    user: "",
    role: [],
    name: "",
    photo: "",
    telp: ""
}

const userToken = (state = defaultstate, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, login: true, user: action.payload }
        case 'SET_ROLE':
            return { ...state, login: true, role: action.payload }
        case 'SET_NAME':
            return { ...state, login: true, name: action.payload }
        case 'SET_PHOTO':
            return { ...state, login: true, photo: action.payload }
        case 'SET_TELP':
            return { ...state, login: true, telp: action.payload }
        default:
            return state
    }
}

export default userToken;