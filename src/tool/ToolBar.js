import React, { Component } from 'react';
import { View, FlatList, Text, ScrollView, Dimensions, Image, Animated, Easing, TouchableOpacity, Platform } from "react-native";
import * as _ from "lodash";
import Utils from "../core/Utils";
import Button from "../component/Button";
import AppImageList from "../core/AppImageList";
import ToolElementItemsPortrait from "../data/ToolElementPortrait";
import ToolElementItemsLandscape from "../data/ToolElementLandscape";
import ToolElementSelectedItems from "../data/ToolElementSelected";
import ColorMappings from "../data/ColorMappings";
import Remove from "./Remove";
import Undo from "./Undo";
import RotationTool from "./RotationTool";
import ResizeTool from "./ResizeTool";
import DeleteTool from "./DeleteTool";
import StackTool from "./StackTool";
import MirrorTool from "./MirrorTool";
import DuplicateTool from "./DuplicateTool";
import styles from "./ToolBarStyle";

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
let btnElementMarginRightBottom = ScreenWidth - 16 - 16 - 210 - 94;

const COLOR_BLACK_INDEX = 4;

class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.defauleColorIndex = {
            "LINE": COLOR_BLACK_INDEX,
            "AREAS": COLOR_BLACK_INDEX
        };
        this.state = {
            showElementItems: this.props.isPortrait ? ToolElementItemsPortrait : ToolElementItemsLandscape,
            expandElementItems: false, //是否展开元素二级菜单
            showItemsModal: false, //是否显示元素蒙层
            showShapeItems: [], //图形元素列表
            showItemsModalLabel: "", //元素蒙层标签
            showItemsModalShape: "", //元素蒙层形状
            showItemsModalIcon: "", //元素蒙层图标
            activeItem: null, //当前被激活的元素,
            drawingItem: null,  //当前正在绘制的图形
            selectedColorIndex: COLOR_BLACK_INDEX,  //选中的颜色的索引位置，默认选中黑色
            itemSelectedIsTop: false,
            itemSelectedIsBottom: false,
            itemSelectedId: null,
            itemSelected: false,
            elementToolBarX: new Animated.Value(94),// 点击元素按钮后展开及收拢的长度/宽度变化值
            shapeToolBarX: new Animated.Value(0), // 点击图形后向上/向左展开及收拢的高度/宽度变化值
            selectedElementImage: ""  // 记录在工具条中选中的具体的物体(具体的线条，区域，球员或球场物体)，以便在继续绘制的时候高亮该物体
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            itemSelectedId: newProps.itemSelectedId,
            itemSelected: newProps.itemSelected
        })
    }
    //展示View
    _showTipView = () => {
        //let topMargin = ScreenWidth * 1960 / 1251;
        Animated.timing(
            this.state.elementToolBarX,
            {
                toValue: ScreenWidth - 32,
                duration: 200,   //动画时长300毫秒,
                easing: Easing.linear
            }
        ).start();
    }

    //隐藏view
    _hiddenTipView = () => {
        Animated.timing(
            this.state.elementToolBarX,
            {
                toValue: 94,
                duration: 200,   //动画时长300毫秒,
                easing: Easing.linear
            }).start();
    }
    _showShapeTipView = () => {
        //let topMargin = ScreenWidth * 1960 / 1251;
        let contentHeight = this.state.showItemsModalShape === "LINE" ? 296 : 187;
        let marginTop = (this.props.isPortrait) ? contentHeight + (Platform.OS === "android" ? 20 : 0) : 229;
        Animated.timing(
            this.state.shapeToolBarX,
            {
                //toValue: -topMargin - Utils.getPhoneTopDistance(),
                toValue: marginTop,
                duration: 200,   //动画时长300毫秒,
                easing: Easing.linear
            }
        ).start();
    }

    //隐藏view
    _hiddenShapeTipView = () => {
        Animated.timing(
            this.state.shapeToolBarX,
            {
                toValue: 0,
                duration: 200,   //动画时长300毫秒,
                easing: Easing.linear
            }).start();
    }
    /**
     * 判断是否有可被删除的物体
     *
     * @memberof ToolBar
     */
    _hasRemovableItems(items) {
        return _.filter(items, (item) => { return (item.status !== "new" && item.status !== "drawing") ? true : false; }).length > 0 ? true : false;
    }
    _keyExtractor = (item, index) => Utils.randomStringId(10);
    onPressElementItem(item) {
        if (item.key !== "ELEMENT") {
            if (item.nodes) {
                this.setState({
                    expandElementItems: true,
                    showItemsModal: true,
                    showItemsModalLabel: Utils.getTranslatedText("LABEL", item.key, this.props.language),
                    showItemsModalShape: item.key,
                    showItemsModalIcon: item.image,
                    activeItem: item,
                    showShapeItems: item.nodes,
                    selectedColorIndex: this.defauleColorIndex[item.key]   // 设置选择颜色
                }, () => this._showShapeTipView());
            } else {
                this._hiddenShapeTipView();
                this._hiddenTipView();
                setTimeout(() => {
                    let img = item.image.Vertical ? (this.props.isPortrait ? item.image.Vertical : item.image.Horizontal) : item.image;
                    this.setState({
                        showItemsModal: false,
                        selectedElementImage: img,
                        drawingItem: item
                    });
                    //this._hiddenShapeTipView();
                    if (this.state.showItemsModalShape === "LINE" || this.state.showItemsModalShape === "AREAS") {
                        item.color = ColorMappings[this.state.selectedColorIndex].color;  //设置选中的颜色
                        item.backgroundColor = ColorMappings[this.state.selectedColorIndex].backgroundColor;  //设置选中的颜色
                    }
                    this.defauleColorIndex[this.state.showItemsModalShape] = this.state.selectedColorIndex;  // 记住本次绘制所选择的颜色
                    this.props.startDrawMode(item)
                }, 300);
            }
        } else {
            if (this.state.expandElementItems) {
                this.setState({
                    expandElementItems: false,
                    showElementItems: this.props.isPortrait ? ToolElementItemsPortrait : ToolElementItemsLandscape
                }, () => this._hiddenTipView());
            } else {
                this.setState({
                    expandElementItems: true,
                    showElementItems: this.props.isPortrait ? ToolElementItemsPortrait[0].nodes : ToolElementItemsLandscape[0].nodes
                }, () => this._showTipView());
            }
        }
    }
    expandElement(item) {
        let img = item.image.Vertical ? (this.props.isPortrait ? item.image.Vertical : item.image.Horizontal) : item.image
        let dynamicWH = item.key === "ELEMENT" ? 94 : parseInt((ScreenWidth - 32 - 94) / 5);
        let width = this.props.isPortrait ? dynamicWH : 36;
        let height = this.props.isPortrait ? 36 : dynamicWH;
        let title = Utils.getTranslatedText("LABEL", item.key, this.props.language);
        let showSeparator = item.key === "ELEMENT" && this.state.expandElementItems ? true : false;

        return showSeparator ?
            (
                <View style={{ width, height, alignItems: "center", flexDirection: this.props.isPortrait ? "row" : "column", justifyContent: "center" }}>
                    <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
                        <Button
                            isPortrait={this.props.isPortrait}
                            imageSource={AppImageList[img]}
                            onPress={() => this.onPressElementItem(item)}
                            label={item.showTitle ? title : null}
                            language={this.props.language} />
                    </View >
                    {this.renderElementButtonSeparator()}
                </View>
            )
            :
            (
                <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
                    <Button
                        isPortrait={this.props.isPortrait}
                        imageSource={AppImageList[img]}
                        onPress={() => this.onPressElementItem(item)}
                        label={item.showTitle ? title : null}
                        language={this.props.language} />
                </View >
            );
    }
    /**
     * 渲染元素按钮中间的分割线
     *
     * @returns
     * @memberof ToolBar
     */
    renderElementButtonSeparator() {
        let width = this.props.isPortrait ? 1 : 12;
        let height = this.props.isPortrait ? 12 : 1;
        return (
            <View style={{ width, height, backgroundColor: "#353535" }}></View>
        );
    }
    /**
     * 点击返回按钮的响应函数
     *
     * @memberof ToolBar
     */
    onPressCancel() {
        this._hiddenShapeTipView();
        setTimeout(() => {
            this.setState({
                showItemsModal: false,
                selectedColorIndex: this.defauleColorIndex[this.state.showItemsModalShape]  // 点击返回时，重置颜色选择为上一次成功绘制的颜色
            });
        }, 300)
    }
    renderToolItem(item) {
        let itemStyle = this.props.isPortrait ? { marginRight: 22 } : { marginBottom: 22 };
        let itemSelectedId = this.state.itemSelectedId;
        switch (item.key) {
            case "rotation": return <View style={itemStyle}><RotationTool imageSource={AppImageList[item.image]} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "enlarge":
            case "reduce": return <View style={itemStyle}><ResizeTool imageSource={AppImageList[item.image]} type={item.key} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "delete": return <View style={itemStyle}><DeleteTool imageSource={AppImageList[item.image]} type={item.key} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "moveup": return <View style={itemStyle}><StackTool imageSource={AppImageList[item.image]} type={item.key} isDisabled={this.props.itemIsTop} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "movedown": return <View style={itemStyle}><StackTool imageSource={AppImageList[item.image]} type={item.key} isDisabled={this.props.itemIsBottom} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "mirror": return <View style={itemStyle}><MirrorTool imageSource={AppImageList[item.image]} type={item.key} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            case "duplicate": return <View style={itemStyle}><DuplicateTool imageSource={AppImageList[item.image]} type={item.key} items={this.props.items} itemSelectedId={itemSelectedId} onPress={(newItems) => this.props.onPressTool(newItems, item.key)} /></View>; break;
            default: break;
        }
    }
    switchSizeMode() {
        this.props.onPressSwitchSize();
    }
    finalizeDrawing() {
        this.defauleColorIndex[this.state.showItemsModalShape] = COLOR_BLACK_INDEX;  // 绘制结束的时候重置颜色选择
        this.setState({
            expandElementItems: false,
            showElementItems: this.props.isPortrait ? ToolElementItemsPortrait : ToolElementItemsLandscape,
            selectedColorIndex: this.defauleColorIndex[this.state.showItemsModalShape],
            selectedElementImage: ""  // 结束绘制时清空上次绘制的选择
        });
        // 当绘制连续打点的图形时，点击结束绘制需要添加历史
        let needUpdateHistory = this.state.drawingItem.shape === "SketchpadCurvedLine" || this.state.drawingItem.shape === "SketchpadPolygon" ? true : false;
        this.props.onPressConfirmDrawing(needUpdateHistory);
    }
    /**
     *
     * @description 渲染弹出物体选择蒙层中单个物体的组件，根据自身图片尺寸计算实际渲染尺寸
     * @param {*} item
     * @returns
     * @memberof ToolBar
     */
    renderShapeItem(item) {
        let img = item.image.Vertical ? (this.props.isPortrait ? item.image.Vertical : item.image.Horizontal) : item.image;
        const bgImage = Image.resolveAssetSource(AppImageList[img]);
        let key = this.state.showItemsModalShape;
        let imgWidth = bgImage.width / 2;
        let imgHeight = bgImage.height / 2;
        let backgroundColor = img === this.state.selectedElementImage ? "#656866" : "#484848";   // 选中和未选择设置不同的背景色
        if (key === "AREAS") {
            let textStyle = this.props.isPortrait ? { position: "absolute", bottom: 12, color: "#FFF", fontSize: 12 } : { position: "absolute", right: 24, color: "#FFF", top: 27, fontSize: 12 }
            return <View key={Utils.randomStringId(10)} style={{ backgroundColor, marginRight: 8, marginBottom: 8, alignItems: "center", width: imgWidth, height: imgHeight, borderRadius: 2 }}>
                <Button imageSource={AppImageList[img]} width={imgWidth} height={imgHeight} onPress={() => this.onPressElementItem(item)} />
                <Text style={textStyle} onPress={() => this.onPressElementItem(item)}>{Utils.getTranslatedText("LABEL", item.key, this.props.language)}</Text>
            </View>
        } else {
            return <View key={Utils.randomStringId(10)} style={{ backgroundColor, marginRight: 8, marginBottom: 8, alignItems: "center", width: imgWidth, height: imgHeight, borderRadius: 2 }}><Button imageSource={AppImageList[img]} width={imgWidth} height={imgHeight} onPress={() => this.onPressElementItem(item)} /></View>
        }
    }
    /**
     *
     * @description 渲染弹出物体选择蒙层的顶部标签栏,点击返回按钮隐藏蒙层
     * @returns
     * @memberof ToolBar
     */
    renderShapeSelectModalToolBar() {
        let paddingLeftRight = this.props.isPortrait ? 16 : 24;
        return (<View style={{ flexDirection: "row", paddingTop: 16, paddingBottom: 16, paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight, "justifyContent": "space-between" }}>
            <Text style={styles.modalLabel}>{this.state.showItemsModalLabel}</Text>
            <Text style={styles.modalLabel} onPress={this.onPressCancel.bind(this)}>{Utils.getTranslatedText("BUTTON", "CANCEL", this.props.language)}</Text>
        </View>)
    }
    /**
     *
     * @description 渲染选择物体类型弹出蒙层中物体列表
     * @returns
     * @memberof ToolBar
     */
    renderItemsContent() {
        if (this.props.isPortrait) {
            //竖屏模式下，如果是线条，则显示四行，如果是区域则显示一行，否则显示两行
            let contentHeight = this.state.showItemsModalShape === "LINE" ? 296 : 187;
            let numColumns = (this.state.showItemsModalShape === "LINE") ? Math.ceil(this.state.showShapeItems.length / 4) : this.state.showItemsModalShape === "AREAS" ? 3 : Math.ceil(this.state.showShapeItems.length / 2);
            return (<Animated.View style={{ position: "absolute", bottom: 0, height: this.state.shapeToolBarX, width: "100%", backgroundColor: "rgba(0,0,0,0.9)" }}>
                {this.renderShapeSelectModalToolBar()}
                {this.renderColorSelectionList()}
                <ScrollView style={{ flexDirection: "row", paddingLeft: 16, paddingRight: 8 }} horizontal={true}>
                    <FlatList
                        data={this.state.showShapeItems}
                        keyExtractor={this._keyExtractor}
                        numColumns={numColumns}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => this.renderShapeItem(item)}
                    />
                </ScrollView>
            </Animated.View>)
        } else {
            return (<Animated.View style={{ position: "absolute", right: 0, width: this.state.shapeToolBarX, height: ScreenWidth, backgroundColor: "rgba(0,0,0,0.9)" }}>
                {this.renderShapeSelectModalToolBar()}
                {this.renderColorSelectionList()}
                {this.renderListContainer()}
            </Animated.View>)
        }
    }
    /**
     * 渲染颜色选择列表
     *
     * @memberof ToolBar
     */
    renderColorSelectionList() {
        if (this.state.showItemsModalShape === "LINE" || this.state.showItemsModalShape === "AREAS") {
            let items = [];
            ColorMappings.forEach((item, index) => {
                items.push(this.renderColorSelectionItem(item, index));
            });
            return (
                <View style={styles.colorList}>
                    {items}
                </View>
            );
        } else {
            return null;
        }
    }
    /**
     * 渲染颜色选择块
     *
     * @param {*} item
     * @returns
     * @memberof ToolBar
     */
    renderColorSelectionItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.onSelectColor(index)}>
                <View style={[
                    this.props.isPortrait ? styles.colorItemContainerPortrait : styles.colorItemContainer,
                    { borderColor: index === this.state.selectedColorIndex ? "rgba(255,255,255,0.33)" : "rgba(0,0,0,0)" }
                ]}>
                    <View style={[
                        this.props.isPortrait ? styles.colorItemPortrait : styles.colorItem,
                        { backgroundColor: item.uxColor }
                    ]} />
                </View>
            </TouchableOpacity>
        );
    }
    /**
     * 选择颜色的响应函数
     *
     * @memberof ToolBar
     */
    onSelectColor(index) {
        this.setState({
            selectedColorIndex: index
        });
    }
    /**
     *
     * @description 当前横屏模式下需要用view来添加物体并自动换行，因为要考虑图片尺寸不一致所以不能用标准FlatList
     * @returns
     * @memberof ToolBar
     */
    renderListContainer() {
        let result = [];
        let shapeItems = this.state.showShapeItems
        for (var i in shapeItems) {
            result.push(this.renderShapeItem(shapeItems[i]))
        }
        let marginLeft = this.props.isPortrait ? 16 : 24;
        let marginRight = this.props.isPortrait ? 8 : 16;
        return <ScrollView
            style={{ marginLeft: marginLeft, marginRight: marginRight, height: ScreenWidth - 32 - 21 }}
            showsVerticalScrollIndicator={false}>
            <View style={{ width: 197, flexDirection: "row", flexWrap: 'wrap' }}>{result}</View></ScrollView>
    }
    /**
     *
     * @description 根据横竖屏不同，渲染对应的选中物体后显示的底部操作按钮
     * @param {*} mode 横竖屏变量，可传portrait/landscape
     * @returns
     * @memberof ToolBar
     */
    renderShapeToolList(mode) {
        let btnList = ToolElementSelectedItems[this.props.selectedObjectShape];
        let renderWrapper = [];
        for (var i in btnList) {
            renderWrapper.push(this.renderToolItem(btnList[i]))
        }
        if (mode === "portrait")
            return <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>{renderWrapper}</ScrollView>
        else
            return <ScrollView showsVerticalScrollIndicator={false}>{renderWrapper}</ScrollView>
    }
    showToolbarInPortraitMode() {
        if (this.props.isEdit && this.props.itemSelected) {
            return (<View style={styles.containerEditReadInPortrait}>
                {this.renderShapeToolList("portrait")}
            </View>)
        }
        else if (this.props.isEdit && this.props.action === "read") {
            let btnElementWidth = this.state.expandElementItems ? (ScreenWidth - 32) : 94
            return (<View style={styles.containerEditReadInPortrait}>
                <Animated.View style={[styles.elementContainer, { marginRight: btnElementMarginRightBottom, width: this.state.elementToolBarX }]}>
                    <FlatList
                        data={this.state.showElementItems}
                        keyExtractor={this._keyExtractor}
                        horizontal={true}
                        scrollEnabled={false}
                        renderItem={({ item }) => this.expandElement(item)}
                    />
                </Animated.View>
                <View style={styles.essentialBtnContainerInPortrait}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this._hasRemovableItems(this.props.items)} language={this.props.language} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View>
            </View >)
        }
        else if (this.props.action === "drawing") {
            return (<View style={styles.containerEditReadInPortrait}>
                <Animated.View style={[styles.elementContainer, { marginRight: btnElementMarginRightBottom, width: this.state.elementToolBarX, height: 36, flexDirection: "row", alignItems: "center", justifyContent: "center" }]}>
                    <Button onPress={() => this.onPressElementItem(this.state.activeItem)} imageSource={AppImageList[this.state.showItemsModalIcon]} />
                    {this.renderElementButtonSeparator()}
                    <Button onPress={() => this.finalizeDrawing()} imageSource={AppImageList.endDrawing} />
                </Animated.View>
                <View style={styles.essentialBtnContainerInPortrait}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this._hasRemovableItems(this.props.items)} language={this.props.language} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} /></View>
            </View>)
        } else {
            // 只读状态时退出全屏和下载按钮需要居于右侧
            return (
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "flex-end" }}>
                    <View style={[styles.containerEditReadInPortrait, { width: 126 }]}>
                        <Button style={{ marginRight: 22 }} onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                        <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                    </View>
                </View>
            );
        }
    }
    showToolbarInLandscapeMode() {
        if (this.props.isEdit && this.props.itemSelected) {
            return (<View style={styles.containerEditReadInLandscape}>
                {this.renderShapeToolList("landscape")}
            </View>)
        }
        else if (this.props.isEdit && this.props.action === "read") {
            let btnElementHeight = this.state.expandElementItems ? (ScreenWidth - 32) : 94
            return (<View style={styles.containerEditReadInLandscape}>
                <Animated.View style={[styles.elementContainer, { marginBottom: btnElementMarginRightBottom, height: this.state.elementToolBarX }]}>
                    <FlatList
                        data={this.state.showElementItems}
                        keyExtractor={this._keyExtractor}
                        scrollEnabled={false}
                        renderItem={({ item }) => this.expandElement(item)}
                    />
                </Animated.View>
                <View style={styles.essentialBtnContainerInLandscape}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this._hasRemovableItems(this.props.items)} language={this.props.language} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View></View >)
        }
        else if (this.props.action === "drawing") {
            return (<View style={styles.containerEditReadInLandscape}>
                <Animated.View style={[styles.elementContainer, { marginBottom: btnElementMarginRightBottom, height: this.state.elementToolBarX, alignItems: "center", justifyContent: "center" }]}>
                    <Button onPress={() => this.onPressElementItem(this.state.activeItem)} imageSource={AppImageList[this.state.showItemsModalIcon]} />
                    {this.renderElementButtonSeparator()}
                    <Button onPress={() => this.finalizeDrawing()} imageSource={AppImageList.endDrawing} />
                </Animated.View>
                <View style={styles.essentialBtnContainerInLandscape}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this._hasRemovableItems(this.props.items)} language={this.props.language} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View>
            </View >)
        } else {
            // 只读状态时退出全屏和下载按钮需要居于下方
            return (
                <View style={{ flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <View style={[styles.containerEditReadInLandscape, { height: 126 }]}>
                        <Button style={{ marginBottom: 22 }} onPress={() => this.props.exportToImage()} imageSource={AppImageList.download} />
                        <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                    </View>
                </View>
            );
        }
    }
    renderElementLayer(mode) {
        let topMargin = ScreenWidth * 1960 / 1251;
        let sMargin = -topMargin - Utils.getPhoneTopDistance();
        if (this.state.showItemsModal) {
            if (mode === "portrait") {
                return (<Animated.View style={{ position: "absolute", top: sMargin, width: ScreenWidth, height: Utils.getAvailableZone(), backgroundColor: "transparent", flex: 1 }}>
                    {this.renderItemsContent()}
                </Animated.View>)
            } else {
                return (<Animated.View style={{ position: "absolute", left: sMargin, top: 0, width: Utils.getAvailableZone(), height: ScreenWidth, backgroundColor: "transparent", flex: 1 }}>
                    {this.renderItemsContent()}
                </Animated.View>)
            }
        } else {
            return null
        }
    }
    render() {
        if (this.props.isPortrait) {
            return (
                <View>
                    {this.showToolbarInPortraitMode()}
                    {this.renderElementLayer("portrait")}
                </View>
            )
        } else
            return (
                <View>
                    {this.showToolbarInLandscapeMode()}
                    {this.renderElementLayer("landscape")}
                </View>)
    }
}
export default ToolBar;
