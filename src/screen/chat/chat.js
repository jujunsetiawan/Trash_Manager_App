import React, { Component } from 'react'
import { Text, View, Image, Modal, ImageBackground, TextInput, TouchableOpacity, Animated, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert, RefreshControl, ToastAndroid } from 'react-native';
import LinearGradient from "react-native-linear-gradient"
import LottieView from "lottie-react-native"
import { connect } from "react-redux"

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            loading: false,
            refresh: false,
            kontak: [],
            notiv: []
        }
    }

    componentDidMount() {
        this.getKontak()
    }

    getKontak() {
        this.setState({ loading: true })
        fetch("https://sampahbank.herokuapp.com/api/message", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                const { code } = responseJson;
                if (code) {
                    this.setState({ kontak: responseJson.data });
                    this.setState({ loading: false })
                } else {
                    ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG)
            });
    }

    render() {
        return (
            <View>
                <LinearGradient style={style.header} colors={["#009387", "#009350"]}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image
                                    source={require("../../assets/arrow.png")}
                                    style={style.logo1}
                                />
                            </TouchableOpacity>
                            <Text style={style.title}>Kontak</Text>
                        </View>
                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("Card")}>
                            <Image
                                source={{ uri: 'https://img.icons8.com/material-sharp/2x/shopping-cart.png' }}
                                style={style.logo}
                            />
                        </TouchableOpacity> */}
                    </View>
                </LinearGradient>
                {this.state.loading ? (
                    <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../../assets/4949-loading-circle-gradient.json")} style={{ height: 110, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5, marginBottom: 120 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <View>
                            {this.state.kontak == "" ? (
                                <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal: 10 }}>
                                    <LottieView
                                        source={require("../../assets/36546-live-chating.json")} autoPlay loop
                                        style={{ height: 250, width: 250 }}
                                    />
                                    <Text style={{ opacity: 0.6, textAlign: "center" }}>Kontak Kosong</Text>
                                </View>
                            ) : (
                                    <ScrollView
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refreshing}
                                                onRefresh={() => {
                                                    this.getKontak()
                                                    this.setState({ refresh: true })
                                                }}
                                            />
                                        }
                                        showsVerticalScrollIndicator={false}>
                                        {this.state.kontak.map((item, index) => (
                                        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("Pesan", { kontak: item })} style={style.cont}>
                                            <Image
                                                source={{ uri: item.photo }}
                                                style={style.avatar}
                                            />
                                            <View style={{ height: 70, width: "60%", borderBottomColor: "#f0f0f0", justifyContent: "center", borderBottomWidth: 1 }}>
                                                <View style={{ marginBottom: 10 }}>
                                                    <Text numberOfLines={1} style={{ fontSize: 17, marginVertical: 3 }}>{item.name}</Text>
                                                    <Text numberOfLines={1} style={{ fontSize: 13, opacity: 0.4 }}>Pesan Terakhir</Text>
                                                </View>
                                            </View>
                                            <View style={{ height: 70, width: "20%", borderBottomWidth: 1, borderBottomColor: "#f0f0f0", alignItems: "center" }}>
                                                <Text style={{ opacity: 0.4, marginTop: 15, fontSize: 13 }}>00 : 00</Text>
                                                {/* {this.state.notiv.map((value, index) => (
                                                        <View key={index}>
                                                            {value.id == item.id ? (
                                                                <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: "#009387", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                                                                    <Text style={{ color: "#fff", fontSize: 12 }}>{value.unread}</Text>
                                                                </View>
                                                            ) : (
                                                                    null
                                                                )}
                                                        </View>
                                                    ))} */}
                                            </View>
                                        </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                        </View>
                    )}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state,
    }
}

export default connect(mapStateToProps)(Chat)

const style = StyleSheet.create({
    header: {
        height: 40,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    logo1: {
        height: 20,
        width: 25,
        marginLeft: 15,
        marginRight: 5,
        tintColor: "#fff"
    },
    title: {
        color: "white",
        marginLeft: 10,
        fontWeight: "700",
        fontSize: 16
    },
    avatar: {
        height: 55,
        width: "15.5%",
        borderRadius: 30,
        marginHorizontal: 10
    },
    cont: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    logo: {
        height: 23,
        width: 23,
        tintColor: "white",
        marginVertical: 10,
        marginRight: 7
    },
})