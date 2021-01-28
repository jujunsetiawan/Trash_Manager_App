import React, { Component } from 'react'
import { View, Text, Image, StatusBar, TouchableOpacity, ScrollView, TextInput, ToastAndroid } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import { style } from "./styleRegister"

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            loading: false,
            eye: true,
            mata: true,
            check: false
        }
    }
    register() {
        const { username, email, password, confirmPassword } = this.state;
        this.setState({ loading: true })

        var dataToSend = {
            name: username,
            email: email,
            password: password,
            password_confirmation: confirmPassword
        };

        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch("https://sampahbank.herokuapp.com/api/register", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            }
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON);
                const { data } = responseJSON;
                if (data.token) {
                    ToastAndroid.show("Register Success", ToastAndroid.SHORT);
                    this.props.navigation.replace("Login");
                    this.setState({ loading: false })
                } else {
                    ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.log(error);
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                this.setState({ loading: false })
            });
    }
    render() {
        return (
            <View style={style.container}>
                <StatusBar backgroundColor="#009387" />
                <View style={style.contentContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={style.button}>
                        <Image
                            source={require("../../assets/back.png")}
                            style={style.back}
                        />
                    </TouchableOpacity>
                    <Image
                        style={style.welcomeImage}
                        source={require("../../assets/gambar2.png")} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={style.text}>Name :</Text>
                        <View style={style.containerInput}>
                            <View style={style.cont}>
                                <Image
                                    source={require("../../assets/orang.png")}
                                    style={[style.icon, { height: 19 }]}
                                />
                                <TextInput
                                    style={[style.input, { width: "82%" }]}
                                    underlineColorAndroid="#f2f3f7"
                                    placeholder="Username"
                                    keyboardType="default"
                                    onChangeText={(username) => this.setState({ username })}
                                    color="#009387"
                                />
                            </View>
                            <Image
                                source={
                                    this.state.username !== ""
                                        ? require("../../assets/checked.png")
                                        : require("../../assets/Kosong.png")}
                                style={style.check}
                            />
                        </View>
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
                        <Text style={style.text}>Confirm Password :</Text>
                        <View style={style.containerInput}>
                            <View style={style.cont}>
                                <Image
                                    source={require("../../assets/gembok.png")}
                                    style={[style.icon, { height: 20 }]}
                                />
                                <TextInput
                                    style={[style.input, { width: "77%" }]}
                                    underlineColorAndroid="#f2f3f7"
                                    secureTextEntry={this.state.mata}
                                    placeholder="Confirm Password"
                                    keyboardType="default"
                                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                    color="#009387"
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ mata: !this.state.mata })}>
                                <Image
                                    source={
                                        this.state.mata
                                            ? require("../../assets/eyeClosed.png")
                                            : require("../../assets/eyeOpened.png")}
                                    style={style.eye}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.register()} style={style.btnWrapper}>
                            <LinearGradient
                                style={style.btn}
                                colors={["#009387", "#25f53a"]}>
                                {this.state.loading
                                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />)
                                    : (<Text style={style.label}>Sign Up</Text>)}
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={style.privacyPolicyCehckWrapper}>
                            <View style={style.privacyPolicyLabelWrapper}>
                                <Text style={style.subTitle}>i have read the </Text>
                                <Text style={style.link}>Privacy Policy</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({check: !this.state.check})}>
                                <Image
                                    source={
                                        this.state.check
                                            ? require("../../assets/checkbox.png")
                                            : require("../../assets/checklist.png")}
                                    style={style.checkbox}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <View footerWrapper>
                    <Text style={style.footerText}>
                        <Text style={style.footerText1}>Already have an account? </Text>
                        <Text onPress={() => this.props.navigation.navigate("Login")} style={style.footerText2}>Sign In</Text>
                    </Text>
                </View>
            </View>
        )
    }
}

export default Register
