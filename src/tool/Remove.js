import React, { Component } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import Button from "../component/Button";
import AppImageList from "../core/AppImageList";

class Remove extends Component {
    onPress() {
        let that = this;
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions({
                options: [
                    '清空草图上所有绘制元素',
                    '取消',
                ],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0
            }, function (index) {
                if (index === 0) {
                    that.props.onPress();
                }
            })
        } else {
            Alert.alert(
                '',
                '清空草图上所有绘制元素',
                [
                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: '确定', onPress: () => that.props.onPress() }
                ],
                { cancelable: false }
            )
        }
    }
    render() {
        return (<Button imageSource={AppImageList.remove} onPress={() => this.onPress()} isDisabled={this.props.isDisabled} />)
    }
}
export default Remove;