import { StyleSheet, Dimensions } from "react-native";
let ScreenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    containerEditReadInPortrait: {
        flexDirection: "row",
        paddingTop: 12.5,
        paddingLeft: 16,
        paddingRight: 16,
        width: ScreenWidth,
        justifyContent: "space-between"
    },
    containerEditReadInLandscape: {
        flexDirection: "column",
        paddingTop: 16,
        paddingLeft: 12.5,
        paddingBottom: 16,
        justifyContent: "space-between"
    },
    elementContainer: {
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 18
    },
    essentialBtnContainerInPortrait: {
        flexDirection: "row",
        width: 210,
        justifyContent: "space-between"
    },
    essentialBtnContainerInLandscape: {
        flexDirection: "column",
        width: 36,
        height: 210,
        justifyContent: "space-between"
    },
    modalLabel: {
        color: "#FFF",
        fontSize: 15
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
