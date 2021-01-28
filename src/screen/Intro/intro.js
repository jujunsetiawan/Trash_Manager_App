import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StatusBar } from 'react-native'
import { style } from "./styleIntro"
import LinearGradient from "react-native-linear-gradient"

class Intro extends Component {
    render() {
        return (
            <View style={style.container}>
                <StatusBar backgroundColor="#009387"/>
                <Image
                    style={style.bg}
                    source={require("../../assets/bg1.png")} />
                <View style={style.contentContainer}>
                    <View style={style.top}>
                        <Text style={style.brand}>Gomi Trash</Text>
                        <Image
                            style={style.welcomeImage}
                            source={require("../../assets/gambar.png")} />
                        <Text style={style.heading}>We are what we do</Text>
                        <Text style={style.subHeading}>Toushand of people are using Gomi Trash for management trash</Text>
                    </View>
                    <View style={style.bottom}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")} style={style.btnWrapper}>
                                <LinearGradient
                                    style={style.btn}
                                    colors={["#009387", "#25f53a"]}>
                                    <Text style={style.label}>Sign Up</Text>
                                </LinearGradient>
                        </TouchableOpacity>
                        <Text style={style.loginWrapper}>
                            <Text style={style.notificationContent}>
                                Already have an account ?
                            </Text>{" "}
                            <Text onPress={() => this.props.navigation.navigate("Login")} style={style.link}>Log In</Text>
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default Intro
