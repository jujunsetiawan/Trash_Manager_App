import React, { Component } from 'react'
import { Text, View, StatusBar, TextInput, Image, TouchableOpacity, TouchableNativeFeedback, ScrollView, Modal, ToastAndroid, Alert, RefreshControl } from 'react-native'
import { launchImageLibrary } from "react-native-image-picker"
import AsyncStorage from "@react-native-community/async-storage"
import LottieView from "lottie-react-native"
import { Picker } from "@react-native-picker/picker"
import { style } from "../Dashboard/styleDashboard"
import { connect } from "react-redux"
import _ from "lodash"

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      screen: 1,
      profile: {},
      sampah: [],
      history: [],
      kategory: [],
      editName: "",
      editAlamat: "",
      editPhone: "",
      editPhoto: "",
      editEmail: "",
      kategori: 1,
      berat: "",
      saldo: "",
      modalEditProfile: false,
      modalSetor: false,
      loading: false,
      loading1: false,
      refreshing: false
    }
  }

  componentDidMount() {
    this.getProfile()
    this.getHistory()
    this.getKategori()
    this.getSampah()
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
            refreshing: false
          });
        } else {
          ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
          this.setState({ loading: false, refreshing: false })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({ loading: false, refreshing: false })
      });
  }

  setorSampah() {
    const { kategori, berat, saldo } = this.state;
    this.setState({ loading: true })
    if (kategori !== "" && berat !== "" && saldo !== "") {
      const trash = {
        trash_id: kategori,
        weight: berat,
        price: saldo
      };
      fetch('https://sampahbank.herokuapp.com/api/sell', {
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
          ToastAndroid.show("Sampah Success Terjual", ToastAndroid.SHORT);
          this.setState({ loading: false });
          this.showModalSetor(false);
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

  getHistory() {
    this.setState({ loading: true })
    fetch("https://sampahbank.herokuapp.com/api/sell", {
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
          ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
          this.setState({ loading: false, refreshing: false })
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
    fetch("https://sampahbank.herokuapp.com/api/trash", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.props.userData.userReducer.user}`
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.status)
        const { message } = responseJson;
        if (message) {
          this.setState({
            sampah: responseJson.status,
            loading: false,
            refreshing: false
          });
        } else {
          ToastAndroid.show("Gagal Memuat", ToastAndroid.LONG);
          this.setState({ loading: false, refreshing: false })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({ loading: false, refreshing: false })
      });
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
            loading1: false,
            refreshing: false
          });
        } else {
          this.props.navigation.goBack();
          this.setState({
            loading: false,
            loading1: false,
            refreshing: false
          })
        }
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show("Network Request Failed", ToastAndroid.LONG);
        this.setState({
          loading: false,
          loading1: false,
          refreshing: false
        })
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

  showModalSetor(visible) {
    this.setState({ modalSetor: visible });
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
          visible={this.state.modalSetor}
          transparent={true}
          animationType="fade">
          <View style={style.container1}>
            <View style={style.header}>
              <View style={style.headerWrapper}>
                <TouchableOpacity onPress={() => this.showModalSetor(false)}>
                  <Image
                    source={require("../../assets/arrow.png")}
                    style={style.menu1}
                  />
                </TouchableOpacity>
                <Text style={style.title2}>Jual Sampah</Text>
              </View>
            </View>
            <Image
              style={style.welcomeImage}
              source={require("../../assets/gambar1.png")} />
            <ScrollView>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Jenis Sampah :</Text>
              <View style={style.contPicker}>
                <Picker dropdownIconColor="#009387" mode="dropdown" onValueChange={(a) => this.setState({ kategori: a })} selectedValue={this.state.kategori} style={[style.picker, { color: "#009387" }]}>
                  {this.state.kategory.map((value, index) => (
                    <Picker.Item key={index} label={value.trash} value={value.id} />
                  ))}
                </Picker>
              </View>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Berat :</Text>
              <View style={[style.contPicker]}>
                <TextInput
                  placeholder="Berat Sampah /Kg"
                  selectionColor="#009387"
                  color="#009387"
                  keyboardType="number-pad"
                  onChangeText={(berat) => this.setState({ berat })}
                  style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                />
              </View>
              <Text style={{ marginLeft: 10, fontWeight: "700", marginTop: 10, marginBottom: 3 }}>Harga Sampah :</Text>
              <View style={style.contPicker}>
                <TextInput
                  placeholder="Harga Jual /Kg"
                  selectionColor="#009387"
                  color="#009387"
                  keyboardType="number-pad"
                  onChangeText={(saldo) => this.setState({ saldo })}
                  style={{ borderColor: "white", marginHorizontal: 12, marginTop: 7, width: "100%", fontSize: 16 }}
                />
              </View>
              <View style={style.contText3}>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>Harga Sampah</Text>
                <Text style={{ fontWeight: "700", fontSize: 18 }}>Rp {this.state.berat * this.state.saldo}-,</Text>
              </View>
              <TouchableNativeFeedback onPress={() => this.setorSampah()} style={style.btnWrapper}>
                <View style={[style.btn, { backgroundColor: "#009387", marginTop: 15 }]}>
                  {this.state.loading
                    ? (<LottieView source={require("../../assets/8707-loading.json")} style={style.loading2} autoPlay loop />)
                    : (<Text style={[style.label, { fontSize: 14 }]}>Terjual</Text>)}
                </View>
              </TouchableNativeFeedback>
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
                <TouchableNativeFeedback>
                  <View style={[style.containerList]}>
                    <Image
                      source={require("../../assets/settings.png")}
                      style={style.icon5}
                    />
                    <Text style={style.textList}>Pengaturan</Text>
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
        <StatusBar backgroundColor="#009387" />
        <View style={style.header}>
          <View style={style.headerWrapper}>
            <Image
              source={require("../../assets/gambar.png")}
              style={style.menu}
            />
            <Text style={style.title}>Gomi Trash</Text>
          </View>
        </View>
        <View style={style.top2}>
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
        </View>
        <View style={style.contTab1}>
          <TouchableOpacity onPress={() => this.setState({ screen: 1 })}>
            <Image
              source={require("../../assets/cube.png")}
              style={
                this.state.screen == 1
                  ? style.onIcon1
                  : style.icon1
              }
            />
            <Text style={
              this.state.screen == 1
                ? [style.textTab, { fontSize: 12, fontWeight: "700" }]
                : [style.textTab, { fontSize: 10 }]}>Penjualan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ screen: 3 })}>
            <Image
              source={require("../../assets/warehouse.png")}
              style={
                this.state.screen !== 1
                  ? style.onIcon1
                  : style.icon1
              }
            />
            <Text style={
              this.state.screen !== 1
                ? [style.textTab, { fontSize: 12, fontWeight: "700" }]
                : [style.textTab, { fontSize: 10 }]}>Belum Terjual</Text>
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
                  this.getProfile()
                  this.getSampah()
                  this.getHistory()
                  this.getKategori()
                  this._onRefresh()
                }}
              />
            }
            showsVerticalScrollIndicator={false}>
            {this.state.screen == 1
              ? this.state.history == ""
                ? <Text style={{ textAlign: "center" }}>Data Kosong</Text>
                : (this.state.history.map((item, index) => (
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
              : this.state.sampah == ""
                ? <Text style={{ textAlign: "center" }}>Data Kosong</Text>
                : (this.state.sampah.map((item, index) => (
                  <TouchableNativeFeedback key={index}>
                    <View style={style.list3}>
                      <View style={{ marginLeft: 15 }}>
                        <Text style={[style.text, { marginBottom: 5, fontSize: 10 }]}>ID Sampah: #{item.trash_id}</Text>
                        <Text style={[style.barang, { fontSize: 15, }]}>{item.trash.trash}</Text>
                      </View>
                      <View style={{ marginRight: 15 }}>
                        <Text style={[style.text, { textAlign: "right", fontSize: 10 }]}>Stok</Text>
                        <Text style={[style.barang, { textAlign: "right" }]}>{item.weight} Kg</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                ))
                )}
          </ScrollView>}
        {this.state.screen !== 1
          ? null
          : <TouchableNativeFeedback onPress={() => this.showModalSetor()}>
            <View style={style.take}>
              <Image
                source={require("../../assets/plus.png")}
                style={style.plus}
              />
              <Text style={style.trash}>Sampah Terjual</Text>
            </View>
          </TouchableNativeFeedback>}
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