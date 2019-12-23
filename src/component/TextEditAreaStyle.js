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
        height: 34,
        marginBottom: 16,
        width: "100%"
    },
    colorItemContainer: {
        height: 26,
        width: 26,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 13,
        borderWidth: 5
    },
    colorItem: {
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: "#FFFFFF"
    },
    colorItemContainerPortrait: {
        height: 32,
        width: 32,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 16,
        borderWidth: 5
    },
    colorItemPortrait: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 3,
        borderColor: "#FFFFFF"
    }
});
export default styles;
