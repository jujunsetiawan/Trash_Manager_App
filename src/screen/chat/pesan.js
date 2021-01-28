import React, { Component } from 'react'
import { Text, View, Image, Modal, ImageBackground, TextInput, TouchableOpacity, Animated, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert, RefreshControl, ToastAndroid } from 'react-native';
import LottieView from "lottie-react-native"
import LinearGradient from "react-native-linear-gradient"
import Pusher from "pusher-js/react-native"
import { connect } from "react-redux"

export class pesan extends Component {
    constructor() {
        super()
        this.state = {
            message: "",
            chatMessage: [],
            token: "",
            wait: false,
            dari: {}
        }
    }

    componentDidMount() {
        this.getMessage()
        Pusher.logToConsole = true;

        var pusher = new Pusher(`ea9cc38ebb4b891afb5b`, {
            cluster: "ap1"
        })
        var channel = pusher.subscribe("my-channel");
        channel.bind("my-event", (data) => {
            this.setState({ loading: true, wait: true })
            this.getMessage()
            this.setState({ wait: false, message: "" })
        })
    }

    getMessage() {
        const { kontak } = this.props.route.params
        this.setState({ wait: true })
        fetch(`https://sampahbank.herokuapp.com/api/chat/${kontak.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                const { code } = responseJson;
                if (code) {
                    this.setState({ chatMessage: responseJson.data.sort((a, b) => a.id - b.id) });
                    this.setState({ loading: false })
                    this.setState({ wait: false })
                } else {
                    ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
            });
    }
    sendMessage() {
        const { kontak } = this.props.route.params
        const { message } = this.state;
        if (message !== "") {
            const kirim = {
                message: message,
            };
            fetch(`https://sampahbank.herokuapp.com/api/chat/${kontak.id}`, {
                method: 'POST',
                body: JSON.stringify(kirim),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.props.userData.userReducer.user}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                })
                .catch((error) => {
                    console.log("upload error", error);
                })
        }
    }
    deletePesan(id) {
        this.setState({ loading: true });
        fetch(`https://sampahbank.herokuapp.com/api/chat/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            },
        })

            .then((response) => response.json())
            .then((json) => {
                const { code } = json;
                console.log(json);
                if (code == json) {
                    ToastAndroid.show("Pesan Berhasil di Hapus", ToastAndroid.LONG);
                    this.getMessage()
                } else {
                    ToastAndroid.show("Gagal Menghapus Pesan", ToastAndroid.SHORT);
                }
            })
            .catch((error) => console.log(error))
    }
    alertDelete(id) {
        Alert.alert(
            'Peringatan',
            'Apakah Anda Yakin Ingin Meghapus Pesan Ini ?',
            [
                {
                    text: 'Batal',
                    onPress: () => console.log('Cancel Pressed'),
                },
                { text: 'Hapus', onPress: () => this.deletePesan(id) },
            ],
            { cancelable: false },
        );
    }
    newJam() {
        var tanggal = new Date();
        return tanggal.getHours();
    }

    newMenit() {
        var tanggal = new Date();
        return tanggal.getMinutes();
    }

    render() {
        const { kontak } = this.props.route.params
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient style={style.header} colors={["#009387", "#009350"]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                source={require("../../assets/arrow.png")}
                                style={style.logo}
                            />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: kontak.photo }}
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                        />
                        <View style={{ marginTop: 5, marginLeft: 10, width: "70%" }}>
                            <Text numberOfLines={1} style={style.title}>{kontak.name}</Text>
                            {this.state.loading && kontak.id !== kontak.id ? (
                                <Text style={{ fontSize: 13, color: "#fff", marginVertical: 3 }}>Mengetik...</Text>
                            ) : (
                                    <Text style={{ fontSize: 13, color: "#fff", marginVertical: 3 }}>Online</Text>
                                )}
                        </View>
                    </View>
                </LinearGradient>
                {this.state.wait ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <LottieView source={require("../../assets/36546-live-chating.json")} style={{ height: 250, alignSelf: "center" }} autoPlay loop />
                        <Text style={{ fontSize: 17, opacity: 0.5 }}>Harap Tunggu ...</Text>
                    </View>
                ) : (
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                ref={(ref) => {
                                    this.scrollView = ref;
                                }}
                                onContentSizeChange={() => {
                                    this.scrollView.scrollToEnd({ animated: false })
                                }}
                                showsVerticalScrollIndicator={false}
                                style={{ flex: 1 }}>
                                {this.state.chatMessage.map((item, index) => (
                                    <View key={index}>
                                        {item.to == kontak.id ? (
                                            <TouchableOpacity onLongPress={() => this.alertDelete(item.id)}>
                                                <Text style={{ textAlign: "right", fontSize: 12, opacity: 0.4, marginRight: 10, marginTop: 5 }}>{item.created_at}</Text>
                                                <View style={style.containermessage}>
                                                    <Text style={{ color: "white", marginRight: 25 }}>{item.message}</Text>
                                                    {item.is_read == 0 ? (
                                                        <Image
                                                            source={require("../../assets/check-symbol.png")}
                                                            style={{ height: 10, width: 10, tintColor: "white", alignSelf: "flex-end" }}
                                                        />
                                                    ) : (
                                                            <Image
                                                                source={require("../../assets/doublecheklist.png")}
                                                                style={{ height: 15, width: 15, tintColor: "white", alignSelf: "flex-end" }}
                                                            />
                                                        )}
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontSize: 12, opacity: 0.4, marginTop: 5 }}>{item.created_at}</Text>
                                                    <View style={style.containermessages}>
                                                        <Text style={{ marginRight: 25 }}>{item.message}</Text>
                                                        <Text style={{ alignSelf: "flex-end", fontSize: 10, opacity: 0.5 }}>{this.newJam()} : {this.newMenit()}</Text>
                                                    </View>
                                                </View>
                                            )}
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ marginBottom: 10 }}>
                                <View style={style.massage}>
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../../assets/emoticon.png")}
                                            style={style.logo1}
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        autoCorrect={false}
                                        onSubmitEditing={() => this.sendMessage()}
                                        value={this.state.message}
                                        onChangeText={(message) => this.setState({ message })}
                                        returnKeyType="send"
                                        multiline={true}
                                        placeholder="Ketikan Pesan"
                                        style={style.textinput} />
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../../assets/attachmen.png")}
                                            style={style.logo1} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginBottom: 15, alignSelf: "flex-end" }}>
                                        <Image
                                            source={require("../../assets/voice.png")}
                                            style={style.logo1}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => this.sendMessage()} style={style.send}>
                                    <Image
                                        source={require("../../assets/sendbutton.png")}
                                        style={style.logo2}
                                    />
                                </TouchableOpacity>
                            </View>
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

export default connect(mapStateToProps)(pesan)

const style = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 2.5
    },
    logo: {
        height: 25,
        width: 35,
        tintColor: "white",
        marginHorizontal: 5
    },
    title: {
        fontSize: 16,
        color: "white",
    },
    logo1: {
        height: 20,
        width: 20,
        tintColor: "grey",
        marginLeft: 10,
        marginTop: 15
    },
    logo2: {
        height: 20,
        width: 20,
        tintColor: "dodgerblue",
        marginLeft: 5
    },
    massage: {
        // height: 40,
        maxHeight: 150,
        width: "80.5%",
        backgroundColor: "white",
        bottom: 0,
        left: 10,
        borderRadius: 10,
        flexDirection: "row",
        // alignItems: "center",
    },
    textinput: {
        marginLeft: 10,
        fontSize: 16,
        width: "65%",
        padding: 0,
        borderColor: "#fff"
        // height: 40
    },
    send: {
        position: "absolute",
        bottom: 0,
        right: 5,
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    containermessage: {
        padding: 5,
        maxWidth: "70%",
        alignSelf: "flex-end",
        backgroundColor: "#009387",
        borderRadius: 5,
        marginVertical: 5,
        marginRight: 10,
    },
    containermessages: {
        padding: 5,
        maxWidth: "70%",
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 5,
        marginVertical: 5,
        marginLeft: 10
    }
})