import React, { Component } from 'react';
import { View, DeviceEventEmitter, Button, FlatList } from "react-native";
import Utils from "../core/Utils";

let toolItems = {
    "SketchpadShape": [{ "title": "放大" }, { "title": "缩小" }, { "title": "旋转" }, { "title": "反向" }, { "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadStraightLine": [{ "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadCurvedLine": [{ "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadText": [{ "title": "放大" }, { "title": "缩小" }, { "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadPolygon": [{ "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadRectangle": [{ "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }],
    "SketchpadEllipse": [{ "title": "上层" }, { "title": "下层" }, { "title": "复制" }, { "title": "删除" }]
}
class ToolBar extends Component {
    constructor(props) {
        super(props);
    }
    _keyExtractor = (item, index) => Utils.randomStringId(10);
    renderItem(item) {
        return <Button title={item.title} />
    }
    render() {
        return (
            <View>
                <FlatList
                    data={toolItems[this.props.selectedObjectType]}
                    keyExtractor={this._keyExtractor}
                    horizontal={true}
                    renderItem={({ item }) => this.renderItem(item)}
                />
            </View>
        )
    }
}
export default ToolBar;