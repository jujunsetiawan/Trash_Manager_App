import React, { Component } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Register from "../auth/Register/register"
import Login from "../auth/Login/login"
import Forgot from "../auth/forgotPassword/forgotPassword"
import Reset from "../auth/forgotPassword/resetPassword"
import Splash from "../screen/splashScreen/splashScreen"
import Intro from "../screen/Intro/intro"
import editProfile from "../screen/editProfile/editProfile"
import Dashboard from "../screen/Dashboard/Dashboard"
import Dashboard1 from "../screen/DashboardP1/DashboardP1"
import Dashboard2 from "../screen/DashboardP2/DashboardP2"
import Angkut from "../screen/Detail/Detail"
import Cancle from "../screen/cancleAngkut/cancleAngkut"
import Setor from "../screen/setor/setorSampah"
import Chat from "../screen/chat/chat"
import Pesan from "../screen/chat/pesan"
import AsyncStorage from "@react-native-community/async-storage"
import { connect } from "react-redux"

const Stack = createStackNavigator();

class Navigation extends Component {
    getData = async () => {
        let value
        try {
            value = AsyncStorage.multiGet([
                "nama", "token", "role", "photo", "phone"
            ])
                .then((value) => {
                    this.props.name(value[0][1]);
                    this.props.userLogin(value[1][1]);
                    this.props.role(value[2][1]);
                    this.props.photo(value[3][1]);
                    this.props.phone(value[4][1]);
                })
        } catch (error) {
            console.log(error, "mainnya hebat");
        }
    }

    componentDidMount() {
        this.getData();
    }
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                    <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
                    <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="Forgot" component={Forgot} options={{ headerShown: false }} />
                    <Stack.Screen name="editProfile" component={editProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="Pengurus1" component={Dashboard1} options={{ headerShown: false }} />
                    <Stack.Screen name="Pengurus2" component={Dashboard2} options={{ headerShown: false }} />
                    <Stack.Screen name="Angkut" component={Angkut} options={{ headerShown: false }} />
                    <Stack.Screen name="Cancle" component={Cancle} options={{ headerShown: false }} />
                    <Stack.Screen name="Setor" component={Setor} options={{ headerShown: false }} />
                    <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
                    <Stack.Screen name="Pesan" component={Pesan} options={{ headerShown: false }} />
                    <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state,
    }
}

const mapDispatcToProps = (dispatch) => {
    return {
        userLogin: (token) => dispatch({
            type:
                'SET_USER', payload: token
        }),
        name: (name) => dispatch({
            type:
                'SET_NAME', payload: name
        }),
        role: (role) => dispatch({
            type:
                'SET_ROLE', payload: role
        }),
        photo: (photo) => dispatch({
            type:
                'SET_PHOTO', payload: photo
        }),
        phone: (phone) => dispatch({
            type:
                'SET_TELP', payload: phone
        }),
    }
}

export default connect(mapStateToProps, mapDispatcToProps)(Navigation);
