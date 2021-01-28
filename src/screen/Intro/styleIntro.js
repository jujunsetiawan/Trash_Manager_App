import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1
    },
    bg: {
        position: "absolute"
    },
    contentContainer: {
        padding: 10,
        marginTop: 10,
        flex: 1
    },
    logo: {
        alignSelf: "center"
    },
    welcomeImage: {
        height: 205,
        width: 260,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 30,
    },
    top: {
        flex: 1
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
    },
    heading: {
        fontFamily: "HelveticaNeue",
        fontSize: 17,
        fontWeight: "700",
        lineHeight: 41,
        textAlign: "center",
        color: "#3f414e",
    },
    subHeading: {
        fontFamily: "HelveticaNeue",
        fontSize: 14,
        fontWeight: "300",
        lineHeight: 26,
        textAlign: "center",
        color: "#a1a4b2"
    },
    btnWrapper: {
        // marginTop: 60,
    },
    loginWrapper: {
        textAlign: "center",
        marginTop: 30,
        // marginBottom: 90,
    },
    notificationContent: {
        color: "#a1a4b2",
        fontSize: 12,
        fontFamily: "HelveticaNeue",
    },
    link: {
        color: "#009387",
        fontSize: 12,
        fontFamily: "HelveticaNeue",
    },
    brand: { 
        position: "absolute",
        fontSize: 20,
        fontWeight: "bold",
        color: "#009387",
        left: "33%"
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
})