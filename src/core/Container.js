import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Dimensions, StatusBar, Image as RNImage } from "react-native";
import PropTypes from 'prop-types';
import * as _ from "lodash";
//import Modal from "react-native-modal";
import Orientation from "react-native-orientation";
import Sketchpad from "./Sketchpad";
import Utils from "./Utils";
import History from "./History";
import RNMatchSketchpadTopView from "./TopView";
import ModalConent from "./ModalContent";

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;
class Container extends Component {
    static propTypes = {
        data: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.string,
        isEditable: PropTypes.bool, //当前画布是否允许编辑
        //isEdit: PropTypes.bool, //当前画布是否在编辑状态,
        language: PropTypes.string
    };

    static defaultProps = {
        data: '{"background": [{"image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND","scaleFactor": 1}],"items": []}',
        width: 400,
        height: parseInt(400 / 1960 * 1251),
        isEditable: false,
        //isEdit: false,
        language: "en"
    };
    constructor(props) {
        super(props);
        this.dataModel = JSON.parse(this.props.data);
        this.offsetX = Utils.getOffsetX(this.dataModel.background[0].image);
        let convertedItems = Utils.recalculateItems(this.dataModel.items, this.offsetX, "enlarge");
        //let convertedItems = this.dataModel.items;
        //Global.instanceId = Utils.randomStringId(10);
        //this.instanceId = Global.instanceId;
        this.modalKey = null;
        if (props.history) {
            this.history = props.history;
        } else {
            this.history = new History();
            this.history.setInitialData(JSON.parse(JSON.stringify(convertedItems)));
        }
        this.onExitFullMode = this.onExitFullMode.bind(this);
        this.state = {
            items: JSON.parse(JSON.stringify(convertedItems)),
            //isFull: props.fullMode,
            //isEdit: false,
            screenHeight: Dimensions.get("window").height,
            screenWidth: Dimensions.get("window").width,
            action: "read", //当前画板出于的行为，诸如read, drawing, edit等等,
            itemSelected: false,
            selectedObjectShape: null,
            //isPortrait: true,
            itemSelectedId: null,
            hasHistoryOperation: this.history.hasHistoryOperation(),
            //isEditingText: false  //标识当前是不是在编辑文字,
        }
        this.needRotate = true
    }
    componentDidMount() {
        //Orientation.addOrientationListener(this._updateOrientation.bind(this));
        // 设置屏幕模式
        this.setScreenOrientation();
        // 设置tool显示
        //this.setState({
        //isEdit: (this.props.isEditable && this.props.fullMode) ? true : false
        //});
    }
    componentWillUnmount() {
        //Orientation.removeOrientationListener(this._updateOrientation);
    }
    _updateOrientation = (orientation) => {
        if (Platform.OS === "android") {
            if (orientation === "LANDSCAPE") {
                this.setState({
                    statusBarStyle: "light-content"
                });
            } else {
                this.setState({
                    statusBarStyle: "dark-content"
                });
            }
        }
    }


    /**
     *
     * @description 切换视图模式，全屏/缩略图。为了解决安卓下横竖屏切换会造成弹出蒙层无法点击的bug。因此将机制改为先横屏，然后在更新蒙层及画布内容。
     * @memberof Container
     */
    switchToFullMode() {
        if (this.needRotate) {
            (Platform.OS === "android") ? Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight()
        } else {
            Orientation.lockToPortrait();
        }
        //this.setState({
        //isFull: true,
        //isEdit: this.props.isEditable ? true : false,
        //isPortrait: this.needRotate ? false : true
        //});
        let overlayWidth = this.needRotate ? ScreenHeight : ScreenWidth;
        let overlayHeight = this.needRotate ? ScreenWidth : ScreenHeight;
        this.modalKey = RNMatchSketchpadTopView.addContent(
            <View style={{ width: overlayWidth, height: overlayHeight, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,1)', justifyContent: 'center', alignItems: 'center' }}>
                {this.renderStatusBar()}
                <ModalConent
                    width={this.props.width}
                    items={this.state.items}
                    language={this.props.language}
                    needRotate={this.needRotate}
                    isEditable={this.props.isEditable}
                    offsetX={this.offsetX}
                    history={this.history}
                    onExportToImage={(data, cb) => this.onExportToImage(data, cb)}
                    onExitFullMode={(items) => this.onExitFullMode(items)}
                    bg={this.dataModel.background} />
            </View>);
    }
    /**
     * 退出全屏模式时的响应函数
     *
     * @memberof Container
     */
    onExitFullMode(stateItems) {
        // 如果是编辑模式
        RNMatchSketchpadTopView.removeAll();
        if (this.props.isEditable) {
            let items = Utils.recalculateItems(stateItems, 0 - this.offsetX, "reduce");
            let newData = JSON.parse(JSON.stringify(this.dataModel));
            newData.items = items;
            this.props.onExitFullMode && this.props.onExitFullMode(JSON.stringify(newData), this.history);
        }
    }
    /**
     * 根据模式设置屏幕为横竖屏
     *
     * @memberof Container
     */
    setScreenOrientation() {
        if (this.props.fullMode) {
            this.switchToFullMode();
            //console.log(ScreenWidth + ":" + ScreenHeight)
            //if (this.needRotate) {
            // (Platform.OS === "android") ? Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight()
            //}
            //this.setState({
            //isPortrait: !this.needRotate
            //});
        } else {
            //if (this.state.action === "drawing")
            //  this.finalizeDrawing(true);
            //console.log(ScreenWidth + ":" + ScreenHeight)
            //Orientation.lockToPortrait();
        }
    }

    renderStatusBar() {
        let statusBarStyle = (Platform.OS === "ios") ? "light-content" : "light-content";
        return (this.needRotate) ? <StatusBar translucent hidden={true} /> : <StatusBar translucent hidden={false} barStyle={statusBarStyle} />
    }
    onExportToImage(data, cb) {
        this.props.onExportToImage(data, cb);
    }
    finalizeDrawing(needUpdateHistory) {
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
        this.setState({
            items: newItems,
            action: "read",
            hasHistoryOperation: true
        }, () => {
            if (needUpdateHistory)
                that.history.addOperationData(JSON.parse(JSON.stringify(newItems)), "add");
        });
    }

    render() {
        const bgImage = RNImage.resolveAssetSource(Utils.loadImage(this.dataModel.background[0].image));
        //计算是否当前画布需要旋转，如果是背景图片宽度大于高度，则全屏时需要旋转，如果是宽度小于高度，则全屏时不旋转
        this.needRotate = Utils.canvasNeedRotate(bgImage.width, bgImage.height);
        //全屏模式时，需要旋转时背景图高度即为屏幕宽度，否则背景图片宽度就是屏幕宽度
        let canvasWidth = this.props.width || 400;
        let canvasHeight = (this.needRotate) ? canvasWidth * (1251 / 1960) : canvasWidth * (1960 / 1251);
        return (<View style={{ width: canvasWidth, height: canvasHeight }}>
            <Sketchpad
                onSvgRef={(svgRef) => this.svgRef = svgRef}
                isPortrait={this.needRotate ? false : true}
                width={canvasWidth}
                height={canvasHeight}
                bg={this.dataModel.background}
                items={this.state.items}
                isEdit={false} />
            <TouchableOpacity onPress={() => this.switchToFullMode()} style={{ position: "absolute", top: 0, bottom: 0, width: canvasWidth, height: canvasHeight }}></TouchableOpacity>
        </View >)
    }
}
export default Container;
