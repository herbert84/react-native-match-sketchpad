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
        return 40 * this.scaleFactor * this.props.data.scale;
    }
    onPressText() {
        let currentPressCount = this.state.pressTextCount ? this.state.pressTextCount : 0;
        this.setState({
            pressTextCount: currentPressCount + 1
        });
        this.firePressEvent();
    }
    onTextLayout(event) {
        console.log(event.nativeEvent.layout);
        console.log(this.props.data.text);
        let { layout } = event.nativeEvent;
        let { x, y, width, height } = event.nativeEvent.layout;
        if (!(x === 0 && y === 0 && height === 0)) {
            if (this.props.data.status === "drawing") {
                this.props.onTextLayout && this.props.onTextLayout(layout);
            } else {
                this.setState({
                    isTextRendered: true,
                    touchAreaHeight: height,
                    touchAreaWidth: width,
                    touchAreaX: x,
                    touchAreaY: y
                });
            }
        }
    }
    renderTextInContainer() {
        return (
            <Text
                x="0"
                y="0"
                fontFamily={this.props.data.font}
                fontSize={this.getSizeByHeight()}
                textAnchor="start"
                opacity={this.props.data.status === "drawing" ? "0" : "1"}
                onPress={this.onPressText.bind(this)}>
                {this.props.data.text}
            </Text>
        );
    }
    renderText() {
        return (
            <Text
                x={this.props.data.x * this.scaleFactor}
                y={this.props.data.y * this.scaleFactor}
                fontFamily={this.props.data.font}
                fontSize={this.getSizeByHeight()}
                textAnchor="start"
                opacity={this.props.data.status === "drawing" ? "0" : "1"}
                onPress={this.onPressText.bind(this)}
                onLayout={this.onTextLayout.bind(this)}>
                {this.props.data.text}
            </Text>
        );
    }
    renderTouchArea() {
        if (this.state.isTextRendered && this.isEdit && this.props.data.status !== "drawing") {
            return (
                <Rect x="0"
                    y={0 - this.state.touchAreaHeight}
                    width={this.state.touchAreaWidth}
                    height={this.state.touchAreaHeight}
                    fill="rgb(0, 0, 0)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0"
                    stroke={this.props.data.color}
                    opacity={this.state.isSelected ? "0.15" : "0"}
                    onPress={this.onPressText.bind(this)}
                />
            );
        } else {
            return null;
        }
    }
    textContainer(items) {
        if (this.isEdit) {
            return (
                <G
                    ref={ele => { this.root = ele; }}
                    x={this.state.x}
                    y={this.state.y}
                    {...this._panResponder.panHandlers}
                >
                    {items}
                </G>
            )
        } else {
            return (<G
                ref={ele => { this.root = ele; }}
                x={this.state.x}
                y={this.state.y}
            >
                {items}
            </G>)
        }
    }
    render() {
        let result = [];
        if (this.props.data.status === "drawing" || !this.state.isTextRendered) {
            result.push(this.renderText());
            return result;
        } else {
            result.push(this.renderTouchArea());
            result.push(this.renderTextInContainer());

            return this.textContainer(result);
        }
    }
}
export default SketchText;
