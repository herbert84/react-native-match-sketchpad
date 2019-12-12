import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Dimensions, StatusBar, Image as RNImage, FlatList } from "react-native";
import PropTypes from 'prop-types';
import * as _ from "lodash";
import Modal from "react-native-modal";
import Orientation from "react-native-orientation";
import Sketchpad from "./Sketchpad";
import Utils from "./Utils";
import ToolBar from "../tool/ToolBar";
import Global from "./Global";
import DataModal from "./DataModel";
import History from "./History";
import TextEditArea from "../component/TextEditArea";

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
        this.history = new History();
        this.history.setInitialData(JSON.parse(JSON.stringify(this.dataModel.items)));
        this.state = {
            items: JSON.parse(JSON.stringify(this.dataModel.items)),
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
            itemSelectedId: null,
            hasHistoryOperation: false,
            isEditingText: false  //标识当前是不是在编辑文字
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
    /**
     * 根据id查找item
     *
     * @memberof Container
     */
    _getItemById(id) {
        let { items } = this.state;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                return items[i];
            }
        }
    }
    needToListenerObjectEvent(object) {
        //let objectSelected = JSON.parse(object);
        //console.log(objectSelected);
        if (object.shape === "SketchpadText" && object.eventType === "DOUBLE_CLICK" && object.selectedId) {
            this.currentSketchpadTextItem = this._getItemById(object.selectedId);
            this.setState({
                isEditingText: true
            });
        } else {
            this.setState({
                itemSelectedId: object.selectedId,
                itemSelected: object.selectedId ? true : false,
                selectedObjectShape: object.selectedId ? object.shape : null
            });
        }
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
        }, () => {
            if (object.status === "done") {
                this.continueDraw({ shape: object.shape, type: object.type ? object.type : null });
            }
        })
    }
    switchSizeMode() {
        this.setState({
            isFull: !this.state.isFull,
            isEdit: (this.props.isEditable && !this.state.isFull) ? true : false,
            statusBarHidden: (!this.state.isFull && this.needRotate) ? true : false,
            isPortrait: this.needRotate ? false : true,
            statusBarStyle: this.state.isFull ? "dark-content" : "light-content"
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
                (Platform.OS === "android") ? Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight()
            }
        } else {
            if (this.state.action === "drawing")
                this.finalizeDrawing(true);
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
                <View style={{ flex: 1, flexDirection: "row", height: ScreenWidth, paddingLeft: Utils.isIPhoneXPaddTop(true) }}>
                    <StatusBar translucent hidden={this.state.statusBarHidden} barStyle={this.state.statusBarStyle} />
                    <Sketchpad
                        isPortrait={this.state.isPortrait}
                        width={fullScreenBgWidth}
                        height={sketchpadHeight}
                        itemSelectedId={this.state.itemSelectedId}
                        bg={this.dataModel.background}
                        items={this.state.items}
                        isEdit={this.state.isEdit}
                        attachObjectEvent={(object) => this.needToListenerObjectEvent(object)}
                        attachAddPathEvent={(object) => this.needToListenerAddPathEvent(object)}
                        onTextItemLayout={this.onTextItemLayout.bind(this)} />
                    {this.renderTool()}
                    {this.renderTextEditView()}
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, flexDirection: "column", paddingTop: Utils.isIPhoneXPaddTop() }}>
                    <StatusBar translucent hidden={this.state.statusBarHidden} barStyle={this.state.statusBarStyle} />
                    <Sketchpad
                        isPortrait={this.state.isPortrait}
                        width={fullScreenBgWidth}
                        height={sketchpadHeight}
                        itemSelectedId={this.state.itemSelectedId}
                        bg={this.dataModel.background}
                        items={this.state.items}
                        isEdit={this.state.isEdit}
                        attachObjectEvent={(object) => this.needToListenerObjectEvent(object)}
                        attachAddPathEvent={(object) => this.needToListenerAddPathEvent(object)}
                        onTextItemLayout={this.onTextItemLayout.bind(this)} />
                    {this.renderTool()}
                    {this.renderTextEditView()}
                </View>
            )
        }
    }
    continueDraw(item) {
        let items = this.state.items;
        let that = this;
        let newItems = [];
        for (var i in items) {
            let shape = Utils.getItemType(items[i]);
            if (items[i].status === "drawing" && shape !== "SketchpadShape") {
                items[i].status = "done";
            }
            if (items[i].status !== "new" && items[i].status !== "drawing")
                newItems.push(items[i])
        }
        that.history.addOperationData(JSON.parse(JSON.stringify(newItems)), "add");
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let newItem = DataModal.addObject(item);
        let drawLayerItem = DataModal.addDrawLayerData(newItem, width, height);
        newItems.push(newItem);
        newItems.push(drawLayerItem);
        this.setState({
            items: newItems,
            action: "drawing",
            hasHistoryOperation: true,
            itemSelected: null,
            selectedObjectShape: null
        });
    }
    startDrawMode(item) {
        // 点击创建物件时，取消选择当前画布所有物体
        //DeviceEventEmitter.emit("sketchobject_" + this.instanceId, JSON.stringify({ selectedId: null }))
        let newItems = this.state.items;
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let newItem = DataModal.addObject(item);
        if (newItem.shape === "SketchpadText") {
            // 编辑文字
            this.setState({
                isEditingText: true
            });
            // 设置文本位置,新建的文本应位于画布中央
            newItem.y = this.state.isPortrait ? 1960 / 2 : 1251 / 2;
            this.currentSketchpadTextItem = newItem;
        } else {
            let drawLayerItem = DataModal.addDrawLayerData(newItem, width, height);
            newItems.push(newItem);
            newItems.push(drawLayerItem);
            this.setState({
                itemSelected: null,
                items: newItems,
                selectedObjectShape: null,
                action: "drawing"
            });
        }
    }
    finalizeDrawing(needUpdateHistory) {
        let items = this.state.items;
        let that = this;
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
            action: "read",
            hasHistoryOperation: true
        }, () => {
            if (needUpdateHistory)
                that.history.addOperationData(JSON.parse(JSON.stringify(newItems)), "add");
        });
    }
    /**
     *
     * @description 清空所有操作历史
     * @memberof Container
     */
    removeHistory() {
        this.history.backToInitialData();
        let newItems = this.history.getAll();
        this.setState({
            items: JSON.parse(JSON.stringify(newItems[0].data)),
            action: "read",
            hasHistoryOperation: false
        });
    }
    undoLastOperation() {
        this.history.undoLastOperation();
        let newItems = this.history.getAll();
        let hasHistoryOperation = newItems.length - 1 > 0 ? true : false;
        this.setState({
            items: JSON.parse(JSON.stringify(newItems[newItems.length - 1].data)),
            action: "read",
            hasHistoryOperation
        });
    }
    onPressToolBtn(newItems, type) {
        let that = this;
        this.setState({
            items: newItems,
            hasHistoryOperation: true
        }, () => {
            let targetObject = {
                selectedId: type === "delete" ? null : this.state.itemSelectedId,
                shape: type === "delete" ? null : this.state.selectedObjectShape,
                itemSelected: type === "delete" ? false : true
            }
            this.needToListenerObjectEvent(targetObject);
            that.history.addOperationData(JSON.parse(JSON.stringify(newItems)), type);
        });
    }
    /**
     * 文字编辑确认的响应函数
     *
     * @memberof Container
     */
    onConfirmTextEditing(newText) {
        if (this.currentSketchpadTextItem) {
            this.currentSketchpadTextItem.text = newText;
            let newItems = this.state.items;
            // 如果是新建的文本，则添加到item里面
            if (this.currentSketchpadTextItem.status === "drawing") {
                newItems.push(this.currentSketchpadTextItem);
            }
            this.setState({
                itemSelected: null,
                items: newItems,
                selectedObjectShape: null,
                isEditingText: false
            });
        }
    }
    /**
     * 文本渲染完成后的回调函数
     * 对于新建的文本，需要重新计算位置以确保它是在画布中央
     *
     * @param {*} item
     * @param {*} layout
     * @memberof Container
     */
    onTextItemLayout(item, layout) {
        // 判断是否为新添加的文本
        if (item.status === "drawing") {
            let sketchWidth = this.state.isPortrait ? 1251 : 1960;
            item.x = Math.max(0, (sketchWidth - layout.width) / 2);
            this.setState({
                items: this.state.items
            });
        }
    }
    renderTool() {
        let that = this;
        let elementIndex = _.findIndex(this.state.items, function (item) { return item.id === that.state.itemSelectedId; });
        let itemIsTop = (elementIndex === this.state.items.length - 1) ? true : false;
        let itemIsBottom = elementIndex === 0 ? true : false;
        return (
            <View style={{ flexDirection: "row" }}>
                <ToolBar
                    isPortrait={this.state.isPortrait} //当前是否是横竖屏
                    items={this.state.items} //当前画布的元素
                    itemSelectedId={this.state.itemSelectedId} //当前选中的物体id
                    itemSelected={this.state.itemSelected} //当前是否有物体被选中
                    itemIsTop={itemIsTop} // 选中物体是否是堆栈最上层
                    itemIsBottom={itemIsBottom} //选中物体是否是堆栈最底层
                    selectedObjectShape={this.state.selectedObjectShape} //被选中物体的类型
                    isEdit={this.state.isEdit} //当前是否在编辑状态
                    action={this.state.action} //当前画布的状态
                    history={this.history} //当前操作历史
                    hasHistory={this.state.hasHistoryOperation} //当前是否有操作历史
                    removeHistory={() => this.removeHistory()} //移除所有操作历史
                    undoLastOperation={() => this.undoLastOperation()} //返回上一次操作
                    startDrawMode={(item) => this.startDrawMode(item)} //开始画图
                    onPressTool={(newItems, type) => this.onPressToolBtn(newItems, type)} //选中物体后点击操作按钮的回调函数
                    onPressSwitchSize={() => this.switchSizeMode()} //切换屏幕全屏至缩略图
                    onPressConfirmDrawing={(needUpdateHistory) => this.finalizeDrawing(needUpdateHistory)} //结束当前类型画图
                />
            </View>
        )
    }
    /**
     * 渲染文本编辑框
     *
     * @returns
     * @memberof Container
     */
    renderTextEditView() {
        if (this.state.isEditingText) {
            return (
                <TextEditArea
                    data={this.currentSketchpadTextItem}
                    isPortrait={this.state.isPortrait}
                    onCancel={() => { this.setState({ isEditingText: false }) }}
                    onConfirm={this.onConfirmTextEditing.bind(this)} />
            );
        } else {
            return null;
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
            <TouchableOpacity onPress={() => this.switchSizeMode()}>
                <Sketchpad isPortrait={this.state.isPortrait} width="100%" height="100%" bg={this.dataModel.background} items={this.state.items} isEdit={this.state.isEdit} />
            </TouchableOpacity>
            <Modal isVisible={this.state.isFull} supportedOrientations={['portrait', 'landscape']} style={{ backgroundColor: "#000", margin: 0 }} animationIn="fadeIn" animationOut="fadeOut">
                {this.renderCanvasContent(fullScreenBgWidth, sketchpadHeight)}
            </Modal>
        </View >)
    }
}
export default Container;
