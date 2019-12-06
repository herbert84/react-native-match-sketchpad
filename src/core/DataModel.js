/**
 * 处理sketchpad item的数据模型
 *
 * @class DataModel
 */
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
                id: "__shape0-" + Utils.randomStringId(9),
                showSelection: true,
                rotation: 0,
                scale: 1,
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
                id: "__polygon0-" + Utils.randomStringId(9),
                width: 1,
                style: [],
                visible: true,
                z: 0,
                color: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                points: []
            }
        } else if (shape === "SketchpadRectangle") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadRectangle",
                status: "drawing",
                id: "__rectangle0-" + Utils.randomStringId(9),
                lineWidth: 1,
                width: 0,
                height: 0,
                style: [],
                visible: true,
                x: 0,
                y: 0,
                z: 0,
                color: "rgb(0, 0, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.6)"
            }
        } else if (shape === "SketchpadStraightLine") {
            newObject = {
                shape: item.shape,
                type: item.type,
                className: "sap.sports.ui.controls.sketchpad.SketchpadStraightLine",
                status: "drawing",
                id: "__line1-" + Utils.randomStringId(9),
                lineWidth: item.lineWidth || 1,
                style: item.style || [],
                visible: true,
                points: [0, 0, 0, 0],
                z: 0,
                color: "rgb(0, 109, 169)",
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
                id: "__line1-" + Utils.randomStringId(9),
                lineWidth: 1,
                style: item.style || [],
                visible: true,
                points: [],
                z: 0,
                color: "rgb(0, 0, 0)",
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
                id: "__line1-" + Utils.randomStringId(9),
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "rgb(0, 0, 0)",
                lineWidth: 1,
                height: 0,
                width: 0,
                x: 0,
                y: 0,
                z: 0,
                style: [],
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
            id: "__new-vb6ge30j",
            width: 1,
            style: [],
            visible: true,
            z: 0,
            color: "rgb(0, 0, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            points: [0, 0, canvasWidth, 0, canvasWidth, canvasHeight, 0, canvasHeight]
        }
    }
}
export default new DataModel();
