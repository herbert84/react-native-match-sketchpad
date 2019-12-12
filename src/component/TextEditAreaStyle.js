import { StyleSheet, Dimensions, Platform } from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
const styles = StyleSheet.create({
    rootView: {
        position: "absolute",
        top: 0,
        left: 0
    },
    operationBar: {
        width: "100%",
        height: 60,
        padding: 17,
        backgroundColor: "#000000",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    operationImage: {
        width: 20,
        height: 20
    },
    textInputView: {
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, .6)",
        justifyContent: "center"
    },
    textInput: {
        width: "100%",
        color: "#FFFFFF"
    },
    colorList: {
        backgroundColor: "rgba(0, 0, 0, .6)",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        width: "100%"
    },
    colorItem: {
        height: 20,
        width: 20,
        marginLeft: 13,
        marginRight: 13,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#FFFFFF"
    }
});
export default styles;
