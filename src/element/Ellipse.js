import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import { Svg, Ellipse as SvgEllipse, G, Rect } from 'react-native-svg';

class Ellipse extends SketchObject {
    constructor(props) {
        super(props);
    }
    /**
     * 绘制椭圆，使用svg的Ellipse组件
     *
     * @returns
     * @memberof Rectangle
     */
    drawEllipse() {
        let r = Math.round;
        //let X = this.props.data.x * this.scaleFactor + this.props.data.width * this.scaleFactor / 2;
        //let Y = this.props.data.y * this.scaleFactor + this.props.data.height * this.scaleFactor / 2;

        return <SvgEllipse
            cx={this.props.data.width * this.scaleFactor / 2}
            cy={this.props.data.height * this.scaleFactor / 2}
            rx={r(this.props.data.width * this.scaleFactor / 2)}
            ry={r(this.props.data.height * this.scaleFactor / 2)}
            fill={this.props.data.backgroundColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={this.props.data.lineWidth}
            stroke={this.props.data.color}
            onPress={() => this.objectOnPress()}
        />
    }

    render() {
        //let result = [];
        //result.push(this.drawEllipse());
        //return result;
        //return this.drawEllipse();
        let rectWidth = this.props.data.width * this.scaleFactor;
        let rectHeight = this.props.data.height * this.scaleFactor;
        let rect = {
            x: this.props.data.x * this.scaleFactor,
            y: this.props.data.y * this.scaleFactor,
            width: rectWidth,
            height: rectHeight
        }
        return this.objectContainer(this.drawEllipse(), rect)
    }
}
export default Ellipse;
