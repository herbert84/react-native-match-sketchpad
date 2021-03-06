import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Image as RNImage, Platform,
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
            height: rectHeight,
            rotation: this.props.data.rotation
        }
        //console.log(bgImage)
        //console.log(this.state.x + ":" + this.state.y);
        if (this.props.data.status === "drawing") {
            return null;
        } else {
            let result = [];
            result.push(<Image
                x="0"
                y="0"
                width={bgImage.width * this.scaleFactor * this.props.data.scale}
                height={bgImage.height * this.scaleFactor * this.props.data.scale}
                href={Utils.loadImage(this.props.data.image, this.props.data.mirror)}
                onPress={() => this.objectOnPress()}
            />)
            result.push(<Rect x="0"
                y="0"
                width={rectWidth}
                height={rectHeight}
                fill="none"
                fillOpacity="0.1"
                stroke="none"
                strokeWidth="1"
                strokeOpacity="0.1"
                onPress={() => this.objectOnPress()}></Rect>);
            if (Platform.OS === "ios") {
                return this.objectContainer(result, rect)
            } else {
                return this.objectContainer(<Image
                    x="0"
                    y="0"
                    width={bgImage.width * this.scaleFactor * this.props.data.scale}
                    height={bgImage.height * this.scaleFactor * this.props.data.scale}
                    href={Utils.loadImage(this.props.data.image, this.props.data.mirror)}
                    onPress={() => this.objectOnPress()}
                />, rect)
            }
        }
    }
}
export default Item;