import React, { Component } from 'react';
import { PanResponder, Image as RNImage } from "react-native";
import SketchObject from "../core/Object";
import { G, Path, Rect } from 'react-native-svg';
import * as _ from "lodash";
import Utils from "./Utils";

/**
 *
 * @description 在画布上绘制图形的绘制层，所有在画布上的添加动作都在这个蒙层上进行。当结束绘制后该蒙层将被删除
 * @class DrawLayer
 * @extends {SketchObject}
 */
class DrawLayer extends SketchObject {
    constructor(props) {
        super(props);
        this.initShape(this.props.data.shape);
    }
    componentWillMount = () => {
        this._panDrawResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._alwaysTrue,
            onMoveShouldSetPanResponder: this._alwaysTrue,
            onPanResponderGrant: this._handlePanDrawResponderGrant,
            onPanResponderMove: this._handlePanDrawResponderMove,
            onPanResponderRelease: this._handlePanDrawResponderEnd,
            onPanResponderTerminate: this._handlePanDrawResponderEnd
        });
    };

    _handlePanDrawResponderGrant = () => {
        console.log("grant");
    };
    _handlePanDrawResponderMove = (e, gestureState) => {
        let originX = (gestureState.dx >= 0) ? e.nativeEvent.locationX - gestureState.dx : e.nativeEvent.locationX;
        let originY = (gestureState.dy >= 0) ? e.nativeEvent.locationY - gestureState.dy : e.nativeEvent.locationY;
        let targetX = (gestureState.dx >= 0) ? e.nativeEvent.locationX : e.nativeEvent.locationX - gestureState.dx;
        let targetY = (gestureState.dy >= 0) ? e.nativeEvent.locationY : e.nativeEvent.locationY - gestureState.dy;
        if (this.props.data.shape === "SketchpadRectangle" || this.props.data.shape === "SketchpadEllipse") {
            let path = {
                shape: this.props.data.shape,
                type: this.props.data.type,
                x: originX / this.scaleFactor,
                y: originY / this.scaleFactor,
                width: Math.abs(targetX - originX) / this.scaleFactor,
                height: Math.abs(targetY - originY) / this.scaleFactor
            }
            this.props.attachAddPathEvent(path);
        } else if (this.props.data.shape === "SketchpadStraightLine") {
            let path = {
                type: this.props.data.type,
                startX: originX / this.scaleFactor,
                startY: originY / this.scaleFactor,
                endX: targetX / this.scaleFactor,
                endY: targetY / this.scaleFactor,
                shape: this.props.data.shape
            }
            this.props.attachAddPathEvent(path);
        }
    };
    _handlePanDrawResponderEnd = (e, gestureState) => {
        let originX = (gestureState.dx >= 0) ? e.nativeEvent.locationX - gestureState.dx : e.nativeEvent.locationX;
        let originY = (gestureState.dy >= 0) ? e.nativeEvent.locationY - gestureState.dy : e.nativeEvent.locationY;
        let targetX = (gestureState.dx >= 0) ? e.nativeEvent.locationX : e.nativeEvent.locationX - gestureState.dx;
        let targetY = (gestureState.dy >= 0) ? e.nativeEvent.locationY : e.nativeEvent.locationY - gestureState.dy;
        let shape = this.props.data.shape;
        if (shape === "SketchpadPolygon") {
            let path = {
                shape: this.props.data.shape,
                type: this.props.data.type,
                x: e.nativeEvent.locationX / this.scaleFactor,
                y: e.nativeEvent.locationY / this.scaleFactor
            }
            this.props.attachAddPathEvent(path);
        } else if (shape === "SketchpadShape") {
            const bgImage = RNImage.resolveAssetSource(Utils.loadImage(this.props.data.data.image));
            let rectWidth = bgImage.width * this.props.data.data.scale;
            let rectHeight = bgImage.height * this.props.data.data.scale;
            let path = {
                type: this.props.data.type,
                x: (e.nativeEvent.locationX / this.scaleFactor) - rectWidth / 2,
                y: (e.nativeEvent.locationY / this.scaleFactor) - rectHeight / 2,
                shape: this.props.data.shape,
                status: "done"
            }
            return this.props.attachAddPathEvent(path);
        } else if (shape === "SketchpadRectangle" || shape === "SketchpadEllipse") {
            let path = {
                shape: this.props.data.shape,
                type: this.props.data.type,
                x: originX / this.scaleFactor,
                y: originY / this.scaleFactor,
                width: Math.abs(targetX - originX) / this.scaleFactor,
                height: Math.abs(targetY - originY) / this.scaleFactor,
                status: "done"
            }
            this.props.attachAddPathEvent(path);
        } else if (shape === "SketchpadStraightLine") {
            let path = {
                shape: this.props.data.shape,
                type: this.props.data.type,
                startX: originX / this.scaleFactor,
                startY: originY / this.scaleFactor,
                endX: targetX / this.scaleFactor,
                endY: targetY / this.scaleFactor,
                status: "done"
            }
            this.props.attachAddPathEvent(path);
        } else if (shape === "SketchpadCurvedLine") {
            let path = {
                shape: this.props.data.shape,
                type: this.props.data.type,
                x: e.nativeEvent.locationX / this.scaleFactor,
                y: e.nativeEvent.locationY / this.scaleFactor
            }
            this.props.attachAddPathEvent(path);
        }
    }
    render() {
        //let result = [];
        //result.push(this.renderPolygon());
        //return result;
        let rectSize = this.getRectSize();
        return (<G
            ref={ele => { this.root = ele; }}
            x={0}
            y={0}
            {...this._panDrawResponder.panHandlers}
        >
            <Rect
                x="0"
                y="0"
                width={rectSize.width}
                height={rectSize.height}
                fill="transparent"
                fillOpacity="0.1"
                stroke="transparent"
                strokeWidth="1"
                strokeOpacity="0.1"
            />
        </G>)
    }
}
export default DrawLayer;
