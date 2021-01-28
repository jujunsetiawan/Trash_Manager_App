import {StyleSheet} from "react-native"

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10

    },
    logo: {
        height: 40,
        width: 40,
        marginTop: 20,
    },
    logo1: {
        height: 40,
        width: 40,
        marginTop: 15,
    },
    login: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#009387",
        marginTop: 15,
        marginLeft: 5
    },
    login1: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#009387",
        marginTop: 5,
        marginLeft: 5
    },
    content: {
        justifyContent: "center",
        marginTop: 20
    },
    content1: {
        justifyContent: "center",
        marginTop: 10
    },
    textinput: {
        height: 35,
        borderBottomColor: "#009387",
        borderBottomWidth: 1,
        marginTop: 10,
        fontSize: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        height: 35,
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginHorizontal: 10,
        marginBottom: 25
    },
})

export default style;