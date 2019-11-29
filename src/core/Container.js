import React, { Component } from 'react';
import { View, TouchableOpacity, Button, Dimensions, StatusBar, Image as RNImage, DeviceEventEmitter } from "react-native";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import Orientation from "react-native-orientation";
import Sketchpad from "./Sketchpad";
import Utils from "./Utils";
import ToolBar from "../tool/ToolBar";
import Global from "./Global";

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;
class Container extends Component {
    static propTypes = {
        data: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.string,
        isEditable: PropTypes.bool, //当前画布是否允许编辑
        isEdit: PropTypes.bool //当前画布是否在编辑状态
    };

    static defaultProps = {
        data: '{"background": [{"image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND","scaleFactor": 1}],"items": []}',
        width: 400,
        height: parseInt(400 / 1960 * 1251),
        isEditable: false,
        isEdit: false
    };
    constructor(props) {
        super(props);
        this.dataModel = JSON.parse(this.props.data);
        Global.instanceId = Utils.randomStringId(10);
        this.instanceId = Global.instanceId;
        this.state = {
            items: this.dataModel.items,
            isFull: props.fullMode,
            isEdit: false,
            screenHeight: Dimensions.get("window").height,
            screenWidth: Dimensions.get("window").width,
            statusBarHidden: false,
            statusBarStyle: "dark-content",
            action: "read", //当前画板出于的行为，诸如read, drawing, edit等等,
            showToolBar: false
        }
        this.needRotate = true
    }
    componentDidMount() {
        let that = this;

        // 设置屏幕模式
        this.setScreenOrientation();

        this.objectListener = DeviceEventEmitter.addListener("sketchobject_" + that.instanceId, (object) => {
            // 收到监听后想做的事情 // 监听
            let objectSelected = JSON.parse(object);
            //console.log(objectSelected);
            this.setState({
                showToolBar: objectSelected.selectedId ? true : false,
                selectedObjectType: objectSelected.selectedId ? objectSelected.type : null
            });
        });

        //监听物体对象被点击的事件，如果当前物体id等于被点击的对象id，则当前被选中且添加矩形背景，如果不是则不被选中且无矩形背景
        this.addPathListener = DeviceEventEmitter.addListener("sketchAddPath_" + that.instanceId, (object) => {
            // 收到监听后想做的事情 // 监听
            let objectSelected = JSON.parse(object);
            //console.log(objectSelected);
            let items = that.state.items;
            let newItems = [];
            for (var i in items) {
                if (items[i].status === "drawing") {
                    if (objectSelected.type === "SketchpadPolygon") {
                        items[i].points.push(objectSelected.x)
                        items[i].points.push(objectSelected.y)
                    } else if (objectSelected.type === "SketchpadRectangle") {
                        items[i].x = objectSelected.x;
                        items[i].y = objectSelected.y;
                        items[i].width = objectSelected.width;
                        items[i].height = objectSelected.height;
                        if (objectSelected.status === "done")
                            items[i].status = "done";
                    } else if (objectSelected.type === "SketchpadShape") {
                        items[i].x = objectSelected.x;
                        items[i].y = objectSelected.y;
                        if (objectSelected.status === "done")
                            items[i].status = "done";
                    }
                }
                if (objectSelected.status === "done") {
                    if (items[i].status !== "new")
                        newItems.push(items[i])
                } else {
                    newItems.push(items[i])
                }
            }
            that.setState({
                items: newItems
            })
            if (objectSelected.status === "done") {
                that.startDrawMode(objectSelected.type);
            }
        });
    }
    componentWillUnmount() {
        if (this.addPathListener) {
            this.addPathListener.remove();
        }
        if (this.objectListener) {
            this.objectListener.remove();
        }
    }
    switchSizeMode() {
        this.setState({
            isFull: !this.state.isFull,
            isEdit: (this.props.isEditable && !this.state.isFull) ? true : false
        }, () => {
            this.setScreenOrientation();
        })
    }
    /**
     * 根据模式设置屏幕为横竖屏
     *
     * @memberof Container
     */
    setScreenOrientation() {
        if (this.state.isFull) {
            console.log(ScreenWidth + ":" + ScreenHeight)
            if (this.needRotate) {
                this.setState({
                    statusBarHidden: true
                })
                Orientation.lockToLandscapeRight();
            } else {
                this.setState({
                    statusBarStyle: "light-content"
                })
            }
        } else {
            this.setState({
                statusBarHidden: false,
                statusBarStyle: "dark-content"
            })
            this.finalizeDrawing();
            //console.log(ScreenWidth + ":" + ScreenHeight)
            Orientation.lockToPortrait();
        }
    }
    /**
     *
     * @description 渲染canvas画布内容，需要旋转时隐藏状态栏，不旋转时显示状态栏
     * @param {*} fullScreenBgWidth
     * @param {*} sketchpadHeight
     * @returns
     * @memberof Container
     */
    renderCanvasContent(fullScreenBgWidth, sketchpadHeight) {
        //alert(this.props.isEdit)
        if (this.needRotate) {
            return (
                <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
                    <View style={{ height: ScreenWidth, width: Utils.isIPhoneXPaddTop(true) }} />
                    <Sketchpad width={fullScreenBgWidth} height={sketchpadHeight} bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} />
                    {this.renderTool()}
                </View>
            )
        } else {
            return (
                <View style={{ width: "100%", height: "100%", flexDirection: "column", paddingTop: Utils.isIPhoneXPaddTop() }}>
                    <Sketchpad width={fullScreenBgWidth} height={sketchpadHeight} bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} />
                    {this.renderTool()}
                </View>
            )
        }
    }
    startDrawMode(shape) {
        // 点击创建物件时，取消选择当前画布所有物体
        DeviceEventEmitter.emit("sketchobject_" + this.instanceId, JSON.stringify({ selectedId: null }))
        let newItems = this.state.items;
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let newObject = {};
        if (shape === "SketchpadShape") {
            newObject = {
                className: "sap.sports.ui.controls.sketchpad.SketchpadShape",
                status: "drawing",
                id: "__shape0-" + Utils.randomStringId(9),
                showSelection: true,
                rotation: 0,
                scale: 1,
                mirror: false,
                visible: true,
                x: 0,
                y: 0,
                z: 0,
                image: "/sap/sports/trm/ui/catalog/images/red5.png"
            }
            newItems.push(newObject)
        } else if (shape === "SketchpadPolygon") {
            newObject = {
                className: "sap.sports.ui.controls.sketchpad.SketchpadPolygon",
                status: "drawing",
                id: "__polygon0-" + Utils.randomStringId(9),
                width: 1,
                style: [],
                visible: true,
                z: 0,
                color: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                points: []
            }
            newItems.push(newObject)
        } else if (shape === "SketchpadRectangle") {
            newObject = {
                className: "sap.sports.ui.controls.sketchpad.SketchpadRectangle",
                status: "drawing",
                id: "__rectangle0-" + Utils.randomStringId(9),
                lineWidth: 1,
                width: 0,
                height: 0,
                style: [],
                visible: true,
                x: 0,
                y: 0,
                z: 0,
                color: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.6)"
            }
            newItems.push(newObject)
        }
        newItems.push({
            className: "sap.sports.ui.controls.sketchpad.SketchpadNew",
            status: "new",
            type: shape,
            data: newObject,
            id: "__new-vb6ge30j",
            width: 1,
            style: [],
            visible: true,
            z: 0,
            color: "rgb(0, 0, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            points: [0, 0, width, 0, width, height, 0, height]
        })
        this.setState({
            items: newItems,
            action: "drawing"
        })
    }
    finalizeDrawing() {
        let items = this.state.items;
        let newItems = [];
        for (var i in items) {
            let shape = Utils.getItemType(items[i]);
            if (items[i].status === "drawing" && shape !== "SketchpadShape") {
                items[i].status = "done";
            }
            if (items[i].status !== "new" && items[i].status !== "drawing")
                newItems.push(items[i])
        }
        this.setState({
            items: newItems,
            action: "read"
        });
    }
    renderEditTool() {
        if (this.state.isEdit && this.state.action === "read") {
            return (<View style={{ flexDirection: "row" }}>
                <Button onPress={() => this.startDrawMode("SketchpadShape")} title="球员" />
                <Button onPress={() => this.startDrawMode("SketchpadPolygon")} title="多边形" />
                <Button onPress={() => this.startDrawMode("SketchpadRectangle")} title="矩形" />
                <Button onPress={() => this.switchSizeMode()} title="缩小" /></View>)
        }
        else if (this.state.action === "drawing") {
            return (<View style={{ flexDirection: "row" }}>
                <Button onPress={() => this.finalizeDrawing()} title="确定" />
                <Button onPress={() => this.switchSizeMode()} title="缩小" /></View>)
        } else {
            return (<Button onPress={() => this.switchSizeMode()} title="缩小" />)
        }
    }
    renderTool() {
        if (this.state.showToolBar) {
            return (
                <ToolBar selectedObjectType={this.state.selectedObjectType} />
            )
        } else {
            return (
                <View style={{ flexDirection: "row" }}>
                    {this.renderEditTool()}
                </View>
            )
        }
    }
    render() {
        const bgImage = RNImage.resolveAssetSource(Utils.loadImage(this.dataModel.background[0].image));
        //计算是否当前画布需要旋转，如果是背景图片宽度大于高度，则全屏时需要旋转，如果是宽度小于高度，则全屏时不旋转
        this.needRotate = Utils.canvasNeedRotate(bgImage.width, bgImage.height);
        //全屏模式时，需要旋转时背景图高度即为屏幕宽度，否则背景图片宽度就是屏幕宽度
        let fullScreenBgWidth = (this.needRotate) ? (1960 / 1251 * ScreenWidth).toString() : ScreenWidth.toString();

        let sketchpadHeight = (this.needRotate) ? ScreenWidth.toString() : (1960 / 1251 * ScreenWidth).toString();
        let canvasWidth = this.props.width || 400;
        let canvasHeight = (this.needRotate) ? canvasWidth * (1251 / 1960) : canvasWidth * (1960 / 1251);
        return (<View style={{ width: canvasWidth, height: canvasHeight }}>
            <StatusBar translucent hidden={this.state.statusBarHidden} barStyle={this.state.statusBarStyle} />
            <TouchableOpacity onPress={() => this.switchSizeMode()}>
                <Sketchpad width="100%" height="100%" bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} />
            </TouchableOpacity>
            <Modal isVisible={this.state.isFull} supportedOrientations={['portrait', 'landscape']} style={{ backgroundColor: "#000", margin: 0 }} animationIn="fadeIn" animationOut="fadeOut">
                {this.renderCanvasContent(fullScreenBgWidth, sketchpadHeight)}
            </Modal>
        </View >)
    }
}
export default Container;
