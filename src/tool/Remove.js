import React, { Component } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import Button from "../component/Button";
import Utils from "../core/Utils";
import AppImageList from "../core/AppImageList";

class Remove extends Component {
    onPress() {
        let that = this;
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions({
                options: [
                    Utils.getTranslatedText("MESSAGE", "DELETE_CONFIRM_IOS", that.props.language),
                    Utils.getTranslatedText("BUTTON", "DIALOG_CANCEL", that.props.language),
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
                Utils.getTranslatedText("MESSAGE", "DELETE_CONFIRM_ANDROID", that.props.language),
                [
                    { text: Utils.getTranslatedText("BUTTON", "DIALOG_CANCEL", that.props.language), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: Utils.getTranslatedText("BUTTON", "DIALOG_DELETE", that.props.language), onPress: () => that.props.onPress() }
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