import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import Svg, { Text, Rect, G } from 'react-native-svg';
import * as _ from "lodash";

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
        this.firePressEvent = _.debounce(() => {
            if (this.state.pressTextCount === 1) {
                this.objectOnPress();
            } else if (this.state.pressTextCount === 2) {
                this.objectOnDoublePress();
            }
            this.setState({
                pressTextCount: 0
            });
        }, 200);
        this.state = {
            pressTextCount: 0,
            isTextRendered: false,
            touchAreaX: 0,
            touchAreaY: 0,
            touchAreaWidth: 0,
            touchAreaHeight: 0
        };
    }
    getSizeByHeight() {
        return 50 * this.scaleFactor * this.props.data.scale;
    }
    onPressText() {
        this.setState({
            pressTextCount: this.state.pressTextCount + 1
        });
        this.firePressEvent();
    }
    onTextLayout(event) {
        console.log(event.nativeEvent.layout);
        console.log(this.props.data.text);
        let { x, y, width, height } = event.nativeEvent.layout;
        if (!(x === 0 && y === 0 && height === 0)) {
            this.setState({
                isTextRendered: true,
                touchAreaHeight: height,
                touchAreaWidth: width,
                touchAreaX: x,
                touchAreaY: y
            });
        }
        this.props.onTextLayout ? this.props.onTextLayout(event.nativeEvent.layout) : null;
    }
    renderText() {
        return (
            <Text
                x={this.props.data.x * this.scaleFactor}
                y={this.props.data.y * this.scaleFactor}
                width={50}
                fontFamily={this.props.data.font}
                fontSize={this.getSizeByHeight()}
                textAnchor="start"
                onPress={this.onPressText.bind(this)}
                onLayout={this.onTextLayout.bind(this)}>
                {this.props.data.text}
            </Text>
        );
    }
    renderTouchArea() {
        if (this.state.isTextRendered) {
            return (
                <Rect x={this.state.touchAreaX}
                    y={this.state.touchAreaY}
                    width={this.state.touchAreaWidth}
                    height={this.state.touchAreaHeight}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0"
                    stroke={this.props.data.color}
                    opacity="0"
                    onPress={this.onPressText.bind(this)}
                />
            );
        } else {
            return null;
        }
    }
    render() {
        let result = [];
        result.push(this.renderText());
        result.push(this.renderTouchArea());
        return result;
    }
}
export default SketchText;
