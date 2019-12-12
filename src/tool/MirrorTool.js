import React, { Component } from 'react';
import * as _ from "lodash";
import Button from "../component/Button";

class MirrorTool extends Component {
    onPress() {
        let itemSelectedId = this.props.itemSelectedId;
        let items = this.props.items;
        let newItems = items;
        this.props.onPress(newItems);
    }
    render() {
        return (<Button imageSource={this.props.imageSource} onPress={() => this.onPress()} />)
    }
}
export default MirrorTool;