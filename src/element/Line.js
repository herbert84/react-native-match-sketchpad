import React, { Component } from 'react';
import { View, Text } from "react-native";
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import {
    Path,
    G
} from 'react-native-svg';

class Line extends SketchObject {
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
        // 初始化虚线样式
        if (props.data.style && props.data.style.length === 1) {
            this.strokeDasharray = [props.data.style[0], props.data.style[0]];
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedId === this.props.data.id) {
            console.log("found and selected")
            this.setState({
                isSelected: true
            })
            this.addDraggableResponder()
        } else {
            this.setState({
                isSelected: false
            })
        }
    }
    /**
     * 根据起点和终点的坐标值计算一条线的直线长度
     *
     * @param {*} x2 终点的x坐标
     * @param {*} y2 终点的y坐标
     * @param {*} x1 起点的x坐标
     * @param {*} y1 起点的y坐标
     * @returns
     * @memberof Line
     */
    lineLength(x2, y2, x1, y1) {
        return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }
    drawDash() {
        if (this.props.data.style && this.props.data.style.length === 1) {
            this.strokeDasharray = [this.props.data.style[0], this.props.data.style[0]];
        } else {
            this.strokeDasharray = []
        }
    }
    /**
     * 使用Path组件绘制箭头
     *
     * @param {*} fromX 箭头所指方向矢量的起点x坐标
     * @param {*} fromY 箭头所指方向矢量的起点y坐标
     * @param {*} toX 箭头所指方向矢量的终点x坐标
     * @param {*} toY 箭头所指方向矢量的终点y坐标
     * @returns
     * @memberof Line
     */
    drawArrow(fromX, fromY, toX, toY) {
        let pathData = "";
        let headlen = this.props.data.arrowLength;
        let angle = Math.atan2(toY - fromY, toX - fromX);
        toX = (toX + headlen / 1.5 * Math.cos(angle));
        toY = (toY + headlen / 1.5 * Math.sin(angle));
        let arrowAngle = Math.PI / 4.5;
        pathData += `M${toX} ${toY} `;
        pathData += `L${toX - headlen * Math.cos(angle - arrowAngle)} ${toY - headlen * Math.sin(angle - arrowAngle)} `;
        pathData += `M${toX} ${toY} `;
        pathData += `L${toX - headlen * Math.cos(angle + arrowAngle)} ${toY - headlen * Math.sin(angle + arrowAngle)} `;
        //let width = this.state.isSelected ? this.props.data.lineWidth * 2 : this.props.data.lineWidth;
        //let color = this.state.isSelected ? "red" : this.props.data.color
        return <Path d={pathData}
            stroke={this.props.data.color}
            strokeDasharray={this.strokeDasharray}
            strokeWidth={this.props.data.lineWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />;
    }
    /**
     * 根据传入的prop data绘制箭头
     *
     * @returns
     * @memberof Line
     */
    drawArrows(minX, minY) {
        let result = [];
        let { points } = this.props.data;
        if (points && points.length >= 4) {
            let l = points.length;
            if (this.props.data.startArrow) {
                result.push(this.drawArrow(
                    points[l - 4] * this.scaleFactor - minX,
                    points[l - 3] * this.scaleFactor - minY,
                    points[l - 2] * this.scaleFactor - minX,
                    points[l - 1] * this.scaleFactor - minY));
            }
            if (this.props.data.endArrow) {
                result.push(this.drawArrow(
                    points[2] * this.scaleFactor - minX,
                    points[3] * this.scaleFactor - minY,
                    points[0] * this.scaleFactor - minX,
                    points[1] * this.scaleFactor - minY));
            }
        }
        return result;
    }
    /**
     * 该函数用于计算绘制曲线所需要的点的集合
     *
     * @param {*} tension
     * @param {*} numOfSeg
     * @param {*} close
     * @returns
     * @memberof Line
     */
    _getInterpolatedPoints(tension, numOfSeg, close) {
        let aPoints = this.props.data.points;
        if (aPoints.length === 0) {
            return [];
        }
        // options or defaults
        tension = (typeof tension === "number") ? tension : 0.5;
        numOfSeg = numOfSeg ? numOfSeg : 25;
        let pts, // for cloning point array
            i = 1,
            l = aPoints.length,
            rPos = 0,
            rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
            res = new Float32Array(rLen),
            cache = new Float32Array((numOfSeg + 2) * 4),
            cachePtr = 4;
        pts = aPoints.slice(0);
        if (close) {
            pts.unshift(aPoints[l - 1]); // insert end point as first point
            pts.unshift(aPoints[l - 2]);
            pts.push(aPoints[0], aPoints[1]); // first point as last point
        } else {
            pts.unshift(aPoints[1]); // copy 1. point and insert at beginning
            pts.unshift(aPoints[0]);
            pts.push(aPoints[l - 2], aPoints[l - 1]); // duplicate end-aPoints
        }
        // cache inner-loop calculations as they are based on t alone
        cache[0] = 1; // 1,0,0,0
        for (; i < numOfSeg; i++) {
            let st = i / numOfSeg, st2 = st * st, st3 = st2 * st, st23 = st3 * 2, st32 = st2 * 3;
            cache[cachePtr++] = st23 - st32 + 1; // c1
            cache[cachePtr++] = st32 - st23; // c2
            cache[cachePtr++] = st3 - 2 * st2 + st; // c3
            cache[cachePtr++] = st3 - st2; // c4
        }
        cache[++cachePtr] = 1; // 0,1,0,0
        // calc. aPoints
        parse(pts, cache, l);
        if (close) {
            // l = aPoints.length;
            pts = [];
            pts.push(aPoints[l - 4], aPoints[l - 3], aPoints[l - 2], aPoints[l - 1]); // second last and last
            pts.push(aPoints[0], aPoints[1], aPoints[2], aPoints[3]); // first and second
            parse(pts, cache, 4);
        }
        function parse(pts, cache, l) {
            for (let i = 2, t; i < l; i += 2) {
                let pt1 = pts[i], pt2 = pts[i + 1], pt3 = pts[i + 2], pt4 = pts[i + 3],
                    t1x = (pt3 - pts[i - 2]) * tension, t1y = (pt4 - pts[i - 1]) * tension, t2x = (pts[i + 4] - pt1) * tension, t2y = (pts[i + 5] - pt2) * tension;
                for (t = 0; t < numOfSeg; t++) {
                    let c = t << 2, // t * 4;
                        c1 = cache[c], c2 = cache[c + 1], c3 = cache[c + 2], c4 = cache[c + 3];
                    res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                    res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
                }
            }
        }
        // add last point
        l = close ? 0 : aPoints.length - 2;
        res[rPos++] = aPoints[l];
        res[rPos] = aPoints[l + 1];
        return res;
    }
    lineContainer(item) {
        if (this.isEdit) {
            return (
                <G
                    ref={ele => { this.root = ele; }}
                    x={this.state.x}
                    y={this.state.y}
                    {...this._panResponder.panHandlers}
                >
                    {item}
                </G>
            )
        } else {
            return (<G
                ref={ele => { this.root = ele; }}
                x={this.state.x}
                y={this.state.y}
            >
                {item}
            </G>)
        }
    }
}
export default Line;
