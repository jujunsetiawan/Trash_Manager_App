import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1
    },
    contentContainer: {
        flex: 1,
        padding: 10
    },
    back: {
        height: 40,
        width: 40,
    },
    heading: {
        fontFamily: "HelveticaNeue",
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 41,
        textAlign: "center",
        color: "#3f414e",
        marginTop: 10
    },
    btnWrapper: {
        marginTop: 20
    },
    btnItemwrapper: {
        marginBottom: 10,
    },
    or: {
        textAlign: "center",
        marginTop: 20,
        fontFamily: "HelveticaNeue",
        fontSize: 10,
        fontWeight: "700",
        lineHeight: 41,
        textAlign: "center",
        color: "#a1a4b2"
    },
    inputItem: {
        marginTop: 10
    },
    loginBtnWrapper: {
        marginTop: 30,
    },
    forgotPassword: {
        fontFamily: "HelveticaNeue",
        fontWeight: "400",
        fontSize: 11,
        textAlign: "center",
        marginTop: 7,
        color: "#9e9e9e",
        height: 20
    },
    footerText: {
        fontFamily: "HelveticaNeue",
        fontWeight: "400",
        fontSize: 10,
        textAlign: "center",
    },
    footerText1: {
        color: "#999",
        fontSize: 11
    },
    footerText2: {
        color: "#009387",
        fontSize: 11
    },
    footerWrapper: {
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    button: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginTop: 10,
        alignItems: "center",
    },
    containerInput: {
        display: "flex",
        backgroundColor: "#f2f3f7",
        borderRadius: 10,
        borderColor: "#9e9e9e",
        borderWidth: 0.3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5
    },
    input: {
        padding: 10,
        marginLeft: 5,
        borderColor: "#fff"
    },
    icon: {
        width: 20,
        marginLeft: 12,
        tintColor: "#009387"
    },
    check: {
        height: 10,
        width: 13,
        marginRight: 10
    },
    cont: {
        flexDirection: "row",
        alignItems: "center"
    },
    eye: {
        height: 10,
        width: 16,
        marginLeft: 12,
        tintColor: "#000",
        marginRight: 10
    },
    btn: {
        borderRadius: 30,
        height: 35,
        justifyContent: "center"
    },
    label: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: "#fff",
        fontFamily: "HelveticaNeue",
        padding: 20,
    },
    welcomeImage: {
        height: 171,
        width: 260,
        alignSelf: "center",
        marginBottom: 35,
        marginTop: 15
    },
    text: {
        marginLeft: 5,
        color: "#009387",
        fontSize: 13
    },
    loading: {
        height: 40,
        width: 40,
        alignSelf: "center",
    },
})