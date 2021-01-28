import React, { Component } from 'react'
import { View, Text, Image, StatusBar, TouchableOpacity, ScrollView, TextInput, ToastAndroid } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import { connect } from "react-redux"
import { style } from "./styleLogin"

class Login extends Component {
    constructor() {
        super()
        this.state = {
            token: "",
            email: "",
            password: "",
            eye: true,
            loading: false,
            check: false
        }
    }
    login() {
        const { email, password } = this.state;
        this.setState({ loading: true })
        var dataToSend = {
            email: email,
            password: password
        };
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch("https://sampahbank.herokuapp.com/api/login", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                const { data } = responseJson;
                if (data) {
                    this.props.userLogin(data.token);
                    this.props.name(data.user.name);
                    this.props.role(data.role);
                    this.props.photo(data.user.photo);
                    const nama = ["nama", data.user.name]
                    const toke = ["token", data.token]
                    const rol = ["role", data.role[0]]
                    const avatar = ["photo", data.user.photo]
                    AsyncStorage.multiSet([nama, toke, rol, avatar]).then((value) => {
                        this.setState({ token: value })
                        data.role == "admin" || data.role == "bendahara"
                            ? alert("super admin dan bendahara tidak dapat login di platform mobile, silahkan login melalui PC, Terimakasih")
                            : data.role == "pengurus1"
                                ? this.props.navigation.replace("Pengurus1")
                                : data.role == "pengurus2"
                                    ? this.props.navigation.replace("Pengurus2")
                                    : this.props.navigation.replace("Dashboard")
                    });
                    data.role == "admin" || data.role == "bendahara"
                        ? ToastAndroid.show("Login Failed", ToastAndroid.SHORT)
                        : ToastAndroid.show("Login Success", ToastAndroid.SHORT);
                    this.setState({ loading: false })
                } else {
                    ToastAndroid.show("Email Atau Password Anda Salah", ToastAndroid.LONG);
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                console.error(error);
                this.setState({ loading: false })
            });
    }
    render() {
        return (
            <View style={style.container}>
                <StatusBar backgroundColor="#009387" />
                <View style={style.contentContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Intro")} style={style.button}>
                        <Image
                            source={require("../../assets/back.png")}
                            style={style.back}
                        />
                    </TouchableOpacity>
                    <Image
                        style={style.welcomeImage}
                        source={require("../../assets/gambar1.png")} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={style.text}>Email :</Text>
                        <View style={style.containerInput}>
                            <View style={style.cont}>
                                <Image
                                    source={require("../../assets/email.png")}
                                    style={[style.icon, { height: 14 }]}
                                />
                                <TextInput
                                    style={[style.input, { width: "82%" }]}
                                    underlineColorAndroid="#f2f3f7"
                                    placeholder="Email Address"
                                    keyboardType="email-address"
                                    onChangeText={(email) => this.setState({ email })}
                                    color="#009387"
                                />
                            </View>
                            <Image
                                source={
                                    this.state.email
                                        ? require("../../assets/checked.png")
                                        : require("../../assets/Kosong.png")}
                                style={style.check}
                            />
                        </View>
                        <Text style={style.text}>Password :</Text>
                        <View style={style.containerInput}>
                            <View style={style.cont}>
                                <Image
                                    source={require("../../assets/gembok.png")}
                                    style={[style.icon, { height: 20 }]}
                                />
                                <TextInput
                                    style={[style.input, { width: "77%" }]}
                                    underlineColorAndroid="#f2f3f7"
                                    secureTextEntry={this.state.eye}
                                    placeholder="Password"
                                    keyboardType="default"
                                    onChangeText={(password) => this.setState({ password })}
                                    color="#009387"
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ eye: !this.state.eye })}>
                                <Image
                                    source={
                                        this.state.eye
                                            ? require("../../assets/eyeClosed.png")
                                            : require("../../assets/eyeOpened.png")}
                                    style={style.eye}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.login()} style={style.btnWrapper}>
                            <LinearGradient
                                style={style.btn}
                                colors={["#009387", "#25f53a"]}>
                                {this.state.loading
                                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />)
                                    : (<Text style={style.label}>Login</Text>)}
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text onPress={() => this.props.navigation.navigate("Forgot")} style={style.forgotPassword}>Forgot Password ?</Text>
                    </ScrollView>
                </View>
                <View footerWrapper>
                    <Text style={style.footerText}>
                        <Text style={style.footerText1}>Don't have an account? </Text>
                        <Text onPress={() => this.props.navigation.navigate("Register")} style={style.footerText2}>Sign Up</Text>
                    </Text>
                </View>
            </View>
        )
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
    }
}
export default connect(null, mapDispatcToProps)(Login)
