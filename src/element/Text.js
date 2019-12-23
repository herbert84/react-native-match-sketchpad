import React, { Component } from 'react';
import { Platform } from "react-native";
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import Svg, { Text, Rect, G } from 'react-native-svg';
import * as _ from "lodash";
import TextSize, { TSFontSpecs } from 'react-native-text-size';

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
            isTextMeasured: false,
            touchAreaX: 0,
            touchAreaY: 0,
            touchAreaWidth: 0,
            touchAreaHeight: 0
        };
    }
    getSizeByHeight() {
        return 20 * this.scaleFactor * this.props.data.scale;
    }
    /**
     * 点击文本的响应函数，第一阶段先不处理双击事件
     *
     * @memberof SketchText
     */
    onPressText() {
        // let currentPressCount = this.state.pressTextCount ? this.state.pressTextCount : 0;
        // this.setState({
        //     pressTextCount: currentPressCount + 1
        // });
        // this.firePressEvent();
        this.objectOnPress();
    }
    async measureTextSize(data) {
        let size = await TextSize.measure({
            text: data.text,
            fontFamily: data.font,
            fontSize: this.getSizeByHeight(data.scale)
        });
        // this.textSize = size;
        if (this.props.data.status === "drawing") {
            console.log(this.props.data.text);
            console.log(size);
            this.props.onTextLayout && this.props.onTextLayout(size);
        } else {
            this.setState({
                isTextMeasured: true,
                touchAreaHeight: size.height,
                touchAreaWidth: size.width
            });
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
                fill={this.props.data.color}
                opacity={this.props.data.status === "drawing" ? "0" : "1"}
                onPress={this.onPressText.bind(this)}>
                {this.props.data.text}
            </Text>
        );
    }
    renderTouchArea() {
        // workaround: 安卓平台下面，画svg的时候如果一个物体的不透明度为0的话，该物体将不能触发点击事件
        // 因此需要判断当运行平台为安卓时，文本选择框的最小不透明度为0.02
        const MIN_OPACITY = Platform.OS === "ios" ? "0" : "0.02";
        if (this.state.isTextMeasured && this.isEdit && this.props.data.status !== "drawing") {
            return (
                <Rect x="0"
                    y={0 - this.state.touchAreaHeight + (this.state.touchAreaHeight / 5)} // 修正在Group下的位置偏移
                    width={this.state.touchAreaWidth}
                    height={this.state.touchAreaHeight}
                    fill="rgb(0, 0, 0)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0"
                    stroke={this.props.data.color}
                    opacity={this.state.isSelected ? "0.15" : MIN_OPACITY}
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
        if (this.props.data.status === "drawing" || !this.state.isTextMeasured) {
            this.measureTextSize(this.props.data);
            return result;
        } else {
            result.push(this.renderTouchArea());
            result.push(this.renderTextInContainer());
            return this.textContainer(result);
        }
    }
}
export default SketchText;
