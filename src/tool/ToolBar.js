import React, { Component } from 'react';
import { View, FlatList, Text, ScrollView, Dimensions, Image } from "react-native";
import * as _ from "lodash";
import Utils from "../core/Utils";
import Button from "../component/Button";
import AppImageList from "../core/AppImageList";
import ToolElementItems from "../data/ToolElement";
import ToolElementSelectedItems from "../data/ToolElementSelected";
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

class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showElementItems: ToolElementItems,
            expandElementItems: false, //是否展开元素二级菜单
            showItemsModal: false, //是否显示元素蒙层
            showShapeItems: [], //图形元素列表
            showItemsModalLabel: "", //元素蒙层标签
            showItemsModalShape: "", //元素蒙层形状
            showItemsModalIcon: "", //元素蒙层图标
            activeItem: null, //当前被激活的元素,
            itemSelectedIsTop: false,
            itemSelectedIsBottom: false,
            itemSelectedId: null,
            itemSelected: false
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            itemSelectedId: newProps.itemSelectedId,
            itemSelected: newProps.itemSelected
        })
    }
    _keyExtractor = (item, index) => Utils.randomStringId(10);
    onPressElementItem(item) {
        if (item.key !== "Element") {
            if (item.nodes) {
                this.setState({
                    expandElementItems: true,
                    showItemsModal: true,
                    showItemsModalLabel: item.title,
                    showItemsModalShape: item.key,
                    showItemsModalIcon: item.image,
                    activeItem: item,
                    showShapeItems: item.nodes
                })
            } else {
                this.setState({
                    showItemsModal: false
                })
                this.props.startDrawMode(item)
            }
        } else {
            if (this.state.expandElementItems) {
                this.setState({
                    expandElementItems: false,
                    showElementItems: ToolElementItems
                })
            } else {
                this.setState({
                    expandElementItems: true,
                    showElementItems: ToolElementItems[0].nodes
                })
            }
        }
    }
    expandElement(item) {
        let img = item.image.Vertical ? (this.props.isPortrait ? item.image.Vertical : item.image.Horizontal) : item.image
        let dynamicWH = item.key === "Element" ? 94 : parseInt((ScreenWidth - 32 - 94) / 5);
        let width = this.props.isPortrait ? dynamicWH : 36;
        let height = this.props.isPortrait ? 36 : dynamicWH;

        return <View style={{ width, height, alignItems: "center", justifyContent: "center" }}><Button isPortrait={this.props.isPortrait} imageSource={AppImageList[img]} onPress={() => this.onPressElementItem(item)} label={item.showTitle ? item.title : null} /></View>
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
        this.setState({
            expandElementItems: false,
            showElementItems: ToolElementItems
        })
        let needUpdateHistory = this.state.activeItem.shape === "SketchpadCurvedLine" || this.state.activeItem.shape === "SketchpadPolygon" ? true : false;
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
        let imgWidth = bgImage.width / 2;
        let imgHeight = bgImage.height / 2;
        return <View key={Utils.randomStringId(10)} style={{ backgroundColor: "#484848", marginRight: 8, marginBottom: 8, width: imgWidth, height: imgHeight }}><Button imageSource={AppImageList[img]} width={imgWidth} height={imgHeight} onPress={() => this.onPressElementItem(item)} /></View>
    }
    /**
     *
     * @description 渲染弹出物体选择蒙层的顶部标签栏,点击返回按钮隐藏蒙层
     * @returns
     * @memberof ToolBar
     */
    renderShapeSelectModalToolBar() {
        return (<View style={{ flexDirection: "row", padding: 16, "justifyContent": "space-between" }}>
            <Text style={styles.modalLabel}>{this.state.showItemsModalLabel}</Text>
            <Text style={styles.modalLabel} onPress={() => this.setState({ showItemsModal: false })}>返回</Text>
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
            let contentHeight = this.state.showItemsModalShape === "SketchpadLine" ? 296 : 187;
            let numColumns = (this.state.showItemsModalShape === "SketchpadLine") ? Math.ceil(this.state.showShapeItems.length / 4) : this.state.showItemsModalShape === "SketchpadZone" ? 3 : Math.ceil(this.state.showShapeItems.length / 2);
            return (<View style={{ position: "absolute", bottom: 0, height: contentHeight, width: "100%", backgroundColor: "#000" }}>
                {this.renderShapeSelectModalToolBar()}
                <ScrollView style={{ flexDirection: "row", paddingLeft: 16, paddingRight: 16 }} horizontal={true}>
                    <FlatList
                        data={this.state.showShapeItems}
                        keyExtractor={this._keyExtractor}
                        numColumns={numColumns}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => this.renderShapeItem(item)}
                    />
                </ScrollView>
            </View >)
        } else {
            return (<View style={{ position: "absolute", right: 0, width: 229, height: ScreenWidth, backgroundColor: "#000" }}>
                {this.renderShapeSelectModalToolBar()}
                {this.renderListContainer()}
            </View >)
        }
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
        return <ScrollView
            style={{ marginLeft: 16, marginRight: 8, height: ScreenWidth - 32 - 21 }}
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
                <View style={[styles.elementContainer, { marginRight: btnElementMarginRightBottom, width: btnElementWidth }]}>
                    <FlatList
                        data={this.state.showElementItems}
                        keyExtractor={this._keyExtractor}
                        horizontal={true}
                        scrollEnabled={false}
                        renderItem={({ item }) => this.expandElement(item)}
                    />
                </View>
                <View style={styles.essentialBtnContainerInPortrait}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this.props.hasHistory} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View>
            </View >)
        }
        else if (this.props.action === "drawing") {
            return (<View style={styles.containerEditReadInPortrait}>
                <View style={[styles.elementContainer, { marginRight: btnElementMarginRightBottom, width: 94, height: 36, flexDirection: "row", alignItems: "center", justifyContent: "center" }]}>
                    <Button onPress={() => this.onPressElementItem(this.state.activeItem)} imageSource={AppImageList[this.state.showItemsModalIcon]} />
                    <Button onPress={() => this.finalizeDrawing()} imageSource={AppImageList.endDrawing} />
                </View>
                <View style={styles.essentialBtnContainerInPortrait}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this.props.hasHistory} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} /></View>
            </View>)
        } else {
            return (<View style={styles.containerEditReadInPortrait}>
                <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} /></View>)
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
                <View style={[styles.elementContainer, { marginBottom: btnElementMarginRightBottom, height: btnElementHeight }]}>
                    <FlatList
                        data={this.state.showElementItems}
                        keyExtractor={this._keyExtractor}
                        scrollEnabled={false}
                        renderItem={({ item }) => this.expandElement(item)}
                    />
                </View>
                <View style={styles.essentialBtnContainerInLandscape}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this.props.hasHistory} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View></View >)
        }
        else if (this.props.action === "drawing") {
            return (<View style={styles.containerEditReadInLandscape}>
                <View style={[styles.elementContainer, { marginBottom: btnElementMarginRightBottom, height: 94 }]}>
                    <Button onPress={() => this.onPressElementItem(this.state.activeItem)} imageSource={AppImageList[this.state.showItemsModalIcon]} />
                    <Button onPress={() => this.finalizeDrawing()} imageSource={AppImageList.endDrawing} />
                </View>
                <View style={styles.essentialBtnContainerInLandscape}>
                    <Remove onPress={() => this.props.removeHistory()} isDisabled={!this.props.hasHistory} />
                    <Undo onPress={() => this.props.undoLastOperation()} isDisabled={!this.props.hasHistory} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} />
                </View>
            </View >)
        } else {
            return (<View style={styles.containerEditReadInLandscape}>
                <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.download} />
                <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.minimize} /></View>)
        }
    }
    renderElementLayer(mode) {
        let topMargin = ScreenWidth * 1960 / 1251;
        if (this.state.showItemsModal) {
            if (mode === "portrait") {
                return (<View style={{ position: "absolute", top: -topMargin - Utils.getPhoneTopDistance(), width: ScreenWidth, height: Utils.getAvailableZone(), backgroundColor: "transparent", flex: 1 }}>
                    {this.renderItemsContent()}
                </View>)
            } else {
                return (<View style={{ position: "absolute", left: -topMargin - Utils.getPhoneTopDistance(), top: 0, width: Utils.getAvailableZone(), height: ScreenWidth, backgroundColor: "transparent", flex: 1 }}>
                    {this.renderItemsContent()}
                </View>)
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