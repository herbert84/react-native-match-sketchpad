import React, { Component } from 'react';
import { View, DeviceEventEmitter } from "react-native";
import PropTypes from 'prop-types';
import { Svg, Image } from 'react-native-svg';
import Utils from "./Utils";

class Background extends Component {
    static propTypes = {
        bg: PropTypes.array,
        width: PropTypes.string,
        height: PropTypes.string
    };

    static defaultProps = {
        width: "100%",
        height: "100%",
        bg: [
            {
                "image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND",
                "scaleFactor": 1
            }
        ]
    };
    constructor(props) {
        super(props);
    }
    onPressBackground() {
        this.props.attachObjectEvent({ selectedId: null });
        //DeviceEventEmitter.emit("sketchobject_" + Global.instanceId, JSON.stringify({ selectedId: null }))
    }
    render() {
        if (this.props.isEdit) {
            return (
                <Image
                    x="0"
                    y="0"
                    width={this.props.width}
                    height={this.props.height}
                    href={Utils.loadImage(this.props.bg[0].image)}
                    onPress={() => this.onPressBackground()}
                />
            )
        } else {
            return (
                <Image
                    x="0"
                    y="0"
                    width={this.props.width}
                    height={this.props.height}
                    href={Utils.loadImage(this.props.bg[0].image)}
                />
            )
        }
    }
}
export default Background;