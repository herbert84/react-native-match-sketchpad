import React, { Component } from 'react';
import { TouchableOpacity, View, Image, TextInput, Dimensions, Platform, Animated, Keyboard } from "react-native";
import * as Animatable from "react-native-animatable";
import styles from "./TextEditAreaStyle";
import ColorMappings from "../data/ColorMappings";

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
            value: props.data.text,
            selectedColorIndex: 4
        };
    }

    componentWillMount() {
        // android环境下不能触发 keyboardWillShow 和 keyboardWillHide 事件，只能使用 didShow 来代替
        if (platform === "ios") {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        } else {
            this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowSub && this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub && this.keyboardWillHideSub.remove();
        this.keyboardDidShowSub && this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub && this.keyboardDidHideSub.remove();
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

    keyboardDidShow = (event) => {
        Animated.parallel([
            Animated.timing(this.rootViewPaddingBottom, {
                duration: 250,
                toValue: event.endCoordinates.height + (this.props.isPortrait ? 21 : 0),
            }),
        ]).start();
    };

    keyboardDidHide = () => {
        Animated.parallel([
            Animated.timing(this.rootViewPaddingBottom, {
                duration: 250,
                toValue: this.isIphonexPortrait ? 34 : 0,
            }),
        ]).start();
    };

    onTextInputViewLayout(event) {
        this.textInputViewHeight = event.nativeEvent.layout.height;
    }
    /**
     * 渲染颜色选择列表
     *
     * @memberof ToolBar
     */
    renderColorSelectionList() {
        let items = [];
        ColorMappings.forEach((item, index) => {
            items.push(this.renderColorSelectionItem(item, index));
        });
        return (
            <View style={styles.colorList}>
                {items}
            </View>
        );

    }
    /**
     * 渲染颜色选择块
     *
     * @param {*} item
     * @returns
     * @memberof ToolBar
     */
    renderColorSelectionItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.onSelectColor(index)}>
                <View style={[
                    styles.colorItemContainerPortrait,
                    { borderColor: index === this.state.selectedColorIndex ? "rgba(255,255,255,0.33)" : "rgba(0,0,0,0)" }
                ]}>
                    <View style={[
                        styles.colorItemPortrait,
                        { backgroundColor: item.uxColor }
                    ]} />
                </View>
            </TouchableOpacity>
        );
    }
    /**
     * 选择颜色的响应函数
     *
     * @memberof ToolBar
     */
    onSelectColor(index) {
        this.setState({
            selectedColorIndex: index
        });
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
                    <TouchableOpacity onPress={() => { this.props.onConfirm(this.state.value, ColorMappings[this.state.selectedColorIndex].color) }}>
                        <Image source={require("../images/text/end_typing.png")} style={styles.operationImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textInputView} onLayout={this.onTextInputViewLayout.bind(this)}>
                    <TouchableOpacity style={styles.textInputTouchArea} onPress={() => { this.textInputRef.focus() }}>
                        <TextInput
                            ref={(e) => { this.textInputRef = e }}
                            style={[styles.textInput, { height: this.state.textInputHeight }]}
                            multiline={true}
                            autoFocus={true}
                            textAlign={"center"}
                            onContentSizeChange={(event) => {
                                this.setState({ textInputHeight: Math.min(event.nativeEvent.contentSize.height, this.textInputViewHeight) });
                            }}
                            value={this.state.value}
                            onChangeText={(text) => { this.setState({ value: text }) }}
                            disableFullscreenUI={true} />
                    </TouchableOpacity>
                </View>
                {this.renderColorSelectionList()}
            </Animatable.View >
        );
    }
}

export default TextEditArea;
