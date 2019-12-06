import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Image as RNImage,
} from 'react-native';
import SketchObject from "../core/Object";
import Svg, { Image, G, Path, Rect, Text } from 'react-native-svg';
import Utils from "../core/Utils";

class Item extends SketchObject {
    static propTypes = {
        data: PropTypes.object
    };

    static defaultProps = {
        data: {
            x: 0,
            y: 0,
            scale: 1
        }
    };
    render() {
        //console.log(this.props.data);
        //console.log(this.props.data.x * this.scaleFactor)
        //console.log(this.props.data.y * this.scaleFactor)
        const bgImage = RNImage.resolveAssetSource(Utils.loadImage(this.props.data.image));
        let rectWidth = bgImage.width * this.scaleFactor * this.props.data.scale;
        let rectHeight = bgImage.height * this.scaleFactor * this.props.data.scale;
        let rect = {
            x: this.props.data.x * this.scaleFactor,
            y: this.props.data.y * this.scaleFactor,
            width: rectWidth,
            height: rectHeight
        }
        //console.log(bgImage)
        //console.log(this.state.x + ":" + this.state.y);
        if (this.props.data.status === "drawing") {
            return null;
        } else {
            return this.objectContainer(<Image
                x="0"
                y="0"
                width={bgImage.width * this.scaleFactor * this.props.data.scale}
                height={bgImage.height * this.scaleFactor * this.props.data.scale}
                href={Utils.loadImage(this.props.data.image)}
                onPress={() => this.objectOnPress()}
            />, rect)
        }
    }
}
export default Item;