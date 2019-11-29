import React, { Component } from 'react';
import { PanResponder, DeviceEventEmitter, Image as RNImage } from "react-native";
import PropTypes from 'prop-types';
import SketchObject from "../core/Object";
import { Svg, G, Path, Rect } from 'react-native-svg';
import * as _ from "lodash";
import Utils from "./Utils";
import Global from "./Global";

class DrawLayer extends SketchObject {
    constructor(props) {
        super(props);
        this.initShape(this.props.data.type);
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
        if (this.props.data.type === "SketchpadRectangle") {
            let originX = (gestureState.dx >= 0) ? e.nativeEvent.locationX - gestureState.dx : e.nativeEvent.locationX;
            let originY = (gestureState.dy >= 0) ? e.nativeEvent.locationY - gestureState.dy : e.nativeEvent.locationY;
            let targetX = (gestureState.dx >= 0) ? e.nativeEvent.locationX : e.nativeEvent.locationX - gestureState.dx;
            let targetY = (gestureState.dy >= 0) ? e.nativeEvent.locationY : e.nativeEvent.locationY - gestureState.dy;

            let path = {
                type: this.props.data.type,
                x: originX / this.scaleFactor,
                y: originY / this.scaleFactor,
                width: Math.abs(targetX - originX) / this.scaleFactor,
                height: Math.abs(targetY - originY) / this.scaleFactor
            }
            DeviceEventEmitter.emit("sketchAddPath_" + Global.instanceId, JSON.stringify(path))
        }
    };
    _handlePanDrawResponderEnd = (e, gestureState) => {
        if (this.props.data.type === "SketchpadPolygon") {
            let path = {
                type: this.props.data.type,
                x: e.nativeEvent.locationX / this.scaleFactor,
                y: e.nativeEvent.locationY / this.scaleFactor
            }
            DeviceEventEmitter.emit("sketchAddPath_" + Global.instanceId, JSON.stringify(path))
        } else if (this.props.data.type === "SketchpadShape") {
            const bgImage = RNImage.resolveAssetSource(Utils.loadImage(this.props.data.data.image));
            let rectWidth = bgImage.width * this.props.data.data.scale;
            let rectHeight = bgImage.height * this.props.data.data.scale;
            let path = {
                type: this.props.data.type,
                x: (e.nativeEvent.locationX / this.scaleFactor) - rectWidth / 2,
                y: (e.nativeEvent.locationY / this.scaleFactor) - rectHeight / 2,
                status: "done"
            }
            DeviceEventEmitter.emit("sketchAddPath_" + Global.instanceId, JSON.stringify(path))
        } else if (this.props.data.type === "SketchpadRectangle") {
            let originX = (gestureState.dx >= 0) ? e.nativeEvent.locationX - gestureState.dx : e.nativeEvent.locationX;
            let originY = (gestureState.dy >= 0) ? e.nativeEvent.locationY - gestureState.dy : e.nativeEvent.locationY;
            let targetX = (gestureState.dx >= 0) ? e.nativeEvent.locationX : e.nativeEvent.locationX - gestureState.dx;
            let targetY = (gestureState.dy >= 0) ? e.nativeEvent.locationY : e.nativeEvent.locationY - gestureState.dy;

            let path = {
                type: this.props.data.type,
                x: originX / this.scaleFactor,
                y: originY / this.scaleFactor,
                width: Math.abs(targetX - originX) / this.scaleFactor,
                height: Math.abs(targetY - originY) / this.scaleFactor,
                status: "done"
            }
            DeviceEventEmitter.emit("sketchAddPath_" + Global.instanceId, JSON.stringify(path))
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
