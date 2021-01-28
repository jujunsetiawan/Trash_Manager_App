import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ToastAndroid } from 'react-native'
import LinearGradient from "react-native-linear-gradient"
import style from "./styleForgotpass"
import LottieView from "lottie-react-native"

class Forgot extends Component {
  constructor() {
    super()
    this.state = {
      surel: ""
    }
  }

  forgotPass() {
    const { surel } = this.state;
    this.setState({ loading: true })
    if (surel !== "") {
      const change = {
        email: surel,
      };
      fetch('https://sampahbank.herokuapp.com/api/password/email', {
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
          ToastAndroid.show("Success", ToastAndroid.SHORT);
          this.setState({ loading: false });
          this.props.navigation.navigate("Reset")
        })
        .catch((error) => {
          console.log("upload error", error);
          ToastAndroid.show(error, ToastAndroid.LONG);
          this.setState({ loading: false });
        })
    } else {
      ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image
            source={require("../../assets/back.png")}
            style={style.logo}
          />
        </TouchableOpacity>
        <Text style={style.login}>Forgot Your Password ?</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.content}>
            <Image
              source={require("../../assets/gembok.png")}
              style={{ height: 100, width: 100, alignSelf: "center", tintColor: "#009387", marginBottom: 30 }}
            />
            <Text style={{ textAlign: "center", color: "#009387", marginBottom: 20 }}>We just need your registered email address to send you password reset.</Text>
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
            <TouchableOpacity onPress={() => this.forgotPass()}>
              <LinearGradient style={style.button} colors={["#009387", "#25f53a"]}>
                {this.state.loading
                  ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />
                  : <Text style={{ color: "white" }}>Confirm</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state,
  }
}

export default Forgot;
