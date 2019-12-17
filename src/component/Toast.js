import React, { Component } from "react";
import { View, Dimensions, Platform, Animated, Text } from "react-native";
import styles from "./ToastStyle";
import Utils from "../core/Utils";

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            fadeAnim: new Animated.Value(0)
        };
    }
    static toastInstance;
    static show({ ...config }) {
        this.toastInstance.showToast({ config });
    }
    static hide() {
        if (this.toastInstance.getModalState()) {
            this.toastInstance.closeToast("functionCall");
        }
    }
    getToastStyle() {
        let style = {
            opacity: this.state.fadeAnim,
            width: this.props.sketchpadWidth,
            left: this.props.isPortrait ? 0 : Utils.isIPhoneXPaddTop(true),
            bottom: this.props.isPortrait ? ScreenHeight - Utils.isIPhoneXPaddTop() - this.props.sketchpadHeight + 20 : 20
        };
        return style;
    }
    getTop() {
        if (Platform.OS === "ios") {
            return 30;
        } else {
            return 0;
        }
    }
    getButtonText(buttonText) {
        if (buttonText) {
            if (buttonText.trim().length === 0) {
                return undefined;
            } else return buttonText;
        }
        return undefined;
    }
    getModalState() {
        return this.state.modalVisible;
    }
    showToast({ config }) {
        this.setState({
            modalVisible: true,
            text: config.text,
            buttonText: this.getButtonText(config.buttonText),
            type: config.type,
            position: config.position ? config.position : "bottom",
            supportedOrientations: config.supportedOrientations,
            style: config.style,
            buttonTextStyle: config.buttonTextStyle,
            buttonStyle: config.buttonStyle,
            textStyle: config.textStyle,
            onClose: config.onClose
        });
        // If we have a toast already open, cut off its close timeout so that it won't affect *this* toast.
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout)
        }
        // Set the toast to close after the duration.
        if (config.duration !== 0) {
            const duration = (config.duration > 0) ? config.duration : 1500;
            this.closeTimeout = setTimeout(this.closeToast.bind(this, 'timeout'), duration);
        }
        // Fade the toast in now.
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 200
        }).start();
    }
    closeModal(reason) {
        this.setState({
            modalVisible: false
        });
        const { onClose } = this.state;
        if (onClose && typeof onClose === "function") {
            onClose(reason);
        }
    }
    closeToast(reason) {
        clearTimeout(this.closeTimeout);
        Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            duration: 200
        }).start(this.closeModal.bind(this, reason));
    }
    render() {
        if (this.state.modalVisible) {
            return (
                <Animated.View
                    style={[this.getToastStyle(), styles.toastContainer]}>
                    <View style={styles.toastTextView}>
                        <Text style={styles.toastText}>{this.state.text}</Text>
                    </View>
                </Animated.View>
            );
        } else return null;
    }
}

export default Toast;
