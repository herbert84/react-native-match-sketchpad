import React, { Component } from 'react';
import * as _ from "lodash";
import DataModal from "../core/DataModel";
import Button from "../component/Button";

class DuplicateTool extends Component {
    onPress() {
        let itemSelectedId = this.props.itemSelectedId;
        let items = this.props.items;
        let newItems = JSON.parse(JSON.stringify(items));
        let newItem = {};
        for (var i in items) {
            if (items[i].id === itemSelectedId) {
                newItem = DataModal.duplicateObject(items[i]);
            }
        }
        newItems.push(newItem);
        this.props.onPress(newItems);
    }
    render() {
        return (<Button imageSource={this.props.imageSource} onPress={() => this.onPress()} />)
    }
}
export default DuplicateTool;