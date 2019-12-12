import React, { Component } from 'react';
import * as _ from "lodash";
import Button from "../component/Button";

class DeleteTool extends Component {
    onPress() {
        let itemSelectedId = this.props.itemSelectedId;
        let items = this.props.items;
        let newItems = _.remove(items, function (item) {
            return item.id !== itemSelectedId;
        });
        this.props.onPress(newItems);
    }
    render() {
        return (<Button imageSource={this.props.imageSource} onPress={() => this.onPress()} />)
    }
}
export default DeleteTool;