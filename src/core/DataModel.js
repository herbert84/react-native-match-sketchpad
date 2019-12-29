/**
 * 处理sketchpad item的数据模型
 *
 * @class DataModel
 */
import { Image as RNImage } from "react-native";
import Utils from "./Utils";

class DataModel {
    addObject(item) {
        let shape = item.shape;
        let newObject = {};
        if (shape === "SketchpadShape") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadShape",
                status: "drawing",
                id: "__shape-" + Utils.randomStringId(9),
                showSelection: true,
                rotation: 0,
                scale: Utils.getDefaultScaleValue(item.shape, item.type) * Utils.getScaleNum(item.shape, item.type),
                mirror: false,
                visible: true,
                x: 0,
                y: 0,
                z: 0,
                image: item.type
            }
        } else if (shape === "SketchpadPolygon") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadPolygon",
                status: "drawing",
                id: "__polygon-" + Utils.randomStringId(9),
                width: 1,
                style: [],
                visible: true,
                z: 0,
                color: item.color,
                backgroundColor: item.backgroundColor,
                points: []
            }
        } else if (shape === "SketchpadRectangle") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadRectangle",
                status: "drawing",
                id: "__rectangle-" + Utils.randomStringId(9),
                lineWidth: 1,
                width: 0,
                height: 0,
                style: [],
                visible: true,
                x: 0,
                y: 0,
                z: 0,
                color: item.color,
                backgroundColor: item.backgroundColor,
            }
        } else if (shape === "SketchpadStraightLine") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadStraightLine",
                status: "drawing",
                id: "__line-" + Utils.randomStringId(9),
                lineWidth: item.lineWidth || 1,
                style: item.style || [],
                visible: true,
                points: [-30, -30, -30, -30],
                z: 0,
                color: item.color,
                startArrow: item.startArrow || false,
                endArrow: item.endArrow || false,
                arrowLength: 15
            }
        } else if (shape === "SketchpadCurvedLine") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadCurvedLine",
                status: "drawing",
                id: "__line-" + Utils.randomStringId(9),
                lineWidth: 1,
                style: item.style || [],
                visible: true,
                points: [],
                z: 0,
                color: item.color,
                startArrow: item.startArrow || false,
                endArrow: item.endArrow || false,
                arrowLength: 15
            }
        } else if (shape === "SketchpadEllipse") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadEllipse",
                status: "drawing",
                id: "__ellipse-" + Utils.randomStringId(9),
                backgroundColor: item.backgroundColor,
                color: item.color,
                lineWidth: 1,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
                z: 0,
                style: [],
                visible: true
            }
        } else if (shape === "SketchpadText") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadText",
                status: "drawing",
                id: "__text-" + Utils.randomStringId(9),
                color: item.color,
                text: "",
                height: 12,
                x: 0,
                y: 0,
                z: 0,
                textStyle: "",
                showSelection: true,
                showIcons: false,
                scale: Utils.getDefaultScaleValue(item.shape, item.type) * Utils.getScaleNum(item.shape, item.type),
                textAlign: "Begin",
                verticalAlign: "Bottom",
                font: "Arial",
                visible: true
            }
        }
        return newObject;
    }
    addDrawLayerData(item, canvasWidth, canvasHeight) {
        return {
            className: "sap.sports.ui.controls.sketchpad.SketchpadNew",
            status: "new",
            shape: item.shape,
            type: item.type,
            data: item,
            id: "__new-" + Utils.randomStringId(9),
            width: 1,
            style: [],
            visible: true,
            z: 0,
            color: item.color || "rgb(0, 0, 0)",
            backgroundColor: item.backgroundColor || "rgba(0, 0, 0, 0.6)",
            points: [0, 0, canvasWidth, 0, canvasWidth, canvasHeight, 0, canvasHeight]
        }
    }
    duplicateObject(item) {
        let newObject = JSON.parse(JSON.stringify(item));
        let shape = Utils.getItemType(item);
        switch (shape) {
            case "SketchpadShape":
                const bgImage = RNImage.resolveAssetSource(Utils.loadImage(item.image));
                let width = bgImage.width;
                let height = bgImage.height;
                newObject.id = "__shape-" + Utils.randomStringId(9);
                newObject.x += width / 2 * item.scale;
                newObject.y += height / 2 * item.scale;
                break;
            case "SketchpadRectangle":
                newObject.id = "__rectangle-" + Utils.randomStringId(9);
                newObject.x += newObject.width / 2;
                newObject.y += newObject.height / 2;
                break;
            case "SketchpadEllipse":
                newObject.id = "__ellipse-" + Utils.randomStringId(9);
                newObject.x += newObject.width / 2;
                newObject.y += newObject.height / 2;
                break;
            case "SketchpadPolygon":
                newObject.id = "__polygon-" + Utils.randomStringId(9);
                let rectPolygonObject = Utils.getObjectRectSize(newObject.points);
                newObject.points = Utils.movePoints(newObject.points, rectPolygonObject.width / 2, rectPolygonObject.height / 2);
                break;
            case "SketchpadStraightLine":
            case "SketchpadCurvedLine":
                newObject.id = "__line-" + Utils.randomStringId(9);
                let rectObject = Utils.getObjectRectSize(newObject.points);
                newObject.points = Utils.movePoints(newObject.points, rectObject.width / 2, rectObject.height / 2);
                break;
            case "SketchpadText":
                newObject.id = "__text-" + Utils.randomStringId(9);
                newObject.x += 50;
                newObject.y += newObject.height / 2;
                break;
            default: break;
        }
        return newObject;
    }
    /**
     * 由于战术板在PC端的实现方式是：无论选择横屏还是竖屏的背景尺寸，画布区域的长宽始终都是 1960 x 1251；
     * 而在APP端，战术板横屏模式的长宽是 1960 x 1251，而竖屏模式的长宽则为 800 x 1251
     * 因此当PC端的数据在APP端展示的时候，需要考虑竖屏模式下的X轴上的偏移量，以确保图形能够在背景图片的相对位置上正确显示
     *
     * @memberof DataModel
     */
    getOffsetX(bgImage) {
        //竖屏模式要计算偏移量
        if (bgImage === "/sap/sports/trm/ui/catalog/images/field6.png") {
            return (1960 - 798.46) / 2;
        }
        return 0;
    }
    /**
     * 根据X轴的偏移量重新计算item的坐标
     *
     * @memberof DataModel
     */
    recalculateItem(item, offsetX) {
        //copy一个新的对象来存放item
        let newItem = JSON.parse(JSON.stringify(item));
        //处理points数组中的X坐标
        if (newItem.points) {
            for (let i = 0; i < newItem.points.length - 1; i += 2) {
                newItem.points[i] = newItem.points[i] - offsetX;
            }
        }
        if (newItem.x) {
            newItem.x = newItem.x - offsetX;
        }
        return newItem;
    }
    recalculateItems(items, offsetX) {
        let newItems = [];
        for (var i in items) {
            let newItem = JSON.parse(JSON.stringify(item));
            //处理points数组中的X坐标
            if (newItem.points) {
                for (let i = 0; i < newItem.points.length - 1; i += 2) {
                    newItem.points[i] = newItem.points[i] - offsetX;
                }
            }
            if (newItem.x) {
                newItem.x = newItem.x - offsetX;
            }
            newItems.push(items[i])
        }
        return newItems;
    }
}
export default new DataModel();
