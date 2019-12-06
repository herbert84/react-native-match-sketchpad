import React, { Component } from 'react';
import { PanResponder, DeviceEventEmitter } from "react-native";
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import { Svg, G, Path, Rect } from 'react-native-svg';
import * as _ from "lodash";

class Polygon extends SketchObject {
    /**
     * 按照points数组里面的点的顺序绘制多边形
     *
     * @returns
     * @memberof Polygon
     */
    renderPolygon() {
        let pathData = "";
        let { points } = this.props.data;
        if (!points || points.length < 4) {
            return null;
        }
        //当前坐标需就算在组块中的相对坐标，而不是后台给的实际坐标。
        let firstPointX = points[0] * this.scaleFactor - this.minXPoint.x;
        let firstPointY = points[1] * this.scaleFactor - this.minYPoint.y;
        pathData += `M${firstPointX} ${firstPointY} `;
        for (let item = 2; item < points.length - 1; item += 2) {
            pathData += `L${points[item] * this.scaleFactor - this.minXPoint.x} ${points[item + 1] * this.scaleFactor - this.minYPoint.y} `;
        }
        return <Path d={pathData}
            stroke={this.props.data.color}
            strokeDasharray={this.strokeDasharray}
            strokeWidth={this.props.data.lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={this.props.data.backgroundColor}
            onPress={() => this.objectOnPress()}
        />;
    }
    render() {
        //let result = [];
        //result.push(this.renderPolygon());
        //return result;
        if (this.props.data.points.length >= 4) {
            let rectSize = this.getRectSize();
            return this.objectContainer(this.renderPolygon(), rectSize);
        } else { return null }
    }
}
export default Polygon;
