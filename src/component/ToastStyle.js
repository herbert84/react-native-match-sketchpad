import { StyleSheet, Dimensions, Platform } from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        elevation: 9,
        flexDirection: "row",
        justifyContent: "center"
    },
    toastTextView: {
        backgroundColor: "#000000",
        borderRadius: 6,
        height: 42,
        paddingLeft: 22,
        paddingRight: 22,
        justifyContent: "center"
    },
    toastText: {
        color: "#FFFFFF",
        fontSize: 14
    }
});
export default styles;
