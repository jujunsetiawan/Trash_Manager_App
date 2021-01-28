import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ToastAndroid, ScrollView, TouchableNativeFeedback, Linking, Alert } from 'react-native'
import { style } from "../Dashboard/styleDashboard"
import LottieView from "lottie-react-native"
import LinearGradient from "react-native-linear-gradient"
import { connect } from "react-redux"

class cancleAngkut extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        }
    }

    cancle() {
        this.setState({ loading: true });
        const { value } = this.props.route.params
        fetch(`https://sampahbank.herokuapp.com/api/pickup/delete/${value.id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            },
        })

            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.message == "Success") {
                    ToastAndroid.show("Berhasil Dibatalkan", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.goBack()
                } else {
                    ToastAndroid.show("Gagal Membatalkan, Silahkan Coba Lagi Nanti", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                }
            })
            .catch((error) => console.log(error))
        this.setState({ loading: false });
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
                    <View style={style.contphoto}>
                        <TouchableOpacity style={style.photo}>
                            <Image
                                source={{ uri: value.image }}
                                style={style.photo}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={style.contname}>
                        <View style={{ padding: 10 }}>
                            <Text style={style.titleName}>Keterangan :</Text>
                            <Text style={{ borderColor: "#fff", fontSize: 15, color: "#009387" }}>{value.description}</Text>
                        </View>
                    </View>
                    <View style={style.contci}>
                        <Text style={style.titlePhone}>Telephone :</Text>
                        <Text style={{ width: "75%", padding: 5, borderColor: "#fff", textAlign: "right", color: "#009387" }}>{value.phone}</Text>
                    </View>
                    <View style={style.contname}>
                        <View style={{ padding: 10 }}>
                            <Text style={style.titleName}>Alamat :</Text>
                            <Text style={{ borderColor: "#fff", fontSize: 15, color: "#009387" }}>{value.address}</Text>
                        </View>
                    </View>
                    <View style={style.contname}>
                        <View style={{ padding: 10 }}>
                            <Text style={style.titleName}>Url Alamat :</Text>
                            <Text onPress={() => Linking.openURL(`${value.url_address}`)} style={{ borderColor: "#fff", fontSize: 15, color: "dodgerblue" }}>{value.url_address}</Text>
                        </View>
                    </View>
                    {value.status == 0
                        ? <TouchableNativeFeedback onPress={() => this.cancle()} style={style.btnWrapper}>
                            <View style={[style.btn, { backgroundColor: "red", marginTop: 15 }]}>
                                {this.state.loading
                                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                                    : (<Text style={[style.label, { fontSize: 14 }]}>Batalkan</Text>)}
                            </View>
                        </TouchableNativeFeedback>
                        : <View style={[style.btn, { backgroundColor: "#ff142180", marginTop: 15 }]}>
                            {this.state.loading
                                ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                                : (<Text style={[style.label, { fontSize: 14 }]}>Batalkan</Text>)}
                        </View>}
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

export default connect(mapStateToProps, null)(cancleAngkut)
