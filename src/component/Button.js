import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text } from "react-native";

class Button extends Component {
    renderLabel() {
        return this.props.label ? (<Text style={{ color: "#FFF", width: this.props.isPortrait ? "auto" : 20, alignItems: "center", textAlign: "center" }}>{this.props.label}</Text>) : null;
    }
    render() {
        let width = this.props.width ? this.props.width : 36;
        let height = this.props.height ? this.props.height : 36;
        return (<TouchableOpacity onPress={() => this.props.onPress()} style={{ flexDirection: this.props.isPortrait ? "row" : "column", alignItems: "center", justifyContent: "center" }}>
            <Image source={this.props.imageSource} style={{ width, height }} />
            {this.renderLabel()}
        </TouchableOpacity>)
    }
}

export default Button;