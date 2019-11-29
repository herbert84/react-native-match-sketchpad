import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Svg, Image, Line as SvgLine, G, Rect } from 'react-native-svg';
import Background from "./Background";
import DrawLayer from "./DrawLayer";
import Item from "../element/Item";
import SketchpadObject from "./Object";
import StraightLine from "../element/StraightLine";
import CurvedLine from "../element/CurvedLine";
import Polygon from "../element/Polygon";
import SketchText from "../element/Text";
import Rectangle from "../element/Rectangle";
import Ellipse from "../element/Ellipse";

class Sketchpad extends Component {
    static propTypes = {
        width: PropTypes.string,
        height: PropTypes.string,
        bg: PropTypes.array,
        isEdit: PropTypes.bool,
        items: PropTypes.array
    };

    static defaultProps = {
        width: "100%",
        height: "100%",
        bg: [
            {
                "image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND",
                "scaleFactor": 1
            }
        ],
        isEdit: false,
        items: []
    };
    constructor(props) {
        super(props);
    }
    /**
     *
     * @description 按照不同的物体分类渲染物体
     * @memberof Sketchpad
     */
    renderItems() {
        let items = this.props.items;
        var a = [];
        for (var i in items) {
            //console.log(items[i])
            let item = this.getItem(items[i].className, items[i]);
            //console.log(item);
            a.push(item);
        }
        return a;
    }
    getItem(className, data) {
        let classNameArray = className.split(".");
        let itemName = classNameArray[classNameArray.length - 1];
        //console.log(itemName)
        let item = null;
        switch (itemName) {
            case "SketchpadNew": item = <DrawLayer data={data} />; break;
            case "SketchpadShape": item = <Item data={data} />; break;
            case "SketchpadStraightLine": item = <StraightLine data={data} />; break;
            case "SketchpadCurvedLine": item = <CurvedLine data={data} />; break;
            case "SketchpadText": item = <SketchText data={data} />; break;
            case "SketchpadPolygon": item = <Polygon data={data} />; break;
            case "SketchpadRectangle": item = <Rectangle data={data} />; break;
            case "SketchpadEllipse": item = <Ellipse data={data} />; break;
            default: item = <Item data={data} />; break;
        }
        return item;
    }
    render() {
        //alert(this.props.isEdit)
        //console.log("is edit:" + this.props.isEdit);
        // 计算PC端画布的长宽和手机端画布的长宽之间的换算比例,变量名参照PC端的代码取名为ScaleFactor
        SketchpadObject.prototype.scaleFactor = this.props.width === "100%" ? 400 / 1960 : this.props.width / 1960;
        SketchpadObject.prototype.isEdit = this.props.isEdit;
        //console.log(this.props.width + ":" + this.props.height);
        return (
            <Svg height={this.props.height} width={this.props.width}>
                <Background bg={this.props.bg} width={this.props.width} height={this.props.height} isEdit={this.props.isEdit} />
                {this.renderItems()}
            </Svg>
        )
    }
}
export default Sketchpad;