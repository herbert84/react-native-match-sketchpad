import React, { Component } from 'react';
import Button from "../component/Button";

class ResizeTool extends Component {
    onPress() {
        let itemSelectedId = this.props.itemSelectedId;
        let items = this.props.items;
        let newItems = [];
        for (var i in items) {
            if (items[i].id === itemSelectedId) {
                items[i].scale = (this.props.type === "enlarge") ? items[i].scale * 1.1 : items[i].scale / 1.1;
            }
            newItems.push(items[i])
        }
        this.props.onPress(newItems);
    }
    render() {
        return (<Button imageSource={this.props.imageSource} onPress={() => this.onPress()} />)
    }
}
export default ResizeTool;