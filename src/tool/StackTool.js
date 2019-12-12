import React, { Component } from 'react';
import Utils from "../core/Utils";
import * as _ from "lodash";
import Button from "../component/Button";

class StackTool extends Component {
    onPress() {
        let itemSelectedId = this.props.itemSelectedId;
        let items = this.props.items;
        let elementIndex = _.findIndex(items, function (item) { return item.id == itemSelectedId; });
        let newItems = (this.props.type === "moveup") ? Utils.swapArr(items, elementIndex, elementIndex + 1) : Utils.swapArr(items, elementIndex, elementIndex - 1);
        this.props.onPress(newItems);
    }
    render() {
        return (<Button imageSource={this.props.imageSource} onPress={() => this.onPress()} isDisabled={this.props.isDisabled} />)
    }
}
export default StackTool;