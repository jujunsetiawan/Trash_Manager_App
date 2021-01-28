import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid } from 'react-native'
import { connect } from "react-redux"
import LinearGradient from "react-native-linear-gradient"
import ImagePicker from "react-native-image-picker"
import LottieView from "lottie-react-native"

class editProfile extends Component {
    constructor() {
        super();
        this.state = {
            profile: {},
            editName: "",
            editAlamat: "",
            editPhone: "",
            editPhoto: "",
            editEmail: "",
            loading: false,
        }
    }

    componentDidMount() {
        this.getProfile()
    }

    getProfile() {
        console.log(this.props.userData.userReducer.user);
        this.setState({ loading: true })
        fetch("https://sampahbank.herokuapp.com/api/profile", {
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
                    this.setState({
                        profile: responseJson.data,
                        editName: responseJson.data.name,
                        editAlamat: responseJson.data.address,
                        editPhone: responseJson.data.phone,
                        editEmail: responseJson.data.email,
                        loading: false
                    });
                } else {
                    this.props.navigation.goBack();
                    this.setState({ loading: false })
                }
            })
            .catch((error) => {
                console.error(error);
                ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
                this.setState({ loading: false })
            });
    }

    editProfile() {
        const { editName, editEmail, editAlamat, editPhoto, editPhone } = this.state;
        this.setState({ loading: true })
        if (editName !== "" || editEmail !== "" || editAlamat !== "" || editPhone !== "" || editPhoto !== "") {
            const profile = {
                name: editName,
                address: editAlamat,
                email: editEmail,
                phone: editPhone,
                _method: "PUT"
            };
            const dataToSend = editPhoto.uri ? (this.createFormData(editPhoto, profile)) : (JSON.stringify(profile))
            const headerToSend = editPhoto.uri ? ({
                Accept: "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            }) : ({
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userData.userReducer.user}`,
            })
            fetch(`https://sampahbank.herokuapp.com/api/profile`, {
                method: 'POST',
                body: dataToSend,
                headers: headerToSend
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response) console.log("upload succses", response);
                    ToastAndroid.show("Edit Succes", ToastAndroid.SHORT);
                    this.getProfile()
                    this.setState({ loading: false });
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
    handleEditPhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.uri) {
                this.setState({ editPhoto: response });
                console.log(JSON.stringify(response) + 'tes image');
            }
        });
    };
    createFormData = (photo, body) => {
        const data = new FormData();

        data.append('photo', {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === 'android'
                    ? photo.uri
                    : photo.uri.replace('file://', ''),
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });

        return data;
    };

    render() {
        return (
            <View style={style.container}>
                <View style={style.header}>
                    <View style={style.headerWrapper}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                            <Image
                                source={require("../../assets/arrow.png")}
                                style={style.menu}
                            />
                        </TouchableOpacity>
                        <Text style={style.title}>Edit Profile</Text>
                    </View>
                </View>
                <TouchableOpacity style={style.avatar} onPress={() => this.handleEditPhoto()} >
                    {this.state.loading
                        ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading1} autoPlay loop />
                        : this.state.editPhoto
                            ? (<Image
                                source={{ uri: this.state.editPhoto.uri }}
                                style={style.image}
                            />)
                            : (<Image
                                style={style.image}
                                source={{ uri: this.state.profile.photo }} />)}
                </TouchableOpacity>
                <ScrollView style={style.contentContainer}>
                    <View>
                        <Text style={style.text}>Nama :</Text>
                        <View style={style.containerInput}>
                            <Image
                                source={require("../../assets/orang.png")}
                                style={[style.icon, { height: 19 }]}
                            />
                            <TextInput
                                style={[style.input, { width: "82%" }]}
                                underlineColorAndroid="#f2f3f7"
                                placeholder="Username"
                                keyboardType="default"
                                value={this.state.editName}
                                onChangeText={(editName) => this.setState({ editName })}
                                color="#009387"
                            />
                        </View>
                        <Text style={style.text}>Email :</Text>
                        <View style={style.containerInput}>
                            <Image
                                source={require("../../assets/email.png")}
                                style={[style.icon, { height: 14 }]}
                            />
                            <TextInput
                                style={[style.input, { width: "82%" }]}
                                underlineColorAndroid="#f2f3f7"
                                placeholder="Email Address"
                                keyboardType="email-address"
                                value={this.state.editEmail}
                                onChangeText={(editEmail) => this.setState({ editEmail })}
                                color="#009387"
                            />
                        </View>
                        <Text style={style.text}>Telephone :</Text>
                        <View style={style.containerInput}>
                            <Image
                                source={require("../../assets/phone.png")}
                                style={[style.icon, { height: 19 }]}
                            />
                            <TextInput
                                style={[style.input, { width: "82%" }]}
                                underlineColorAndroid="#f2f3f7"
                                placeholder="+62 "
                                keyboardType="numeric"
                                value={this.state.editPhone}
                                onChangeText={(editPhone) => this.setState({ editPhone })}
                                color="#009387"
                            />
                        </View>
                        <Text style={style.text}>Alamat :</Text>
                        <View style={style.containerInput}>
                            <Image
                                source={require("../../assets/map-placeholder.png")}
                                style={[style.icon, { height: 19 }]}
                            />
                            <TextInput
                                style={[style.input, { width: "82%" }]}
                                underlineColorAndroid="#f2f3f7"
                                placeholder="Lokasi"
                                keyboardType="default"
                                value={this.state.editAlamat}
                                onChangeText={(editAlamat) => this.setState({ editAlamat })}
                                color="#009387"
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.editProfile()} style={style.btnWrapper}>
                        <LinearGradient
                            style={style.btn}
                            colors={["#009387", "#25f53a"]}>
                            {this.state.loading
                                ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />)
                                : (<Text style={style.label}>Edit</Text>)}
                        </LinearGradient>
                    </TouchableOpacity>
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

export default connect(mapStateToProps)(editProfile)

const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1
    },
    header: {
        height: 45,
        backgroundColor: "#009387",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerWrapper: {
        flexDirection: "row",
    },
    menu: {
        height: 20,
        width: 25,
        tintColor: "#fff",
        marginHorizontal: 20
    },
    title: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "700"
    },
    containerInput: {
        display: "flex",
        backgroundColor: "#f2f3f7",
        borderRadius: 10,
        borderColor: "#9e9e9e",
        borderWidth: 0.3,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5
    },
    icon: {
        width: 20,
        marginLeft: 12,
        tintColor: "#009387"
    },
    text: {
        marginLeft: 5,
        color: "#009387",
        fontSize: 13
    },
    input: {
        padding: 10,
        marginLeft: 5,
        borderColor: "#fff"
    },
    image: {
        height: 100,
        width: 100,
    },
    contentContainer: {
        padding: 15
    },
    btn: {
        borderRadius: 30,
        height: 35,
        justifyContent: "center"
    },
    btnWrapper: {
        marginTop: 20
    },
    label: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: "#fff",
        fontFamily: "HelveticaNeue",
        padding: 20,
    },
    bg: {
        position: "absolute",
        height: "100%",
        width: "100%",
    },
    loading1: {
        height: 80,
        width: 80,
        alignSelf: "center",
    },
    avatar: {
        borderRadius: 5,
        borderWidth: 0.2,
        borderColor: "#9e9e9e",
        alignSelf: "center",
        marginTop: 25,
        marginBottom: 25,
        justifyContent: "center",
        height: 100,
        width: 100
    }
})