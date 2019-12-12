import React, { Component } from 'react';
import { TouchableOpacity, View, Image, TextInput, Dimensions, Platform, Animated, Keyboard } from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./TextEditAreaStyle";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const isIphoneX =
    platform === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

class TextEditArea extends Component {
    constructor(props) {
        super(props);
        if (this.props.isPortrait) {
            this.screenWidth = deviceWidth;
            this.screenHeight = deviceHeight;
        } else {
            this.screenWidth = deviceHeight;
            this.screenHeight = deviceWidth;
        }
        this.textInputViewHeight = 0;
        this.isIphonexPortrait = (isIphoneX && this.props.isPortrait);
        this.rootViewPaddingBottom = new Animated.Value(this.isIphonexPortrait ? 34 : 0);
        this.state = {
            textInputHeight: 20,
            value: props.data.text
        };
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(this.rootViewPaddingBottom, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
            }),
        ]).start();
    };

    keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(this.rootViewPaddingBottom, {
                duration: event.duration,
                toValue: this.isIphonexPortrait ? 34 : 0,
            }),
        ]).start();
    };

    onTextInputViewLayout(event) {
        this.textInputViewHeight = event.nativeEvent.layout.height;
    }

    render() {
        return (
            <Animatable.View
                style={[styles.rootView, {
                    width: this.screenWidth,
                    height: this.screenHeight,
                    paddingTop: this.isIphonexPortrait ? 34 : 0,
                    paddingBottom: this.rootViewPaddingBottom
                }]}
                animation="slideInUp"
                duration={400}>
                <View style={styles.operationBar}>
                    <TouchableOpacity onPress={this.props.onCancel}>
                        <Image source={require("../images/text/cancel_typing.png")} style={styles.operationImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.onConfirm(this.state.value) }}>
                        <Image source={require("../images/text/end_typing.png")} style={styles.operationImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textInputView} onLayout={this.onTextInputViewLayout.bind(this)}>
                    <TextInput
                        style={[styles.textInput, { height: this.state.textInputHeight }]}
                        multiline={true}
                        autoFocus={true}
                        textAlign={"center"}
                        onContentSizeChange={(event) => {
                            this.setState({ textInputHeight: Math.min(event.nativeEvent.contentSize.height, this.textInputViewHeight) });
                        }}
                        value={this.state.value}
                        onChangeText={(text) => { this.setState({ value: text }) }} />
                </View>
                <View style={styles.colorList}>
                    <View style={styles.colorItem} />
                    <View style={styles.colorItem} />
                    <View style={styles.colorItem} />
                    <View style={styles.colorItem} />
                    <View style={styles.colorItem} />
                    <View style={styles.colorItem} />
                </View>
            </Animatable.View>
        );
    }
}

export default TextEditArea;
