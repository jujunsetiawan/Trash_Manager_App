import React, { Component } from 'react'
import { Text, View, TextInput, ScrollView, TouchableNativeFeedback, Image, TouchableOpacity, ToastAndroid, Switch } from 'react-native'
import LottieView from "lottie-react-native"
import { Picker } from "@react-native-picker/picker"
import { style } from "../Dashboard/styleDashboard"
import { connect } from "react-redux"
import _ from "lodash"

export class setorSampah extends Component {
    constructor() {
        super();
        this.state = {
            kategory: [],
            kategori: 1,
            berat: "",
            id: "",
            switch: false,
            loading: false
        }
    }
    componentDidMount() {
        this.getKategori()
        const { value } = this.props.route.params
        this.setState({ id: value.user_id })
    }

    getKategori() {
        this.setState({ loading: true })
        fetch("https://sampahbank.herokuapp.com/api/trashes", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                const { status } = responseJson;
                if (status) {
                    this.setState({
                        kategory: responseJson.status,
                        loading: false,
                    });
                } else {
                    ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                this.setState({ loading: false, refreshing: false })
            });
    }

    setorSampah() {
        const { kategori, berat, id } = this.state;
        this.setState({ loading: true })
        if (kategori !== "" && berat !== "" && id !== "") {
            const trash = {
                trash_id: kategori,
                weight: berat,
                user_id: id
            };
            fetch('https://sampahbank.herokuapp.com/api/deposit', {
                method: 'POST',
                body: JSON.stringify(trash),
                headers: {
                    // Append: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.props.userData.userReducer.user}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Setor Sampah Success", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.goBack()
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

    setorTrash() {
        const { kategori, berat, id } = this.state;
        this.setState({ loading: true })
        if (kategori !== "" && berat !== "" && id !== "") {
            const trash = {
                trash_id: kategori,
                weight: berat,
                user_id: id
            };
            fetch('https://sampahbank.herokuapp.com/api/deposit/20', {
                method: 'POST',
                body: JSON.stringify(trash),
                headers: {
                    // Append: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.props.userData.userReducer.user}`,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Setor Sampah Success", ToastAndroid.SHORT);
                    this.setState({ loading: false });
                    this.props.navigation.goBack()
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

    toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
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
                        <Text style={style.title2}>Setor Sampah</Text>
                    </View>
                </View>
                <Image
                    style={style.welcomeImage}
                    source={require("../../assets/gambar1.png")} />
                <ScrollView>
                    <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>ID Nasabah :</Text>
                    <View style={style.contPicker}>
                        <TextInput
                            placeholder="ID"
                            selectionColor="#009387"
                            color="#009387"
                            keyboardType="number-pad"
                            value={`${this.state.id}`}
                            onChangeText={(id) => this.setState({ id })}
                            editable={false}
                            style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                        />
                    </View>
                    <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Jenis Sampah :</Text>
                    <View style={style.contPicker}>
                        <Picker dropdownIconColor="#009387" mode="dropdown" onValueChange={(a) => this.setState({ kategori: a })} selectedValue={this.state.kategori} style={[style.picker, { color: "#009387" }]}>
                            {this.state.kategory.map((value, index) => (
                                <Picker.Item key={index} label={value.trash} value={value.id} />
                            ))}
                        </Picker>
                    </View>
                    <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Berat :</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={[style.contPicker, { width: "60%" }]}>
                            <TextInput
                                placeholder="Berat Sampah /Kg"
                                selectionColor="#009387"
                                color="#009387"
                                keyboardType="number-pad"
                                onChangeText={(berat) => this.setState({ berat })}
                                style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: "700", fontSize: 17, color: "#009387" }}>jemput</Text>
                        </View>
                        <Switch value={this.state.switch} onValueChange={(value) => this.setState({ switch: value })} />
                    </View>
                    <View style={style.contText3}>
                        <Text style={{ fontWeight: "700", fontSize: 18 }}>Harga Sampah</Text>
                        {this.state.kategori == 1
                            ? <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 500)}-,</Text>
                            : this.state.kategori == 2
                                ? <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 1000)}-,</Text>
                                : this.state.kategori == 3
                                    ? <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 1500)}-,</Text>
                                    : this.state.kategori == 4
                                        ? <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 2000)}-,</Text>
                                        : this.state.kategori == 5
                                            ? <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 2500)}-,</Text>
                                            : <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.toPrice(this.state.berat * 3000)}-,</Text>}
                    </View>
                    {this.state.switch
                        ? <View>
                            <View style={style.contText3}>
                                <Text style={{ fontWeight: "700", fontSize: 15 }}>Biaya Penjemputan</Text>
                                <Text style={{ fontWeight: "700", fontSize: 16 }}>20%</Text>
                            </View>
                            <View style={style.contText3}>
                                <Text style={{ fontWeight: "700", fontSize: 14 }}>Total Harga</Text>
                                {this.state.kategori == 1
                                    ? <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 500 - this.state.berat * 500 * 0.2)}-,</Text>
                                    : this.state.kategori == 2
                                        ? <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 1000 - this.state.berat * 1000 * 0.2)}-,</Text>
                                        : this.state.kategori == 3
                                            ? <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 1500 - this.state.berat * 1500 * 0.2)}-,</Text>
                                            : this.state.kategori == 4
                                                ? <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 2000 - this.state.berat * 2000 * 0.2)}-,</Text>
                                                : this.state.kategori == 5
                                                    ? <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 2500 - this.state.berat * 2500 * 0.2)}-,</Text>
                                                    : <Text style={{ fontWeight: "700", fontSize: 15 }}>Rp {this.toPrice(this.state.berat * 3000 - this.state.berat * 3000 * 0.2)}-,</Text>}
                            </View>
                        </View>
                        : null}
                    <TouchableNativeFeedback onPress={() => this.state.switch ? this.setorTrash() : this.setorSampah()} style={style.btnWrapper}>
                        <View style={[style.btn, { backgroundColor: "#009387", marginTop: 15 }]}>
                            {this.state.loading
                                ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                                : (<Text style={[style.label, { fontSize: 14 }]}>Confirm</Text>)}
                        </View>
                    </TouchableNativeFeedback>
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

export default connect(mapStateToProps)(setorSampah);