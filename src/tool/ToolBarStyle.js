import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    containerEditReadInPortrait: {
        flexDirection: "row",
        paddingTop: 12.5,
        paddingLeft: 16,
        paddingRight: 16,
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
    }
});

export default styles;