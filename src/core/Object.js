import React, { Component } from 'react';
import { PanResponder, DeviceEventEmitter } from "react-native";
import PropTypes from 'prop-types';
import { Svg, Image, G, Rect } from 'react-native-svg';
import * as _ from "lodash";
import Utils from "./Utils";
import Global from "./Global";

class SketchObject extends Component {
    static propTypes = {
        data: PropTypes.object
    };

    static defaultProps = {
        data: {}
    };
    _previousX = 0;
    _previousY = 0;
    _alwaysTrue = () => true;
    constructor(props) {
        super(props);
        this._panResponder = {};
        this.initShape(false)
    }
    componentDidMount() {
        console.log("this.isEdit:" + this.isEdit)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedId === this.props.data.id) {
            console.log("found and selected")
            this.initShape(true)
        } else {
            this.initShape(false)
        }
    }
    initShape(isSelected) {
        let shape = Utils.getItemType(this.props.data);
        switch (shape) {
            case "SketchpadPolygon":
                let { points } = this.props.data;
                if (points.length >= 4) {
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
                        isSelected
                    }
                }
                break;
            case "SketchpadEllipse":
            case "SketchpadShape":
            case "SketchpadRectangle":
                this.state = {
                    x: this.props.data.x * this.scaleFactor,
                    y: this.props.data.y * this.scaleFactor,
                    rotation: this.props.data.rotation,
                    isSelected
                }
                break;
            default: break;
        }
    }
    componentWillMount = () => {
        this.addDraggableResponder()
    };
    addDraggableResponder() {
        if (this.props.data.status !== "new" && this.props.data.status !== "drawing") {
            this._panResponder = PanResponder.create({
                onStartShouldSetPanResponder: this._alwaysTrue,
                onMoveShouldSetPanResponder: this._alwaysTrue,
                onPanResponderGrant: this._handlePanResponderGrant,
                onPanResponderMove: this._handlePanResponderMove,
                onPanResponderRelease: this._handlePanResponderEnd,
                onPanResponderTerminate: this._handlePanResponderEnd
            });
        }
    }
    componentWillUnmount() {
        if (this.objectListener) {
            this.objectListener.remove();
        }
    }
    _handlePanResponderMove = (e, gestureState) => {
        this.setState({
            x: this._previousX + gestureState.dx,
            y: this._previousY + gestureState.dy
        });
        //let shape = Utils.getItemType(this.props.data);
        //DeviceEventEmitter.emit("sketchobject_" + Global.instanceId, JSON.stringify({ selectedId: this.props.data.id, type: shape, item: this.props.data }))
    };

    _handlePanResponderGrant = () => {
        //console.log(this.props.data.x * this.scaleFactor)
        //console.log(this.props.data.y * this.scaleFactor)
        this._previousX = this.state.x;
        this._previousY = this.state.y;
        this.setState({
            currentX: this.state.x,
            currentY: this.state.y
        })
    };

    _handlePanResponderEnd = (e, gestureState) => {
        //console.log(this.state.x + ":" + this.state.y);
        //this._previousX += gestureState.dx;
        //this._previousY += gestureState.dy;
        /*this.setState({
            currentX: this.state.x,
            currentY: this.state.y
        })*/
        let shape = Utils.getItemType(this.props.data);
        if (shape === "SketchpadPolygon") {
            let deltaX = (this.state.x - this.minXPoint.x) / this.scaleFactor;
            let deltaY = (this.state.y - this.minXPoint.y) / this.scaleFactor;

            let objectData = this.props.data;
            let newPoints = [];
            let pointsArray = [];

            let points = objectData.points;
            for (var i = 0; i < points.length - 1; i += 2) {
                pointsArray.push({ x: points[i], y: points[i + 1] })
            }
            for (var i in pointsArray) {
                newPoints.push(pointsArray[i].x + deltaX);
                newPoints.push(pointsArray[i].y + deltaY);
            }
            this.props.data.points = newPoints;
        } else if (shape === "SketchpadShape" || shape === "SketchpadRectangle") {
            this.props.data.x = this.state.x / this.scaleFactor;
            this.props.data.y = this.state.y / this.scaleFactor;
        }
        this.props.attachObjectEvent({ selectedId: this.props.data.id, shape, item: this.props.data });
        //DeviceEventEmitter.emit("sketchobject_" + Global.instanceId, JSON.stringify({ selectedId: this.props.data.id, shape, item: this.props.data }))
    }
    getRectSize() {
        let { points } = this.props.data;
        if (!points || points.length === 0) {
            return { width: 0, height: 0 };
        }
        let pointsArray = [];
        for (var i = 0; i < points.length - 1; i += 2) {
            pointsArray.push({ x: points[i] * this.scaleFactor, y: points[i + 1] * this.scaleFactor })
        }
        this.maxXPoint = _.maxBy(pointsArray, 'x');
        this.maxYPoint = _.maxBy(pointsArray, 'y');
        this.minXPoint = _.minBy(pointsArray, 'x');
        this.minYPoint = _.minBy(pointsArray, 'y');

        return {
            x: this.minXPoint.x,
            y: this.minYPoint.y,
            width: this.maxXPoint.x - this.minXPoint.x,
            height: this.maxYPoint.y - this.minYPoint.y
        }
    }
    renderSelectedArea(rectWidth, rectHeight) {
        return this.state.isSelected ?
            (
                <Rect
                    x="0"
                    y="0"
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
    /**
     *
     * @description 点击物件后触发选中事件
     * @memberof SketchObject
     */
    objectOnPress() {
        let shape = Utils.getItemType(this.props.data);
        this.props.attachObjectEvent({ selectedId: this.props.data.id, shape });
        //DeviceEventEmitter.emit("sketchobject_" + Global.instanceId, JSON.stringify({ selectedId: this.props.data.id, shape }))
    }
    /**
     * @description 双击物件后的响应函数
     *
     * @memberof SketchObject
     */
    objectOnDoublePress() {
        let shape = Utils.getItemType(this.props.data);
        this.props.attachObjectEvent({ selectedId: this.props.data.id, shape, eventType: "DOUBLE_CLICK" });
    }
    objectContainer(item, rect) {
        if (this.isEdit) {
            if (this.props.data.status === "drawing") {
                return (
                    <G
                        ref={ele => { this.root = ele; }}
                        x={rect.x}
                        y={rect.y}
                        origin={rect.width / 2, rect.height / 2}
                        rotation={rect.rotation}
                    >
                        {this.renderSelectedArea(rect.width, rect.height)}
                        {item}
                    </G>
                )
            } else {
                return (
                    <G
                        ref={ele => { this.root = ele; }}
                        origin={rect.width / 2, rect.height / 2}
                        x={this.state.x}
                        y={this.state.y}
                        rotation={this.state.rotation}
                        {...this._panResponder.panHandlers}
                    >
                        {this.renderSelectedArea(rect.width, rect.height)}
                        {item}
                    </G>
                )
            }
        } else {
            return (<G
                ref={ele => { this.root = ele; }}
                x={this.state.x}
                y={this.state.y}
                origin={rect.width / 2, rect.height / 2}
                rotation={this.state.rotation}
            >
                {item}
            </G>)
        }
    }
}
export default SketchObject;
