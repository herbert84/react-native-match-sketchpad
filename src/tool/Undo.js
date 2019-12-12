import React, { Component } from 'react';
import Button from "../component/Button";
import AppImageList from "../core/AppImageList";

class Undo extends Component {
    onPress() {
        this.props.onPress();
    }
    render() {
        return (<Button imageSource={AppImageList.return} onPress={() => this.onPress()} isDisabled={this.props.isDisabled} />)
    }
}
export default Undo;