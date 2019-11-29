import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import Svg, { Text } from 'react-native-svg';

class SketchText extends SketchObject {
    static propTypes = {
        data: PropTypes.object,
        type: PropTypes.string
    };

    static defaultProps = {
        data: {
            x: 0,
            y: 0,
            scale: 1,
            font: "Arial"
        },
        type: "Text"
    };
    constructor(props) {
        super(props);
    }
    getSizeByHeight() {
        return 20 * this.scaleFactor * this.props.data.scale;
    }
    render() {
        //console.log(this.props.data)
        return (
            <Text
                x={this.props.data.x * this.scaleFactor}
                y={this.props.data.y * this.scaleFactor}
                fontFamily={this.props.data.font}
                fontSize={this.getSizeByHeight()}
                textAnchor="start"
            >
                {this.props.data.text}
            </Text>
        )
    }
}
export default SketchText;