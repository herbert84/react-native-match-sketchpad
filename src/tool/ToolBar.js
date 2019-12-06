import React, { Component } from 'react';
import { View, DeviceEventEmitter, FlatList, Text, ScrollView, Dimensions, Image } from "react-native";
import Modal from "react-native-modal";
import Utils from "../core/Utils";
import Button from "../component/Button";
import AppImageList from "../core/AppImageList";
import ToolElementItems from "../data/ToolElement";
import ToolElementSelectedItems from "../data/ToolElementSelected";
import styles from "./ToolBarStyle";

let ScreenWidth = Dimensions.get("window").width;
let ScreenHeight = Dimensions.get("window").height;
let btnElementMarginRightBottom = ScreenWidth - 16 - 16 - 210 - 94;

class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showElementItems: ToolElementItems,
            expandElementItems: false,
            showItemsModal: false,
            showShapeItems: [],
            showItemsModalLabel: "",
            showItemsModalShape: "",
            showItemsModalIcon: "",
            activeItem: null
        }
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
        return <View style={itemStyle}><Button imageSource={AppImageList[item.image]} /></View>
    }
    switchSizeMode() {
        this.props.onPressSwitchSize();
    }
    finalizeDrawing() {
        this.setState({
            expandElementItems: false,
            showElementItems: ToolElementItems
        })
        this.props.onPressConfirmDrawing();
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
     * @description 渲染选择物体弹出蒙层中物体列表
     * @returns
     * @memberof ToolBar
     */
    renderItemsContent() {
        if (this.props.isPortrait) {
            //竖屏模式下，如果是线条，则显示四行，否则显示两行
            let numColumns = (this.state.showItemsModalShape === "SketchpadLine") ? Math.ceil(this.state.showShapeItems.length / 4) : Math.ceil(this.state.showShapeItems.length / 2);
            return (<View style={{ height: 375, width: "100%", backgroundColor: "#000" }}>
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
            return (<View style={{ width: 229, height: ScreenWidth, backgroundColor: "#000" }}>
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
    showToolbarInPortraitMode() {
        if (this.props.isEdit && this.props.itemSelected) {
            return (<View style={styles.containerEditReadInPortrait}>
                <FlatList
                    data={ToolElementSelectedItems[this.props.selectedObjectShape]}
                    keyExtractor={this._keyExtractor}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => this.renderToolItem(item)}
                />
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
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.remove} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.return} />
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
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.remove} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.return} />
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
                <FlatList
                    data={ToolElementSelectedItems[this.props.selectedObjectShape]}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => this.renderToolItem(item)}
                />
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
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.remove} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.return} />
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
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.remove} />
                    <Button onPress={() => this.switchSizeMode()} imageSource={AppImageList.return} />
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
    render() {
        if (this.props.isPortrait) {
            return (
                <View>
                    {this.showToolbarInPortraitMode()}
                    <Modal isVisible={this.state.showItemsModal} backdropOpacity={0} supportedOrientations={['portrait', 'landscape']} style={{ justifyContent: 'flex-end', margin: 0 }}>
                        {this.renderItemsContent()}
                    </Modal>
                </View>
            )
        } else
            return (
                <View>
                    {this.showToolbarInLandscapeMode()}
                    <Modal
                        isVisible={this.state.showItemsModal}
                        backdropOpacity={0}
                        supportedOrientations={['portrait', 'landscape']}
                        style={{ alignItems: "flex-end", margin: 0 }}
                        animationIn="slideInRight"
                        animationOut="slideInLeft">
                        {this.renderItemsContent()}
                    </Modal>
                </View>)
    }
}
export default ToolBar;