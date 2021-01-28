import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar } from 'react-native'
import LottieView from "lottie-react-native"
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from "react-redux"
import { style } from "./styleSplash";

class splashScreen extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
        }
        setTimeout(() => {
            AsyncStorage.getItem("token").then((value) => {
                if (value !== null) {
                    // this.setState({ token: value })
                    // console.log(this.state.token);
                    this.props.userData.userReducer.role == "admin" || this.props.userData.userReducer.role == "bendahara"
                        ? this.props.navigation.replace("Intro")
                        : this.props.userData.userReducer.role == "pengurus1"
                            ? this.props.navigation.replace("Pengurus1")
                            : this.props.userData.userReducer.role == "pengurus2"
                                ? this.props.navigation.replace("Pengurus2")
                                : this.props.navigation.replace("Dashboard")
                } else {
                    this.props.navigation.replace("Intro")
                }
            }).catch((error) => console.log(error))
        }, 4500);
    }
    render() {
        return (
            <View style={style.container}>
                <StatusBar backgroundColor="#009387" />
                <LottieView
                    source={require("../../assets/Logo.json")}
                    style={style.lottie}
                    autoPlay loop />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state,
    }
}

export default connect(mapStateToProps)(splashScreen);