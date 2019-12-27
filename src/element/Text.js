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

        this.state = {
            pressTextCount: 0,
            isTextMeasured: false,
            touchAreaX: 0,
            touchAreaY: 0,
            touchAreaWidth: 0,
            touchAreaHeight: 0,
            lastClickTime: 0
        };
        this.initText();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedId === this.props.data.id) {
            console.log("found and selected")
            this.initText()
            this.addDraggableResponder()
        } else {
            this.initText()
        }
    }
    getSizeByHeight() {
        return 20 * this.scaleFactor * this.props.data.scale;
    }
    initText() {
        this.setState({
            x: this.props.data.x * this.scaleFactor,
            y: this.props.data.y * this.scaleFactor,
            rotation: this.props.data.rotation
        });
        this.measureTextSize(this.props.data);
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
        //this.firePressEvent();
        //this.objectOnPress();
        /*let currentClickTime = new Date().getTime();
        if (currentClickTime - this.state.lastClickTime < 200) {
            this.objectOnDoublePress()
        } else {
            this.objectOnPress();
        }
        this.setState({
            lastClickTime: currentClickTime
        });*/
        this.objectOnPress();
    }
    measureTextSize(data) {
        let that = this;
        TextSize.measure({
            text: data.text,
            fontFamily: data.font,
            fontSize: this.getSizeByHeight(data.scale)
        }).then((size) => {
            if (that.props.data.status === "drawing") {
                console.log(this.props.data.text);
                console.log(size);
                that.props.onTextLayout && that.props.onTextLayout(size);
            } else {
                that.setState({
                    isTextMeasured: true,
                    touchAreaHeight: size.height,
                    touchAreaWidth: size.width
                });
            }
        });
        // this.textSize = size;
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
            >
                {this.props.data.text}
            </Text>
        );
    }
    renderTouchArea2() {
        // workaround: 安卓平台下面，画svg的时候如果一个物体的不透明度为0的话，该物体将不能触发点击事件
        // 因此需要判断当运行平台为安卓时，文本选择框的最小不透明度为0.02
        const MIN_OPACITY = Platform.OS === "ios" ? "0" : "0.02";
        if (this.state.isTextMeasured && this.isEdit && this.props.data.status !== "drawing" && this.state.isSelected) {
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
    renderTouchArea(rectWidth, rectHeight) {
        return (
            <Rect
                x="0"
                y={0 - rectHeight + (rectHeight / 5)} // 修正在Group下的位置偏移
                width={rectWidth}
                height={rectHeight}
                fill="none"
                fillOpacity="0.1"
                stroke="blue"
                strokeWidth="0"
                strokeOpacity="0.1"
                onPress={this.onPressText.bind(this)}
            />
        );
    }
    renderSelectedArea(rectWidth, rectHeight) {
        return this.props.data.id === this.props.selectedId ?
            (
                <Rect
                    x="0"
                    y={0 - rectHeight + (rectHeight / 5)} // 修正在Group下的位置偏移
                    width={rectWidth}
                    height={rectHeight}
                    fill="blue"
                    fillOpacity="0.1"
                    stroke="blue"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                />
            )
            : null;
    }
    textContainer(items, rect) {
        if (this.isEdit) {
            return (
                <G
                    ref={ele => { this.root = ele; }}
                    x={this.state.x || this.props.data.x * this.scaleFactor}
                    y={this.state.y || this.props.data.y * this.scaleFactor}
                    {...this._panResponder.panHandlers}
                >
                    {this.renderSelectedArea(rect.width, rect.height)}
                    {items}
                </G>
            )
        } else {
            return (<G
                ref={ele => { this.root = ele; }}
                x={this.state.x || this.props.data.x * this.scaleFactor}
                y={this.state.y || this.props.data.y * this.scaleFactor}
            >
                {items}
            </G>)
        }
    }
    render() {
        let result = [];
        /*if (this.props.data.status === "drawing" || !this.state.isTextMeasured) {
            //this.measureTextSize(this.props.data);
            return result;
        } else {
            //result.push(this.renderTouchArea());
            result.push(this.renderTextInContainer());
            return this.textContainer(result);
        }*/
        result.push(this.renderTouchArea(this.state.touchAreaWidth, this.state.touchAreaHeight));
        result.push(this.renderTextInContainer());
        let rect = {
            x: this.props.data.x * this.scaleFactor,
            y: this.props.data.y * this.scaleFactor,
            width: this.state.touchAreaWidth,
            height: this.state.touchAreaHeight,
            rotation: this.props.data.rotation
        }
        return this.textContainer(result, rect)
    }
}
export default SketchText;
