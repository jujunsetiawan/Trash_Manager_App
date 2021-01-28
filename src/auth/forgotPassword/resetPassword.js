import React, { Component } from 'react'
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import style from "./styleForgotpass"
import LottieView from "lottie-react-native"

export class resetPassword extends Component {
    constructor() {
        super();
        this.state = {
            surel: "",
            newPassword: "",
            confirmPassword: "",
            token: "",
            loading: false
        }
    }

    resetPass() {
        const { surel, newPassword, confirmPassword, token } = this.state;
        this.setState({ loading: true })
        if (newPassword && confirmPassword && token && surel !== "") {
            const change = {
                email: surel,
                password: newPassword,
                password_confirmation: confirmPassword,
                token: token
            };
            fetch('https://sampahbank.herokuapp.com/api/password/reset', {
                method: 'POST',
                body: JSON.stringify(change),
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Password Telah Di Reset", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.replace("Login")
                })
                .catch((error) => {
                    console.log("upload error", error);
                    ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                    this.setState({ loading: false });
                })
        } else {
            ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
            this.setState({ loading: false })
        }
    }

    render() {
        return (
            <View style={style.container1}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 15 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image
                            source={require("../../assets/back.png")}
                            style={style.logo1}
                        />
                    </TouchableOpacity>
                    <View style={style.content1}>
                        <Image
                            source={require("../../assets/gembok.png")}
                            style={{ height: 80, width: 80, alignSelf: "center", tintColor: "#009387", marginBottom: 20 }}
                        />
                        <Text style={{ textAlign: "center", color: "#009387", marginBottom: 20, fontSize: 12 }}>Your new password must be different from previous used passwords.</Text>
                        <Text style={{ marginLeft: 2, opacity: 0.6 }}>Email :</Text>
                        <View style={style.textinput}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    source={require("../../assets/email.png")}
                                    style={{ height: 15, width: 22, tintColor: "#009387", marginLeft: 2, marginTop: 5 }}
                                />
                                <TextInput
                                    placeholder="Input your email"
                                    selectionColor="#009387"
                                    color="#009387"
                                    keyboardType="email-address"
                                    onChangeText={(surel) => this.setState({ surel })} v
                                    style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                                />
                            </View>
                        </View>
                        <Text style={{ marginLeft: 2, opacity: 0.6, fontSize: 13, marginTop: 20 }}>New Password :</Text>
                        <View style={style.textinput}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    source={require("../../assets/gembok.png")}
                                    style={{ height: 22, width: 20, tintColor: "#009387", marginLeft: 2 }}
                                />
                                <TextInput
                                    placeholder="New Password"
                                    selectionColor="#009387"
                                    color="#009387"
                                    secureTextEntry={true}
                                    keyboardType="default"
                                    onChangeText={(newPassword) => this.setState({ newPassword })}
                                    style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                                />
                            </View>
                        </View>
                        <Text style={{ marginLeft: 2, opacity: 0.6, marginTop: 20, fontSize: 13 }}>Confirm Password :</Text>
                        <View style={style.textinput}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    source={require("../../assets/gembok.png")}
                                    style={{ height: 22, width: 20, tintColor: "#009387", marginLeft: 2 }}
                                />
                                <TextInput
                                    placeholder="Confirm Password"
                                    selectionColor="#009387"
                                    color="#009387"
                                    secureTextEntry={true}
                                    keyboardType="default"
                                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                    style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                                />
                            </View>
                        </View>
                        <Text style={{ marginLeft: 2, opacity: 0.6, marginTop: 20, fontSize: 13 }}>Token :</Text>
                        <View style={style.textinput}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    source={require("../../assets/gembok.png")}
                                    style={{ height: 22, width: 20, tintColor: "#009387", marginLeft: 2 }}
                                />
                                <TextInput
                                    placeholder="input Token From Email"
                                    selectionColor="#009387"
                                    color="#009387"
                                    keyboardType="default"
                                    onChangeText={(token) => this.setState({ token })}
                                    style={{ borderColor: "white", marginLeft: 5, width: "90%" }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.resetPass()}>
                            <LinearGradient style={style.button} colors={["#009387", "#25f53a"]}>
                                {this.state.loading
                                    ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />
                                    : <Text style={{ color: "white" }}>Confirm</Text>}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default resetPassword
