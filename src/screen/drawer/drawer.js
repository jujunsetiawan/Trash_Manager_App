import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, StatusBar, TouchableNativeFeedback, Alert } from 'react-native'
import AsyncStorage from "@react-native-community/async-storage"
import { connect } from "react-redux"
import { style } from "./styleDrawer"

class Drawer extends Component {
    constructor() {
        super();
    }
    alertLogout() {
        Alert.alert(
            'Peringatan',
            'Apakah Anda Yakin Ingin Logout ?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                },
                { text: 'Logout', onPress: () => this.logOut() },
            ],
            { cancelable: false },
        );
    }
    logOut() {
        AsyncStorage.clear();
        this.props.navigation.replace('Login');
    }
    render() {
        return (
            <View style={style.container}>
                <StatusBar backgroundColor="#009389" />
                <Image
                    style={style.bg}
                    source={require("../../assets/bg1.png")} />
                <View style={style.top}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={style.button}>
                        <Image
                            source={require("../../assets/back.png")}
                            style={style.back}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("editProfile")} style={style.img}>
                        <Image
                            source={{uri: this.props.userData.userReducer.photo }}
                            style={style.avatar}
                        />
                    </TouchableOpacity>
                    <View style={style.cont}>
                        <Text style={style.name}>{this.props.userData.userReducer.name}</Text>
                        <Text style={style.no}>{this.props.userData.userReducer.telp}</Text>
                    </View>
                </View>
                <View style={style.mid}>
                    <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("editProfile")}>
                        <View style={style.containerList}>
                            <Image
                                source={require("../../assets/user.png")}
                                style={style.icon}
                            />
                            <Text style={style.textList}>Ubah Profile</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback>
                        <View style={[style.containerList]}>
                            <Image
                                source={require("../../assets/settings.png")}
                                style={style.icon1}
                            />
                            <Text style={style.textList}>Pengaturan</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <View style={style.line}></View>
                    <TouchableNativeFeedback>
                        <View style={style.containerList}>
                            <Image
                                source={require("../../assets/question.png")}
                                style={style.icon1}
                            />
                            <Text style={style.textList}>Bantuan</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback>
                        <View style={style.containerList}>
                            <Image
                                source={require("../../assets/about.png")}
                                style={style.icon1}
                            />
                            <Text style={style.textList}>About</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.alertLogout()}>
                        <View style={style.logout}>
                            <Text style={{ color: "#FFF", marginBottom: 3 }}>Logout</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state,
    }
}

export default connect(mapStateToProps, null)(Drawer)