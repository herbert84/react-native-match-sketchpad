import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Dimensions, StatusBar, Image as RNImage, FlatList } from "react-native";
import PropTypes from 'prop-types';
import Modal from "react-native-modal";
import Orientation from "react-native-orientation";
import Sketchpad from "./Sketchpad";
import Utils from "./Utils";
import ToolBar from "../tool/ToolBar";
import Global from "./Global";
//import ToolElementItems from "../data/ToolElement";
import DataModal from "./DataModel";

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
            statusBarHidden: true,
            statusBarStyle: "dark-content",
            action: "read", //当前画板出于的行为，诸如read, drawing, edit等等,
            itemSelected: false,
            selectedObjectShape: null,
            isPortrait: true,
            itemSelectedId: null
        }
        this.needRotate = true
    }
    componentDidMount() {
        // 设置屏幕模式
        this.setScreenOrientation();
        // 设置tool显示
        this.setState({
            isEdit: (this.props.isEditable && this.props.fullMode) ? true : false
        });
    }
    needToListenerObjectEvent(object) {
        //let objectSelected = JSON.parse(object);
        //console.log(objectSelected);
        this.setState({
            itemSelectedId: object.selectedId,
            itemSelected: object.selectedId ? true : false,
            selectedObjectShape: object.selectedId ? object.shape : null
        });
    }
    needToListenerAddPathEvent(object) {
        // 收到监听后想做的事情 // 监听
        //let objectSelected = JSON.parse(object);
        //console.log(objectSelected);
        let items = this.state.items;
        let newItems = [];
        for (var i in items) {
            if (items[i].status === "drawing") {
                if (object.shape === "SketchpadPolygon" || object.shape === "SketchpadCurvedLine") {
                    items[i].points.push(object.x)
                    items[i].points.push(object.y)
                } else if (object.shape === "SketchpadRectangle" || object.shape === "SketchpadEllipse") {
                    items[i].x = object.x;
                    items[i].y = object.y;
                    items[i].width = object.width;
                    items[i].height = object.height;
                    if (object.status === "done")
                        items[i].status = "done";
                } else if (object.shape === "SketchpadStraightLine") {
                    items[i].points = [
                        object.startX,
                        object.startY,
                        object.endX,
                        object.endY
                    ];
                    if (object.status === "done")
                        items[i].status = "done";
                } else if (object.shape === "SketchpadShape") {
                    items[i].x = object.x;
                    items[i].y = object.y;
                    if (object.status === "done")
                        items[i].status = "done";
                }
            }
            if (object.status === "done") {
                if (items[i].status !== "new")
                    newItems.push(items[i])
            } else {
                newItems.push(items[i])
            }
        }
        this.setState({
            items: newItems
        })
        if (object.status === "done") {
            this.startDrawMode({ shape: object.shape, type: object.type ? object.type : null });
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
                    statusBarHidden: true,
                    isPortrait: false
                });
                (Platform.OS === "android") ? Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight()
            } else {
                this.setState({
                    statusBarStyle: "light-content"
                })
            }
        } else {
            this.setState({
                statusBarHidden: false,
                statusBarStyle: "dark-content",
                isPortrait: true
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
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <StatusBar translucent hidden={this.state.statusBarHidden} barStyle={this.state.statusBarStyle} />
                    <View style={{ height: ScreenWidth, width: Utils.isIPhoneXPaddTop(true) }} />
                    <Sketchpad width={fullScreenBgWidth} height={sketchpadHeight} itemSelectedId={this.state.itemSelectedId} bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} attachObjectEvent={(object) => this.needToListenerObjectEvent(object)} attachAddPathEvent={(object) => this.needToListenerAddPathEvent(object)} />
                    {this.renderTool()}
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, flexDirection: "column", paddingTop: Utils.isIPhoneXPaddTop() }}>
                    <StatusBar translucent hidden={this.state.statusBarHidden} barStyle={this.state.statusBarStyle} />
                    <Sketchpad width={fullScreenBgWidth} height={sketchpadHeight} itemSelectedId={this.state.itemSelectedId} bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} attachObjectEvent={(object) => this.needToListenerObjectEvent(object)} attachAddPathEvent={(object) => this.needToListenerAddPathEvent(object)} />
                    {this.renderTool()}
                </View>
            )
        }
    }
    startDrawMode(item) {
        // 点击创建物件时，取消选择当前画布所有物体
        //DeviceEventEmitter.emit("sketchobject_" + this.instanceId, JSON.stringify({ selectedId: null }))
        let newItems = this.state.items;
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let newItem = DataModal.addObject(item);
        let drawLayerItem = DataModal.addDrawLayerData(newItem, width, height);
        newItems.push(newItem);
        newItems.push(drawLayerItem);

        this.setState({
            itemSelected: null,
            items: newItems,
            selectedObjectShape: null,
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
    renderTool() {
        return (
            <View style={{ flexDirection: "row" }}>
                <ToolBar
                    isPortrait={this.state.isPortrait}
                    isEdit={this.state.isEdit}
                    action={this.state.action}
                    itemSelected={this.state.itemSelected}
                    selectedObjectShape={this.state.selectedObjectShape}
                    startDrawMode={(item) => this.startDrawMode(item)}
                    onPressSwitchSize={() => this.switchSizeMode()}
                    onPressConfirmDrawing={() => this.finalizeDrawing()} />
            </View>
        )
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
