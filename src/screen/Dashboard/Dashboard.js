import React, { Component } from 'react'
import { Text, View, StatusBar, TextInput, Image, TouchableOpacity, TouchableNativeFeedback, ScrollView, Modal, ToastAndroid, Alert, RefreshControl } from 'react-native'
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import LinearGradient from "react-native-linear-gradient"
import _ from "lodash"
import { Picker } from "@react-native-picker/picker"
import { style } from "./styleDashboard"
import { connect } from "react-redux"

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      screen: 1,
      profile: {},
      saldo: [],
      history: [],
      sampah: [],
      riwayat: [],
      editName: "",
      editAlamat: "",
      editPhone: "",
      editPhoto: "",
      editEmail: "",
      photo: "",
      telp: "",
      desc: "",
      alamat: "",
      url: "",
      currentPassword: "",
      newPassword: "",
      name: "",
      norek: "",
      uang: "10000",
      modalEditProfile: false,
      modalAngkut: false,
      modalChangePass: false,
      modalTarik: false,
      loading: false,
      loading1: false,
      refreshing: false
    }
  }

  componentDidMount() {
    this.getHistory()
    this.getProfile()
    this.getSaldo()
    this.getSampah()
    this.getRiwayat()
  }

  getRiwayat() {
    this.setState({ loading: true })
    fetch("https://sampahbank.herokuapp.com/api/history/withdraw", {
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
            riwayat: responseJson.data,
            loading: false,
            refreshing: false
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

  tarikSaldo() {
    const { name, norek, uang } = this.state;
    this.setState({ loading: true })
    if (name !== "" && norek !== "" && uang !== "") {
      const trash = {
        name: name,
        account: norek,
        nominal: uang
      };
      fetch('https://sampahbank.herokuapp.com/api/withdrawal', {
        method: 'POST',
        body: JSON.stringify(trash),
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.userData.userReducer.user}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) console.log("upload succses", response);
          ToastAndroid.show("Penarikan Success", ToastAndroid.SHORT);
          this.setState({ loading: false });
          this.showModalTarik(false);
          this.getSaldo()
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

  getSaldo() {
    this.setState({ loading: true })
    fetch("https://sampahbank.herokuapp.com/api/balance", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.props.userData.userReducer.user}`
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        const { message } = responseJson;
        if (message) {
          this.setState({
            saldo: responseJson.data,
            loading: false,
            refreshing: false
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

  getSampah() {
    this.setState({ loading: true })
    fetch("https://sampahbank.herokuapp.com/api/history/list", {
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
            sampah: responseJson.data,
            loading: false,
            refreshing: false
          });
        } else {
          ToastAndroid.show("Gagal memuat", ToastAndroid.LONG);
          this.setState({ loading: false })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({ loading: false, refreshing: false })
      });
  }

  changePass() {
    const { currentPassword, newPassword } = this.state;
    this.setState({ loading: true })
    if (currentPassword !== "" && newPassword !== "") {
      const change = {
        password: currentPassword,
        password_change: newPassword,
      };
      fetch('https://sampahbank.herokuapp.com/api/change', {
        method: 'POST',
        body: JSON.stringify(change),
        headers: {
          // Append: "application/json",
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.userData.userReducer.user}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) console.log("upload succses", response);
          ToastAndroid.show("Change Password Success", ToastAndroid.SHORT);
          this.setState({ loading: false });
          this.logOut()
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

  takeTrash() {
    const { desc, alamat, telp, photo, url } = this.state;
    this.setState({ loading: true })
    if (desc !== "" && alamat !== "" && telp !== "" && photo !== "" && url) {
      const take = {
        description: desc,
        address: alamat,
        phone: telp,
        url_address: url
      };
      fetch('https://sampahbank.herokuapp.com/api/pickup', {
        method: 'POST',
        body: this.createFormData1(photo, take),
        headers: {
          Append: "application/json",
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.userData.userReducer.user}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) console.log("upload succses", response);
          ToastAndroid.show("Request Succes", ToastAndroid.SHORT);
          this.setState({ loading: false });
          this.showModalAngkut(false)
          this.getHistory()
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

  getProfile() {
    console.log(this.props.userData.userReducer.user);
    this.setState({ loading: true })
    this.setState({ loading1: true })
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
            loading: false,
            loading1: false
          });
        } else {
          this.props.navigation.goBack();
          this.setState({ loading: false })
          this.setState({ loading1: false })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({ loading: false })
        this.setState({ loading1: false })
      });
  }

  getHistory() {
    this.setState({ loading: true })
    fetch("https://sampahbank.herokuapp.com/api/history", {
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
            history: responseJson.data,
            loading: false,
            refreshing: false
          });
        } else {
          this.props.navigation.goBack();
          this.setState({ loading: false })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({ loading: false, refreshing: false })
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
        // _method: "PUT"
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
          console.log("edit error", error);
          ToastAndroid.show("Network request failed", ToastAndroid.LONG);
          this.setState({ loading: false });
        })
    } else {
      ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG);
      this.setState({ loading: false })
    }
  }

  deleteAccount() {
    this.setState({ loading: true });
    fetch(`https://sampahbank.herokuapp.com/api/profile`, {
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
          ToastAndroid.show("Account Berhasil Di hapus", ToastAndroid.SHORT);
          this.logOut()
        } else {
          ToastAndroid.show("Gagal Menghapus Account, Silahkan Coba Lagi Nanti", ToastAndroid.SHORT);
          this.setState({ loading: false });
        }
      })
      .catch((error) => console.log(error))
    this.setState({ loading: false });
  }

  alertDelete() {
    Alert.alert(
      'Peringatan',
      'Apakah Anda Yakin Ingin Meghapus Account Ini ?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Cancel Pressed'),
        },
        { text: 'Hapus', onPress: () => this.deleteAccount() },
      ],
      { cancelable: false },
    );
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    });
  };

  createFormData1 = (photo, body) => {
    const data = new FormData();

    data.append("image", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "andriod"
          ? photo.uri
          : photo.uri.replace("file: //", "")
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key])
    });
    return data;
  };

  handleEditPhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, (response) => {
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

  showModalEditProfile(visible) {
    this.setState({ modalEditProfile: visible });
  }

  showModalAngkut(visible) {
    this.setState({ modalAngkut: visible });
  }

  showModalTarik(visible) {
    this.setState({ modalTarik: visible });
  }

  showModalChangePass(visible) {
    this.setState({ modalChangePass: visible });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
  }

  toPrice = (price) => {
    return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.')
  }

  render() {
    return (
      <View style={style.container}>
        <Modal
          style={{ flex: 1 }}
          visible={this.state.modalTarik}
          transparent={true}
          animationType="fade">
          <View style={style.container1}>
            <View style={style.header}>
              <View style={style.headerWrapper}>
                <TouchableOpacity onPress={() => this.showModalTarik(false)}>
                  <Image
                    source={require("../../assets/arrow.png")}
                    style={style.menu1}
                  />
                </TouchableOpacity>
                <Text style={style.title2}>Tarik saldo</Text>
              </View>
            </View>
            <Image
              style={style.welcomeImage}
              source={require("../../assets/gambar1.png")} />
            <ScrollView>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>nama :</Text>
              <View style={[style.contPicker]}>
                <TextInput
                  placeholder="Nama Nasabah"
                  selectionColor="#009387"
                  color="#009387"
                  keyboardType="default"
                  onChangeText={(name) => this.setState({ name })}
                  style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                />
              </View>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>No.Rekening :</Text>
              <View style={style.contPicker}>
                <TextInput
                  placeholder="Rekening Bank"
                  selectionColor="#009387"
                  color="#009387"
                  keyboardType="number-pad"
                  onChangeText={(norek) => this.setState({ norek })}
                  style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                />
              </View>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Jumlah Penarikan :</Text>
              <View style={style.contPicker}>
                <Picker dropdownIconColor="#009387" mode="dropdown" onValueChange={(a) => this.setState({ uang: a })} selectedValue={this.state.uang} style={[style.picker, { color: "#009387" }]}>
                  <Picker.Item label="Rp 10.000" value="10000" />
                  <Picker.Item label="Rp 20.000" value="20000" />
                  <Picker.Item label="Rp 50.000" value="50000" />
                  <Picker.Item label="Rp 100.000" value="100000" />
                  <Picker.Item label="Rp 250.000" value="250000" />
                  <Picker.Item label="Rp 500.000" value="500000" />
                  <Picker.Item label="Rp 1.000.000" value="1000000" />
                </Picker>
              </View>
              <TouchableNativeFeedback onPress={() => this.tarikSaldo()} style={style.btnWrapper}>
                <View style={[style.btn, { backgroundColor: "#009387", marginTop: 15 }]}>
                  {this.state.loading
                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                    : (<Text style={[style.label, { fontSize: 14 }]}>confirm</Text>)}
                </View>
              </TouchableNativeFeedback>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          style={{ flex: 1 }}
          visible={this.state.modalChangePass}
          transparent={true}
          animationType="fade">
          <View style={style.container1}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 15 }}>
              <TouchableOpacity onPress={() => this.showModalChangePass(false)}>
                <Image
                  source={require("../../assets/back.png")}
                  style={style.logo}
                />
              </TouchableOpacity>
              <Text style={style.login}>Change Your Password ?</Text>
              <View style={style.content}>
                <Image
                  source={require("../../assets/gembok.png")}
                  style={{ height: 100, width: 100, alignSelf: "center", tintColor: "#009387", marginBottom: 30 }}
                />
                <Text style={{ textAlign: "center", color: "#009387", marginBottom: 20 }}>Your new password must be different from previous used passwords.</Text>
                <Text style={{ marginLeft: 2, opacity: 0.6, fontSize: 13 }}>Current Password :</Text>
                <View style={style.textinput}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../assets/gembok.png")}
                      style={{ height: 22, width: 20, tintColor: "#009387", marginLeft: 2 }}
                    />
                    <TextInput
                      placeholder="Password"
                      selectionColor="#009387"
                      color="#009387"
                      secureTextEntry={true}
                      keyboardType="default"
                      onChangeText={(currentPassword) => this.setState({ currentPassword })}
                      style={{ borderColor: "white", marginLeft: 5, width: "100%" }}
                    />
                  </View>
                </View>
                <Text style={{ marginLeft: 2, opacity: 0.6, marginTop: 20, fontSize: 13 }}>New Password :</Text>
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
                <TouchableOpacity onPress={() => this.changePass()}>
                  <LinearGradient style={style.button1} colors={["#009387", "#25f53a"]}>
                    <Text style={{ color: "white" }}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          style={{ flex: 1 }}
          visible={this.state.modalEditProfile}
          transparent={true}
          animationType="fade">
          <View style={style.container1}>
            <StatusBar backgroundColor="#009389" />
            <Image
              style={style.bg}
              source={require("../../assets/bg1.png")} />
            <View style={style.header}>
              <View style={style.headerWrapper}>
                <TouchableOpacity onPress={() => this.showModalEditProfile(false)}>
                  <Image
                    source={require("../../assets/arrow.png")}
                    style={style.menu1}
                  />
                </TouchableOpacity>
                <Text style={style.title2}>Edit Profile</Text>
              </View>
              {this.state.editPhoto
                ? <TouchableOpacity onPress={() => this.editProfile()}>
                  <Image
                    source={require("../../assets/checked.png")}
                    style={style.check}
                  />
                </TouchableOpacity>
                : null}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                {this.state.editPhoto
                  ? <Image
                    source={{ uri: this.state.editPhoto.uri }}
                    style={style.img}
                  />
                  : <Image
                    source={{ uri: this.state.profile.photo }}
                    style={style.img}
                  />}
              </View>
              <View style={style.mid}>
                <View style={style.containerInput}>
                  <Image
                    source={require("../../assets/orang.png")}
                    style={[style.icon6, { height: 19 }]}
                  />
                  <TextInput
                    style={[style.input, { width: "95%" }]}
                    underlineColorAndroid="#f2f3f7"
                    placeholder="Username"
                    keyboardType="default"
                    value={this.state.editName}
                    onSubmitEditing={() => this.state.editName == "" ? ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG) : this.editProfile()}
                    onChangeText={(editName) => this.setState({ editName })}
                    color="#009387"
                  />
                </View>
                <View style={style.containerInput}>
                  <Image
                    source={require("../../assets/email.png")}
                    style={[style.icon6, { height: 14, marginTop: 5 }]}
                  />
                  <TextInput
                    style={[style.input, { width: "95%" }]}
                    underlineColorAndroid="#f2f3f7"
                    placeholder="Email Address"
                    keyboardType="email-address"
                    value={this.state.editEmail}
                    onSubmitEditing={() => this.state.editEmail == "" ? ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG) : this.editProfile()}
                    onChangeText={(editEmail) => this.setState({ editEmail })}
                    color="#009387"
                  />
                </View>
                <View style={style.containerInput}>
                  <Image
                    source={require("../../assets/phone.png")}
                    style={[style.icon6, { height: 19 }]}
                  />
                  <TextInput
                    style={[style.input, { width: "95%" }]}
                    underlineColorAndroid="#f2f3f7"
                    placeholder="Phone Number"
                    keyboardType="number-pad"
                    value={this.state.editPhone}
                    onSubmitEditing={() => this.state.editPhone == "" ? ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG) : this.editProfile()}
                    onChangeText={(editPhone) => this.setState({ editPhone })}
                    color="#009387"
                  />
                </View>
                <View style={style.containerInput}>
                  <Image
                    source={require("../../assets/map-placeholder.png")}
                    style={[style.icon6, { height: 19 }]}
                  />
                  <TextInput
                    style={[style.input, { width: "95%" }]}
                    underlineColorAndroid="#f2f3f7"
                    placeholder="Lokasi"
                    keyboardType="default"
                    value={this.state.editAlamat}
                    onSubmitEditing={() => this.state.editAlamat == "" ? ToastAndroid.show("Pastikan Form Terisi Dengan Benar", ToastAndroid.LONG) : this.editProfile()}
                    onChangeText={(editAlamat) => this.setState({ editAlamat })}
                    color="#009387"
                  />
                </View>
                <View style={style.line}></View>
                <TouchableNativeFeedback onPress={() => this.showModalChangePass()}>
                  <View style={[style.containerList]}>
                    <Image
                      source={require("../../assets/gembok.png")}
                      style={style.icon5}
                    />
                    <Text style={style.textList}>Ganti Password</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => this.alertDelete()}>
                  <View style={[style.containerList]}>
                    <Image
                      source={require("../../assets/trash.png")}
                      style={style.icon5}
                    />
                    <Text style={style.textList}>Hapus Account</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback>
                  <View style={style.containerList}>
                    <Image
                      source={require("../../assets/question.png")}
                      style={style.icon5}
                    />
                    <Text style={style.textList}>Bantuan</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback>
                  <View style={style.containerList}>
                    <Image
                      source={require("../../assets/about.png")}
                      style={style.icon5}
                    />
                    <Text style={style.textList}>About</Text>
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => this.alertLogout()}>
                  <View style={style.containerList}>
                    <Image
                      source={require("../../assets/logout.png")}
                      style={style.logoutIcon}
                    />
                    <Text style={style.textList}>Logout</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <TouchableOpacity onPress={() => this.handleEditPhoto()} style={style.contImg}>
                {this.state.loading
                  ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />
                  : <Image
                    source={require("../../assets/camera.png")}
                    style={style.btnImg}
                  />}
              </TouchableOpacity>
              <View style={style.nameTag}>
                <Text style={style.myName}>{this.state.profile.name}</Text>
                <Text style={style.online}>online</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          style={{ flex: 1 }}
          visible={this.state.modalAngkut}
          transparent={true}
          animationType="fade">
          <View style={style.container1}>
            <StatusBar backgroundColor="#009389" />
            {/* <Image
                            style={style.bg}
                            source={require("../../assets/bg1.png")} /> */}
            <View style={style.header}>
              <View style={style.headerWrapper}>
                <TouchableOpacity onPress={() => this.showModalAngkut(false)}>
                  <Image
                    source={require("../../assets/arrow.png")}
                    style={style.menu1}
                  />
                </TouchableOpacity>
                <Text style={style.title2}>Angkut Sampah</Text>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={style.contphoto}>
                <TouchableOpacity onPress={() => this.handleChoosePhoto()} style={style.photo}>
                  {this.state.photo ? (
                    <Image
                      source={{ uri: this.state.photo.uri }}
                      style={style.photo}
                    />
                  ) : (
                      <Text style={{ color: "#009387", fontSize: 12 }}>+ Tambah Foto</Text>
                    )}
                </TouchableOpacity>
              </View>
              <View style={style.contname}>
                <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                  <Text style={style.titleName}>Keterangan :</Text>
                  <TextInput
                    placeholder="Keterangan Sampah"
                    selectionColor="#009387"
                    color="#009387"
                    multiline={true}
                    onChangeText={(desc) => this.setState({ desc })}
                    style={{ borderColor: "#fff", fontSize: 15 }}
                  />
                </View>
              </View>
              <View style={style.contci}>
                <Text style={style.titlePhone}>Telephone :</Text>
                <TextInput
                  placeholder="+ 62 No.Telephone"
                  selectionColor="#009387"
                  color="#009387"
                  keyboardType="numeric"
                  onChangeText={(telp) => this.setState({ telp })}
                  style={{ width: "75%", padding: 5, borderColor: "#fff", textAlign: "right" }}
                />
              </View>
              <View style={style.contname}>
                <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                  <Text style={style.titleName}>Alamat :</Text>
                  <TextInput
                    placeholder="Alamat Lengkap"
                    selectionColor="#009387"
                    color="#009387"
                    multiline={true}
                    onChangeText={(alamat) => this.setState({ alamat })}
                    style={{ borderColor: "#fff", fontSize: 15 }}
                  />
                </View>
              </View>
              <View style={style.contname}>
                <View style={{ marginHorizontal: 7, paddingTop: 7 }}>
                  <Text style={style.titleName}>Url Alamat :</Text>
                  <TextInput
                    placeholder="url share location"
                    selectionColor="#009387"
                    color="dodgerblue"
                    multiline={true}
                    onChangeText={(url) => this.setState({ url })}
                    style={{ borderColor: "#fff", fontSize: 15 }}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={() => this.takeTrash()} style={style.btnWrapper}>
                <LinearGradient
                  style={style.btn}
                  colors={["#009387", "#25f53a"]}>
                  {this.state.loading
                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                    : (<Text style={style.label}>Take Out The Trash</Text>)}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
        <StatusBar backgroundColor="#009387" />
        <View style={style.header}>
          <View style={style.headerWrapper}>
            <Image
              source={require("../../assets/gambar.png")}
              style={style.menu}
            />
            <Text style={style.title}>Gomi Trash</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Chat")}>
            <Image
              source={require("../../assets/chat.png")}
              style={style.chatIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={style.top}>
          <View style={style.contTop}>
            {this.state.loading1
              ? <LottieView source={require("../../assets/890-loading-animation.json")} style={style.loading1} autoPlay loop />
              : <View style={style.contText}>
                <Text style={style.name}>Halo, {this.state.profile.name}</Text>
                <Text style={style.ket}>Have you take out the trash today ?</Text>
              </View>}
            <TouchableOpacity style={style.avatar} onPress={() => this.showModalEditProfile()}>
              {this.state.loading
                ? <LottieView source={require("../../assets/8707-loading.json")} style={style.loading} autoPlay loop />
                : <Image
                  source={{ uri: this.state.profile.photo }}
                  style={style.avatar3}
                />}
            </TouchableOpacity>
          </View>
          <View style={style.contText1}>
            <Text style={style.ket}>Saldo Anda</Text>
            <Text style={style.saldo}>Rp {this.state.saldo == null ? 0 : this.state.saldo},-</Text>
          </View>
        </View>
        <View style={style.contTab}>
          <TouchableOpacity onPress={() => this.setState({ screen: 1 })}>
            <Image
              source={require("../../assets/cube.png")}
              style={
                this.state.screen == 1
                  ? style.onIcon2
                  : style.icon2
              }
            />
            <Text style={
              this.state.screen == 1
                ? [style.textTab, { fontSize: 12, fontWeight: "700" }]
                : [style.textTab, { fontSize: 10 }]}>Penyetoran</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ screen: 2 })}>
            <Image
              source={require("../../assets/cashback.png")}
              style={
                this.state.screen == 2
                  ? style.onIcon
                  : style.icon
              }
            />
            <Text style={
              this.state.screen == 2
                ? [style.textTab, { fontSize: 12, fontWeight: "700" }]
                : [style.textTab, { fontSize: 10 }]}>Penarikan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ screen: 3 })}>
            <Image
              source={require("../../assets/garbagetruck.png")}
              style={
                this.state.screen == 3
                  ? style.onIcon1
                  : style.icon1
              }
            />
            <Text style={
              this.state.screen == 3
                ? [style.textTab, { fontSize: 12, fontWeight: "700" }]
                : [style.textTab, { fontSize: 10 }]}>Angkut Sampah</Text>
          </TouchableOpacity>
        </View>
        {this.state.loading
          ? <View style={{ flex: 1, justifyContent: "center" }}>
            <LottieView source={require("../../assets/4949-loading-circle-gradient.json")} style={style.loading3} autoPlay loop />
          </View>
          : <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.getHistory()
                  this.getSampah()
                  this.getRiwayat()
                  this._onRefresh()
                }}
              />
            }
            showsVerticalScrollIndicator={false}>
            {this.state.screen == 1
              ? this.state.sampah == ""
                ? <Text style={{ textAlign: "center" }}>Data Kosong</Text>
                : (this.state.sampah.map((item, index) => (
                  <TouchableNativeFeedback key={index}>
                    <View style={style.list}>
                      <View style={{ marginLeft: 15 }}>
                        <Text style={[style.text, { marginBottom: 5, fontSize: 10 }]}>ID Penyetoran: #{item.id}</Text>
                        <Text style={[style.barang, { fontSize: 15, }]}>{item.trash_id == 1 ? "Kertas" : item.trash_id == 2 ? "Plastik" : item.trash_id == 3 ? "Kaca" : item.trash_id == 4 ? "Minyak" : item.trash_id == 5 ? "Logam" : "Elektronik"} {item.weight} Kg</Text>
                        <Text style={[style.text, { fontSize: 12 }]}>{item.created_at}</Text>
                      </View>
                      <View style={{ marginRight: 15 }}>
                        <Text style={[style.text, { textAlign: "right", fontSize: 10 }]}>Total Pemasukan</Text>
                        <Text style={[style.barang, { textAlign: "right" }]}>Rp {this.toPrice(item.revenue)},-</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                ))
                )
              : this.state.screen == 2
                ? this.state.riwayat == ""
                  ? <Text style={{ textAlign: "center" }}>Data Kosong</Text>
                  : (this.state.riwayat.map((item, index) => (
                    <TouchableNativeFeedback key={index}>
                      <View style={style.list1}>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text style={[style.text, { fontSize: 10 }]}>ID Penarikan: #{item.id}</Text>
                          <Text numberOfLines={1} style={[style.barang, { marginVertical: 5 }]}>Nama : {item.name}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text numberOfLines={2} style={[style.barang, { marginBottom: 5 }]}>No.Rekening : {item.account}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text numberOfLines={2} style={[style.barang, { marginBottom: 5 }]}>Telephone : {this.state.profile.phone}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text numberOfLines={2} style={[style.barang, { marginBottom: 5 }]}>Total Penarikan : Rp {this.toPrice(item.credit)},-</Text>
                        </View>
                        <Text style={[style.text, { fontSize: 11, marginHorizontal: 15, alignSelf: "flex-end" }]}>{item.updated_at}</Text>
                        <Image
                          source={item.status == null
                            ? require("../../assets/history.png")
                            : require("../../assets/check-symbol.png")}
                          style={[style.status, {tintColor: "#fff"}]}
                        />
                      </View>
                    </TouchableNativeFeedback>
                  ))
                  )
                : this.state.history == ""
                  ? <Text style={{ textAlign: "center" }}>Data Kosong</Text>
                  : (this.state.history.map((item, index) => (
                    <TouchableNativeFeedback key={index} onPress={() => this.props.navigation.navigate("Cancle", { value: item })}>
                      <View style={style.list1}>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text style={[style.text, { fontSize: 10 }]}>ID Permintaan Angkut: #{item.id}</Text>
                          <Text numberOfLines={1} style={[style.barang, { marginVertical: 5 }]}>Nama : {this.state.profile.name}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text numberOfLines={2} style={style.keterangan}>{item.description}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}>
                          <Text numberOfLines={2} style={style.alamat}>{item.address}</Text>
                        </View>
                        <Text style={[style.text, { fontSize: 11, marginHorizontal: 15, alignSelf: "flex-end" }]}>{item.created_at}</Text>
                        <Image
                          source={item.status == 0
                            ? require("../../assets/history.png")
                            : item.status == 1
                              ? require("../../assets/userinterface.png")
                              : require("../../assets/cancel.png")}
                          style={item.status == 2 ? style.status : [style.status, { tintColor: "#fff" }]}
                        />
                      </View>
                    </TouchableNativeFeedback>
                  ))
                  )}
            <View style={{ height: 45 }}></View>
          </ScrollView>}
        {this.state.screen == 3
          ? <TouchableNativeFeedback onPress={() => this.showModalAngkut()}>
            <View style={style.take}>
              <Image
                source={require("../../assets/plus.png")}
                style={style.plus}
              />
              <Text style={style.trash}>Take Out The Trash</Text>
            </View>
          </TouchableNativeFeedback>
          : this.state.screen == 2
            ? <TouchableNativeFeedback onPress={() => this.showModalTarik()}>
              <View style={style.take}>
                <Text style={style.trash}>Tarik Saldo</Text>
              </View>
            </TouchableNativeFeedback>
            : null}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state,
  }
}
export default connect(mapStateToProps, null)(Dashboard)