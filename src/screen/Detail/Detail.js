import React, { Component } from 'react'
import { Text, View, Image, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, TextInput, Linking, ScrollView } from 'react-native'
import { style } from "../Dashboard/styleDashboard"
import LottieView from "lottie-react-native"
import { connect } from "react-redux"

class angkutTrash extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            loading1: false
        }
    }

    confirm() {
        const { value } = this.props.route.params
        this.setState({ loading: true })
        fetch(`https://sampahbank.herokuapp.com/api/pickup/confirmation/${value.id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) console.log("upload succses", response);
                ToastAndroid.show("Berhasil Di terima", ToastAndroid.SHORT);
                this.setState({ loading: false });
                this.props.navigation.goBack()
            })
            .catch((error) => {
                console.log("upload error", error);
                ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                this.setState({ loading: false });
            })
    }

    reject() {
        const { value } = this.props.route.params
        this.setState({ loading1: true })
        fetch(`https://sampahbank.herokuapp.com/api/pickup/rejection/${value.id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) console.log("upload succses", response);
                ToastAndroid.show("Rejection Succsess", ToastAndroid.SHORT);
                this.setState({ loading1: false });
                this.props.navigation.goBack()
            })
            .catch((error) => {
                console.log("upload error", error);
                ToastAndroid.show("Network request failed", ToastAndroid.LONG);
                this.setState({ loading1: false });
            })
    }

    render() {
        const { value } = this.props.route.params
        return (
            <View style={style.container1}>
                <View style={style.header}>
                    <View style={style.headerWrapper}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image
                                source={require("../../assets/arrow.png")}
                                style={style.menu1}
                            />
                        </TouchableOpacity>
                        <Text style={style.title2}>Permintaan Jemput</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Image
                            source={{ uri: value.user.photo }}
                            style={style.img} />
                    </View>
                    <View style={style.mid}>
                        <View style={style.containerInput1}>
                            <Image
                                source={require("../../assets/orang.png")}
                                style={[style.icon6, { height: 19, marginHorizontal: 2 }]}
                            />
                            <Text style={style.textList1}>{value.user.name}</Text>
                        </View>
                        <View style={style.containerInput1}>
                            <Image
                                source={require("../../assets/email.png")}
                                style={[style.icon6, { height: 14, marginTop: 5, marginHorizontal: 2 }]}
                            />
                            <Text style={style.textList1}>{value.user.email}</Text>
                        </View>
                        <View style={style.containerInput1}>
                            <Image
                                source={require("../../assets/phone.png")}
                                style={[style.icon6, { height: 19, marginHorizontal: 2 }]}
                            />
                            <Text style={style.textList1}>{value.user.phone}</Text>
                        </View>
                        <View style={style.containerInput1}>
                            <Image
                                source={require("../../assets/list.png")}
                                style={[style.icon7, { height: 20, marginHorizontal: 2, tintColor: "#009387" }]}
                            />
                            <Text style={style.textList1}>{value.description}</Text>
                        </View>
                        <View style={style.containerInput1}>
                            <Image
                                source={require("../../assets/map-placeholder.png")}
                                style={[style.icon7, { height: 20, marginHorizontal: 2, tintColor: "dodgerblue" }]}
                            />
                            <Text style={style.textList2} onPress={() => Linking.openURL(`${value.url_address}`)}>{value.address}</Text>
                        </View>
                        <View style={style.line}></View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Pesan", { kontak: value.user })} style={style.contImg}>
                        <Image
                            source={require("../../assets/chat.png")}
                            style={[style.btnImg, { tintColor: "#009387" }]}
                        />
                    </TouchableOpacity>
                    <View style={style.nameTag}>
                        <Text numberOfLines={1} style={style.myName}>{value.user.name}</Text>
                        <Text style={style.online}>online</Text>
                    </View>
                </ScrollView>
                {value.status == 0
                    ? <View style={{ flexDirection: "row" }}>
                        <TouchableNativeFeedback onPress={() => this.confirm()}>
                            <View style={[style.take1, { backgroundColor: "#009387" }]}>
                                {this.state.loading
                                    ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />
                                    : <Text style={style.trash}>Terima</Text>}
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={() => this.reject()}>
                            <View style={[style.take1, { backgroundColor: "red" }]}>
                                {this.state.loading1
                                    ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />
                                    : <Text style={style.trash}>Tolak</Text>}
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    : <View style={[style.take2, { backgroundColor: "#ff142180" }]}>
                        <Text style={style.trash}>Ditolak</Text>
                    </View>}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state,
    }
}
export default connect(mapStateToProps, null)(angkutTrash) 