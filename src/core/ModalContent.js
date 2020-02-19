import React, { Component } from "react";
import {
    View,
    Dimensions
} from 'react-native';
import * as _ from "lodash";
import Orientation from "react-native-orientation";
import ToolBar from "../tool/ToolBar";
import DataModal from "./DataModel";
import Sketchpad from "./Sketchpad";
import Utils from "./Utils";
import TextEditArea from "../component/TextEditArea";
import Toast from "../component/Toast";
import RNMatchSketchpadTopView from "./TopView";
const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

export default class ModalContent extends Component {
    constructor(props) {
        super(props);
        this.textLayerKey = null;
        this.state = {
            items: props.items,
            action: "read", //当前画板出于的行为，诸如read, drawing, edit等等,
            itemSelected: false,
            selectedObjectShape: null,
            isPortrait: true,
            itemSelectedId: null,
            hasHistoryOperation: props.history.hasHistoryOperation()
        }
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
            this.textLayerKey = RNMatchSketchpadTopView.addContent(
                <View
                    style={{ width: this.props.needRotate ? ScreenHeight : ScreenWidth, height: this.props.needRotate ? ScreenWidth : ScreenHeight, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderTextEditView()}
                </View>);
            // this.setState({
            //     isEditingText: true
            // });
        } else {
            this.setState({
                itemSelectedId: object.selectedId,
                itemSelected: object.selectedId ? true : false,
                selectedObjectShape: object.selectedId ? object.shape : null
            });
            if (object.eventType === "MOVE") {
                this.props.history.addOperationData(JSON.parse(JSON.stringify(this.state.items)), "move");
            }
        }
    }
    needToListenerAddPathEvent(object) {
        // 收到监听后想做的事情 // 监听
        //let objectSelected = JSON.parse(object);
        //console.log(objectSelected);
        let items = JSON.parse(JSON.stringify(this.state.items));
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
                this.continueDraw(object);
            }
        })
    }
    continueDraw(item) {
        let items = JSON.parse(JSON.stringify(this.state.items));
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
        this.props.history.addOperationData(JSON.parse(JSON.stringify(newItems)), "add");
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.props.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.props.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let newItem = DataModal.addObject(item);
        let drawLayerItem = DataModal.addDrawLayerData(newItem, width, height);
        this.drawLayerItem = drawLayerItem;
        this.newItem = newItem;
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
        let newItems = JSON.parse(JSON.stringify(this.state.items));
        let scale = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        let width = (this.props.needRotate) ? (1960 / 1251 * ScreenWidth / scale).toString() : ScreenWidth / scale.toString();
        let height = (this.props.needRotate) ? ScreenWidth / scale.toString() : (1960 / 1251 * ScreenWidth / scale).toString();
        let fullScreenBgWidth = (this.props.needRotate) ? (1960 / 1251 * ScreenWidth).toString() : ScreenWidth.toString();
        let sketchpadHeight = (this.props.needRotate) ? ScreenWidth.toString() : (1960 / 1251 * ScreenWidth).toString();

        let newItem = DataModal.addObject(item);
        if (newItem.shape === "SketchpadText") {
            // 编辑文字
            //this.setState({
            //    isEditingText: true
            //});
            // 设置文本位置,新建的文本应位于画布中央
            newItem.y = 1251 / 2;
            this.currentSketchpadTextItem = newItem;
            this.textLayerKey = RNMatchSketchpadTopView.addContent(
                <View
                    style={{ width: this.props.needRotate ? ScreenHeight : ScreenWidth, height: this.props.needRotate ? ScreenWidth : ScreenHeight, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderTextEditView()}
                </View>);
        } else {
            let drawLayerItem = DataModal.addDrawLayerData(newItem, width, height);
            this.drawLayerItem = drawLayerItem;
            this.newItem = newItem;
            //检测如果当前是否在连续绘制图形模式下，如果发现当前有图形在绘制则替换 绘制层，否则在当前堆栈中添加绘制层
            if (newItems.length > 0 && newItems[newItems.length - 1].status === "new") {
                let shape = Utils.getItemType(newItems[newItems.length - 2]);
                if (shape === "SketchpadPolygon" || shape === "SketchpadCurvedLine") {
                    newItems[newItems.length - 2].status = "done";
                    newItems[newItems.length - 1] = newItem;
                    newItems.push(drawLayerItem);
                } else {
                    newItems[newItems.length - 2] = newItem;
                    newItems[newItems.length - 1] = drawLayerItem
                }
            } else {
                newItems.push(newItem);
                newItems.push(drawLayerItem);
            }
            this.setState({
                itemSelected: null,
                items: newItems,
                selectedObjectShape: null,
                action: "drawing"
            });
        }
    }
    finalizeDrawing(needUpdateHistory) {
        let items = JSON.parse(JSON.stringify(this.state.items));
        let that = this;
        let newItems = [];
        for (var i in items) {
            let shape = Utils.getItemType(items[i]);
            // 只有自由多边形和曲线这两种物体需要连续点击绘制，在点击结束绘制的时候状态依然为drawing，
            // 其他的物体在拖拽或者点击完成时状态已被设置为done，所以此处只需要对自由多边形和曲线两种物体设置status为done，其他物体不做处理
            // if (items[i].status === "drawing" && shape !== "SketchpadShape") {
            if (items[i].status === "drawing" && (shape === "SketchpadPolygon" || shape === "SketchpadCurvedLine")) {
                items[i].status = "done";
            }
            if (items[i].status !== "new" && items[i].status !== "drawing")
                newItems.push(items[i])
        }
        this.setState({
            items: newItems,
            action: "read",
            hasHistoryOperation: needUpdateHistory || this.state.hasHistoryOperation  // 当需要添加历史操作时，设置该属性为true，否则保持其原来的值
        }, () => {
            if (needUpdateHistory)
                that.props.history.addOperationData(JSON.parse(JSON.stringify(newItems)), "add");
        });
    }
    /**
     *
     * @description 清空所有画布上绘制元素
     * @memberof Container
     */
    removeHistory() {
        //this.history.backToInitialData();
        this.props.history.addOperationData([], "remove");
        let historyOperations = this.props.history.getAll();
        // SSCAE-3165: 清空画布时，需要继续保持当前的绘制状态，使用户能够继续绘制
        let newItems = JSON.parse(JSON.stringify(historyOperations[historyOperations.length - 1].data));
        if (this.state.action === "drawing" && this.drawLayerItem && this.newItem) {
            newItems.push(this.newItem);
            newItems.push(this.drawLayerItem);
        }
        this.setState({
            items: newItems,
            // action: "read",
            hasHistoryOperation: true
        });
    }
    undoLastOperation() {
        this.props.history.undoLastOperation();
        let historyOperations = this.props.history.getAll();
        let hasHistoryOperation = historyOperations.length - 1 > 0 ? true : false;
        // SSCAE-3165: 取消上一步操作时，需要继续保持当前的绘制状态，使用户能够继续绘制
        let newItems = JSON.parse(JSON.stringify(historyOperations[historyOperations.length - 1].data));
        if (this.state.action === "drawing" && this.drawLayerItem && this.newItem) {
            newItems.push(this.newItem);
            newItems.push(this.drawLayerItem);
        }
        this.setState({
            items: newItems,
            // action: "read",
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
            that.props.history.addOperationData(JSON.parse(JSON.stringify(newItems)), type);
        });
    }
    /**
     * 导出成功之后的回调函数
     *
     * @memberof Container
     */
    cbExportToImageFinished(message, duration) {
        Toast.show({
            text: message,
            duration: duration
        });
    }
    /**
    * 另存为图片, 保存时须将base64字符串的前缀加上
    *
    * @memberof Container
    */
    exportToImage() {
        if (this.svgRef) {
            this.svgRef.toDataURL(base64 => {
                if (this.props.onExportToImage) {
                    this.props.onExportToImage("data:image/png;base64," + base64, this.cbExportToImageFinished.bind(this));
                }
            });
        }
    }
    switchToSmallScreen() {
        Orientation.lockToPortrait();
        /*this.setState({
            isFull: false,
            isEdit: false,
            isPortrait: this.needRotate ? false : true
        });*/
        this.finalizeDrawing(true);
        // 如果当前处于全屏模式
        //if (this.state.isFull) {
        let items = this.state.items;
        this.props.onExitFullMode(items);
    }
    renderTool() {
        let that = this;
        let elementIndex = _.findIndex(this.state.items, function (item) { return item.id === that.state.itemSelectedId; });
        let itemIsTop = (elementIndex === this.state.items.length - 1) ? true : false;
        let itemIsBottom = elementIndex === 0 ? true : false;
        return (
            <View style={{ flexDirection: "row" }}>
                <ToolBar
                    language={this.props.language}
                    isPortrait={this.props.needRotate ? false : true} //当前是否是横竖屏
                    items={this.state.items} //当前画布的元素
                    itemSelectedId={this.state.itemSelectedId} //当前选中的物体id
                    itemSelected={this.state.itemSelected} //当前是否有物体被选中
                    itemIsTop={itemIsTop} // 选中物体是否是堆栈最上层
                    itemIsBottom={itemIsBottom} //选中物体是否是堆栈最底层
                    selectedObjectShape={this.state.selectedObjectShape} //被选中物体的类型
                    isEdit={this.props.isEditable ? true : false} //当前是否在编辑状态
                    action={this.state.action} //当前画布的状态
                    history={this.props.history} //当前操作历史
                    hasHistory={this.state.hasHistoryOperation} //当前是否有操作历史
                    removeHistory={() => this.removeHistory()} //移除所有操作历史
                    exportToImage={() => this.exportToImage()}  //保存为图片
                    undoLastOperation={() => this.undoLastOperation()} //返回上一次操作
                    startDrawMode={(item) => this.startDrawMode(item)} //开始画图
                    onPressTool={(newItems, type) => this.onPressToolBtn(newItems, type)} //选中物体后点击操作按钮的回调函数
                    onPressSwitchSize={() => this.switchToSmallScreen()} //切换屏幕全屏至缩略图
                    onPressConfirmDrawing={(needUpdateHistory) => this.finalizeDrawing(needUpdateHistory)} //结束当前类型画图
                />
            </View>
        )
    }
    /**
     * 文字编辑确认的响应函数
     *
     * @memberof Container
     */
    onConfirmTextEditing(newText, color) {
        if (this.currentSketchpadTextItem) {
            this.currentSketchpadTextItem.text = newText;
            this.currentSketchpadTextItem.color = color;
            let newItems = this.state.items;
            // 如果是新建的文本，则添加到item里面
            if (this.currentSketchpadTextItem.status === "drawing") {
                newItems.push(this.currentSketchpadTextItem);
            }
            this.setState({
                itemSelected: null,
                items: newItems,
                selectedObjectShape: null,
                //isEditingText: false
            });
            RNMatchSketchpadTopView.removeContent(this.textLayerKey);
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
    onTextItemLayout(item, size) {
        // 判断是否为新添加的文本
        let that = this;
        if (item.status === "drawing") {
            this.state.items.forEach(element => {
                if (element.id === item.id) {
                    element.x = Math.max(0, (1960 - this.props.offsetX * 2 - size.width) / 2);
                    element.status = "done";
                }
            });
            this.setState({
                items: this.state.items,
                hasHistoryOperation: true
            }, () => {
                that.props.history.addOperationData(JSON.parse(JSON.stringify(this.state.items)), "add");
            });
        }
    }

    /**
     * 渲染文本编辑框
     *
     * @returns
     * @memberof Container
     */
    renderTextEditView() {
        //if (this.state.isEditingText) {
        return (
            <TextEditArea
                data={this.currentSketchpadTextItem}
                isPortrait={this.props.needRotate ? false : true}
                onCancel={() => {
                    //this.setState({ isEditingText: false });
                    RNMatchSketchpadTopView.removeContent(this.textLayerKey);
                }}
                onConfirm={this.onConfirmTextEditing.bind(this)} />
        );
        // } else {
        //    return null;
        // }
    }
    renderToast(sketchpadWidth, sketchpadHeight) {
        return (
            <Toast
                ref={c => Toast.toastInstance = c}
                sketchpadWidth={parseFloat(sketchpadWidth)}
                sketchpadHeight={parseFloat(sketchpadHeight)}
                isPortrait={this.props.needRotate ? false : true}></Toast>
        );
    }
    renderSketchpad(fullScreenBgWidth, sketchpadHeight) {
        return (<Sketchpad
            onSvgRef={(svgRef) => this.svgRef = svgRef}
            isPortrait={this.props.needRotate ? false : true}
            width={fullScreenBgWidth}
            height={sketchpadHeight}
            selectedId={this.state.itemSelectedId}
            bg={this.props.bg}
            items={this.state.items}
            isEdit={this.props.isEditable ? true : false}
            attachObjectEvent={(object) => this.needToListenerObjectEvent(object)}
            attachAddPathEvent={(object) => this.needToListenerAddPathEvent(object)}
            onTextItemLayout={this.onTextItemLayout.bind(this)}
        />)
    }
    render() {
        let fullScreenBgWidth = (this.props.needRotate) ? (1960 / 1251 * ScreenWidth).toString() : ScreenWidth.toString();
        let sketchpadHeight = (this.props.needRotate) ? ScreenWidth.toString() : (1960 / 1251 * ScreenWidth).toString();

        let landscapeScreenStyle = { width: ScreenHeight, backgroundColor: "#000", flexDirection: "row", height: ScreenWidth, paddingLeft: Utils.isIPhoneXPaddTop(true) };
        let portraitScreenStyle = { flex: 1, flexDirection: "column", paddingTop: Utils.isIPhoneXPaddTop() };
        let contentStyle = this.props.needRotate ? landscapeScreenStyle : portraitScreenStyle;
        return (
            <View style={contentStyle}>
                {this.renderSketchpad(fullScreenBgWidth, sketchpadHeight)}
                {this.renderTool()}
                {this.renderToast(fullScreenBgWidth, sketchpadHeight)}
            </View >
        )
    }
}
