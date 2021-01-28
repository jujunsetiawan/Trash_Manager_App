import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1
    },
    bg: {
        height: "100%",
        width: "100%",
        position: "absolute"
    },
    contentContainer: {
        padding: 10,
        marginTop: 10,
        flex: 1
    },
    back: {
        height: 30,
        width: 30
    },
    button: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: "center",
        position: "absolute",
        right: 15,
        backgroundColor: "#FFF",
        top: 20
    },
    top: {
        height: 150,
        backgroundColor: "#009387",
    },
    avatar: {
        height: 65,
        width: 65,
        borderRadius: 32.5,
    },
    name: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold"
    },
    no: {
        color: "#fff",
        opacity: 0.5
    },
    cont: {
        paddingLeft: 17
    },
    img: {
        height: 65,
        width: 65,
        borderRadius: 32.5,
        margin: 17
    },
    mid: {
        flex: 1
    },
    containerList: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        marginTop: 5
    },
    icon: {
        height: 30,
        width: 30,
        marginHorizontal: 15,
        tintColor: "#009387"
    },
    textList: {
        fontFamily: "HelveticaNeue",
        fontWeight: "700",
        textAlign: "center",
        color: "#009387",
    },
    icon1: {
        height: 25,
        width: 25,
        marginHorizontal: 17.5,
        tintColor: "#009387"
    },
    line: {
        borderBottomColor: "#9e9e9e",
        borderBottomWidth: 0.3,
        height: 1,
        marginTop: 5
    },
    logout: {
        height: 30,
        width: 70,
        backgroundColor: "#009387",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        position: "absolute",
        right: 10,
        bottom: 5
    }
})