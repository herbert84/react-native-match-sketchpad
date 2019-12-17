import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text } from "react-native";

class Button extends Component {
    renderLabel() {
        if (this.props.label) {
            if (this.props.language.indexOf("en") > -1) {
                return (<Text style={{ color: "#FFF", width: "auto", alignItems: "center", textAlign: "center" }}>{this.props.label}</Text>)
            } else {
                return (<Text style={{ color: "#FFF", width: this.props.isPortrait ? "auto" : 20, alignItems: "center", textAlign: "center" }}>{this.props.label}</Text>)
            }
        } else {
            return null;
        }
    }
    renderBtnContent(width, height) {
        if (this.props.isDisabled) {
            return (<View style={{ width, height }}>
                <Image source={this.props.imageSource} style={{ width, height, position: "absolute" }} />
                <View style={{ backgroundColor: "rgba(0,0,0,0.5)", width, height }} />
            </View>)
        } else {
            return (<Image source={this.props.imageSource} style={{ width, height }} />)
        }
    }
    render() {
        let width = this.props.width ? this.props.width : 36;
        let height = this.props.height ? this.props.height : 36;
        return (<TouchableOpacity disabled={this.props.isDisabled} onPress={() => this.props.onPress()} style={{ flexDirection: this.props.isPortrait ? "row" : "column", alignItems: "center", justifyContent: "center" }}>
            {this.renderBtnContent(width, height)}
            {this.renderLabel()}
        </TouchableOpacity>)
    }
}

export default Button;