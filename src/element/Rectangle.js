import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import { Svg, Rect } from 'react-native-svg';

class Rectangle extends SketchObject {
    constructor(props) {
        super(props);
    }
    /**
     * 绘制矩形
     *
     * @returns
     * @memberof Rectangle
     */
    renderRectangle() {
        return <Rect x="0"
            y="0"
            width={this.props.data.width * this.scaleFactor}
            height={this.props.data.height * this.scaleFactor}
            fill={this.props.data.backgroundColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={this.props.data.lineWidth}
            stroke={this.props.data.color}
            onPress={() => this.objectOnPress()}
        />;
    }

    render() {
        //let result = [];
        //result.push(this.drawRectangle());
        //return result;
        let rect = {
            x: this.props.data.x * this.scaleFactor,
            y: this.props.data.y * this.scaleFactor,
            width: this.props.data.width * this.scaleFactor,
            height: this.props.data.height * this.scaleFactor
        }
        if (this.props.data.width > 0 && this.props.data.height > 0) {
            return this.objectContainer(this.renderRectangle(), rect);
        } else return null;
    }
}
export default Rectangle;
