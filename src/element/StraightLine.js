import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from "lodash";
import Line from "./Line";
import {
    Svg,
    Image,
    Path,
    G
} from 'react-native-svg';

class StraightLine extends Line {
    static propTypes = {
        touchAreaBackgroundColor: PropTypes.string,
        selectedLineColor: PropTypes.string,
        type: PropTypes.string
    };

    static defaultProps = {
        touchAreaBackgroundColor: "transparent",
        selectedLineColor: "red",
        type: "StraightLine"
    };
    constructor(props) {
        super(props);
        let { points } = this.props.data;
        let pointsArray = [];
        for (var i = 0; i < points.length - 1; i += 2) {
            pointsArray.push({ x: points[i] * this.scaleFactor, y: points[i + 1] * this.scaleFactor })
        }
        this.maxXPoint = _.maxBy(pointsArray, 'x');
        this.maxYPoint = _.maxBy(pointsArray, 'y');
        this.minXPoint = _.minBy(pointsArray, 'x');
        this.minYPoint = _.minBy(pointsArray, 'y');

        this.state = {
            x: this.minXPoint.x ? this.minXPoint.x : 0,
            y: this.minYPoint.y ? this.minYPoint.y : 0,
            hover: false
        }
    }
    /**
     * 绘制一条正弦波浪线
     * 使用svg的path组件来绘制该波浪线,参照pc端的逻辑,计算出该波浪线的路径,关于Path绘制路径的一些命令:
     * M=moveto; L=lineto; H=hotizontal lineto; V=vertical lineto; C=curveto; S=smooth curveto
     * @param {*} xs 起点x坐标
     * @param {*} ys 起点y坐标
     * @param {*} xe 终点x坐标
     * @param {*} ye 终点y坐标
     * @memberof Line
     */
    drawSinusLine(xs, ys, xe, ye, isTouchArea) {
        let pathData = "";
        let phi = Math.atan2(ye - ys, xe - xs);
        let length = this.lineLength(xe, ye, xs, ys);
        let x = 0, y = 0, x1 = xs, y1 = ys;
        pathData += `M${x1} ${y1} `;  // move to x1, y1
        let amplitude = 10 * this.scaleFactor, frequency = 10 * this.scaleFactor;
        let done = false;
        while (!done) {
            x += 1;
            let oldY = y;
            y = amplitude * Math.sin(1 / frequency * x);
            if (!((y * oldY) > 0)) {
                let nextZeroX = (x + Math.PI * frequency) * Math.cos(phi) - y * Math.sin(phi) + xs;
                let nextZeroY = (x + Math.PI * frequency) * Math.sin(phi) + y * Math.cos(phi) + ys;
                if (this.lineLength(nextZeroX, nextZeroY, xs, ys) >= length) {
                    pathData += `L${xe} ${ye} `;  // line to xe, ye
                    done = true;
                }
            }
            x1 = x * Math.cos(phi) - y * Math.sin(phi) + xs;
            y1 = x * Math.sin(phi) + y * Math.cos(phi) + ys;
            pathData += `L${x1} ${y1} `;  // line to x1, y1
        }
        let color = this.state.isSelected ? this.props.selectedLineColor : this.props.data.color;
        let width = this.state.isSelected ? this.props.data.lineWidth * 2 : this.props.data.lineWidth;

        if (isTouchArea) {
            return <Path d={pathData} stroke={this.props.touchAreaBackgroundColor} strokeWidth={this.props.data.lineWidth * 20} fill="none" onPress={() => this.objectOnPress()} />;
        } else {
            return <Path d={pathData} stroke={color} strokeDasharray={this.strokeDasharray} strokeWidth={width} fill="none" />;
        }
    }
    /**
     * 绘制一条直线
     * 使用path组件绘制一条直线
     * @param {*} xs 起点x坐标
     * @param {*} ys 起点y坐标
     * @param {*} xe 终点x坐标
     * @param {*} ye 终点y坐标
     * @param {*} strokeDasharray 虚线样式
     * @memberof Line
     */
    drawSimpleLine(xs, ys, xe, ye, isTouchArea) {
        let pathData = "";
        // draw the line
        pathData += `M${xs} ${ys} `;
        pathData += `L${xe} ${ye} `;
        let color = this.state.isSelected ? this.props.selectedLineColor : this.props.data.color;
        let width = this.state.isSelected ? this.props.data.lineWidth * 2 : this.props.data.lineWidth;

        if (isTouchArea) {
            return <Path d={pathData} stroke={this.props.touchAreaBackgroundColor} strokeWidth={this.props.data.lineWidth * 20} fill="none" onPress={() => this.objectOnPress()} />;
        } else {
            return <Path d={pathData} stroke={color} strokeDasharray={this.strokeDasharray} strokeWidth={width} fill="none" />;
        }
    }
    /**
     * 绘制一条双直线
     * 使用path组件绘制一条双直线
     * @param {*} xs 起点x坐标
     * @param {*} ys 起点y坐标
     * @param {*} xe 终点x坐标
     * @param {*} ye 终点y坐标
     * @param {*} strokeDasharray 虚线样式
     * @memberof Line
     */
    drawDoubleLine(xs, ys, xe, ye, isTouchArea) {
        let pathData = "";
        let phi = Math.atan2(ye - ys, xe - xs) + Math.PI / 2;
        let offset = 12 * this.scaleFactor;
        let xs1 = xs / this.scaleFactor + Math.cos(phi) * offset;
        let ys1 = ys / this.scaleFactor + Math.sin(phi) * offset;
        let xe1 = xe / this.scaleFactor + Math.cos(phi) * offset;
        let ye1 = ye / this.scaleFactor + Math.sin(phi) * offset;

        let xs2 = xs / this.scaleFactor - Math.cos(phi) * offset;
        let ys2 = ys / this.scaleFactor - Math.sin(phi) * offset;
        let xe2 = xe / this.scaleFactor - Math.cos(phi) * offset;
        let ye2 = ye / this.scaleFactor - Math.sin(phi) * offset;
        // draw the first one
        pathData += `M${xs1 * this.scaleFactor} ${ys1 * this.scaleFactor} `;
        pathData += `L${xe1 * this.scaleFactor} ${ye1 * this.scaleFactor} `;

        // draw the second one
        pathData += `M${xs2 * this.scaleFactor} ${ys2 * this.scaleFactor} `;
        pathData += `L${xe2 * this.scaleFactor} ${ye2 * this.scaleFactor} `;

        let color = this.state.isSelected ? this.props.selectedLineColor : this.props.data.color;
        let width = this.state.isSelected ? this.props.data.lineWidth * 2 : this.props.data.lineWidth;
        if (isTouchArea) {
            return <Path d={pathData} stroke={this.props.touchAreaBackgroundColor} strokeWidth={this.props.data.lineWidth * 20} fill="none" onPress={() => this.objectOnPress()} />;
        } else {
            return <Path d={pathData} stroke={color} strokeDasharray={this.strokeDasharray} strokeWidth={width} fill="none" />;
        }
    }
    render() {
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        if (this.props.data && this.props.data.points && this.props.data.points.length === 4) {
            x1 = this.props.data.points[0] * this.scaleFactor - this.minXPoint.x;
            y1 = this.props.data.points[1] * this.scaleFactor - this.minYPoint.y;
            x2 = this.props.data.points[2] * this.scaleFactor - this.minXPoint.x;
            y2 = this.props.data.points[3] * this.scaleFactor - this.minYPoint.y;
        }
        let result = [];
        // draw arrow
        result.push(...this.drawArrows(this.minXPoint.x, this.minYPoint.y));
        // draw line
        switch (this.props.data.type) {
            case "sinus": result.push(this.drawSinusLine(x1, y1, x2, y2)); result.push(this.drawSinusLine(x1, y1, x2, y2, true)); break;
            case "double": result.push(this.drawDoubleLine(x1, y1, x2, y2)); result.push(this.drawDoubleLine(x1, y1, x2, y2, true)); break;
            default: result.push(this.drawSimpleLine(x1, y1, x2, y2)); result.push(this.drawSimpleLine(x1, y1, x2, y2, true)); break;
        }
        return this.lineContainer(result);
    }
}
export default StraightLine;