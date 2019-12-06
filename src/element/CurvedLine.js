import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from "lodash";
import Line from "./Line";
import {
    Svg,
    Image,
    Path
} from 'react-native-svg';

class CurvedLine extends Line {
    static propTypes = {
        touchAreaBackgroundColor: PropTypes.string,
        selectedLineColor: PropTypes.string
    };

    static defaultProps = {
        touchAreaBackgroundColor: "transparent",
        selectedLineColor: "red"
    };
    constructor(props) {
        super(props);
        let { points } = this.props.data;
        let pointsArray = [];
        for (var i = 0; i < points.length - 1; i += 2) {
            pointsArray.push({ x: points[i] * this.scaleFactor, y: points[i + 1] * this.scaleFactor })
        }
        this.maxXPoint = _.maxBy(pointsArray, 'x') || { x: 0, y: 0 };
        this.maxYPoint = _.maxBy(pointsArray, 'y') || { x: 0, y: 0 };
        this.minXPoint = _.minBy(pointsArray, 'x') || { x: 0, y: 0 };
        this.minYPoint = _.minBy(pointsArray, 'y') || { x: 0, y: 0 };

        this.state = {
            x: this.minXPoint.x ? this.minXPoint.x : 0,
            y: this.minYPoint.y ? this.minYPoint.y : 0,
            hover: false
        }
    }
    /**
     * 绘制曲线,调用父类的_getInterpolatedPoints方法获取曲线的点
     *
     * @returns
     * @memberof CurvedLine
     */
    drawCurvedLine(isTouchArea) {
        let pathData = "";
        let { points } = this.props.data;
        if (!points || points.length === 0) {
            return null;
        }
        pathData += `M${points[0] * this.scaleFactor - this.minXPoint.x} ${points[1] * this.scaleFactor - this.minYPoint.y} `;
        let res = this._getInterpolatedPoints();
        for (let i = 0, l = res.length; i < l; i += 2) {
            pathData += `L${res[i] * this.scaleFactor - this.minXPoint.x} ${res[i + 1] * this.scaleFactor - this.minYPoint.y} `;
        }
        let color = this.state.isSelected ? this.props.selectedLineColor : this.props.data.color;
        let width = this.state.isSelected ? this.props.data.lineWidth * 2 : this.props.data.lineWidth;
        if (isTouchArea) {
            return <Path d={pathData}
                stroke={this.props.touchAreaBackgroundColor}
                strokeWidth={this.props.data.lineWidth * 20}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                onPress={() => this.objectOnPress()}
            />;
        } else {
            return <Path d={pathData}
                stroke={color}
                strokeDasharray={this.strokeDasharray}
                strokeWidth={width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />;
        }
    }
    render() {
        let result = [];
        // draw arrow
        result.push(...this.drawArrows(this.minXPoint.x, this.minYPoint.y));
        // draw line
        result.push(this.drawCurvedLine());
        // draw touch area
        result.push(this.drawCurvedLine(true));
        //return result;
        return this.lineContainer(result);
    }
}
export default CurvedLine;
