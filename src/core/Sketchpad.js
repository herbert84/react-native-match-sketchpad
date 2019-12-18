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
        items: PropTypes.array,
        selectedId: PropTypes.string
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
        items: [],
        selectedId: ""
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
            case "SketchpadNew": item = <DrawLayer data={data} attachObjectEvent={(object) => this.attachObjectEvent(object)} attachAddPathEvent={(object) => this.attachAddPathEvent(object)} />; break;
            case "SketchpadShape": item = <Item data={data} selectedId={this.props.selectedId} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            case "SketchpadStraightLine": item = <StraightLine selectedId={this.props.selectedId} data={data} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            case "SketchpadCurvedLine": item = <CurvedLine selectedId={this.props.selectedId} data={data} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            case "SketchpadText":
                item = <SketchText
                    data={data}
                    selectedId={this.props.selectedId}
                    attachObjectEvent={(object) => this.attachObjectEvent(object)}
                    onTextLayout={(layout) => this.props.onTextItemLayout ? this.props.onTextItemLayout(data, layout) : null} />;
                break;
            case "SketchpadPolygon": item = <Polygon data={data} selectedId={this.props.selectedId} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            case "SketchpadRectangle": item = <Rectangle data={data} selectedId={this.props.selectedId} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            case "SketchpadEllipse": item = <Ellipse data={data} selectedId={this.props.selectedId} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
            default: item = <Item data={data} selectedId={this.props.selectedId} attachObjectEvent={(object) => this.attachObjectEvent(object)} />; break;
        }
        return item;
    }
    attachObjectEvent(object) {
        this.props.attachObjectEvent && this.props.attachObjectEvent(object);
    }
    attachAddPathEvent(object) {
        this.props.attachAddPathEvent && this.props.attachAddPathEvent(object);
    }
    render() {
        // 计算PC端画布的长宽和手机端画布的长宽之间的换算比例,变量名参照PC端的代码取名为ScaleFactor
        //let originSketchHeight = 1251;
        //let originSketchWidth = this.props.isPortrait ? 1960 : 798;
        //let scaleFactor = this.props.width === "100%" ? 400 / originSketchWidth : this.props.width / originSketchWidth;
        let originSketchHeight = 1251;
        let scaleFactor = this.props.height / originSketchHeight;
        SketchpadObject.prototype.scaleFactor = scaleFactor;
        SketchpadObject.prototype.isEdit = this.props.isEdit;
        return (
            <Svg
                ref={ref => this.props.onSvgRef(ref)}
                height={this.props.height}
                width={this.props.width}>
                <Background bg={this.props.bg} width={this.props.width} height={this.props.height} isEdit={this.props.isEdit} attachObjectEvent={(object) => this.attachObjectEvent(object)} />
                {this.renderItems()}
            </Svg>
        )
    }
}
export default Sketchpad;
