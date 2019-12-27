import { Platform, Dimensions } from "react-native";
import * as _ from "lodash";
import { zh } from "../i18n/zh";
import { en } from "../i18n/en";
import ImageList from "./ImageList";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
console.log("screenSize:" + deviceHeight + "/" + deviceWidth);
const Utils = {
    loadImage(className, isMirror = false) {
        if (className) {
            let bgImageUrlArray = className.split("/");
            let bgImageUrl = bgImageUrlArray[bgImageUrlArray.length - 1];
            if (bgImageUrl === "SKETCHPAD_BACKGROUND") {
                return require("../images/field1.png");
            } else {
                let imageName = bgImageUrl.split(".");
                return isMirror ? ImageList[imageName[0] + "_m"] : ImageList[imageName[0]];
            }
        } else {
            return require("../images/field1.png");
        }
    },
    canvasNeedRotate(width, height) {
        return width > height ? true : false;
    },
    isIphoneX() {
        return Platform.OS === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
    },
    /**
     *
     * @description 是否需要旋转屏幕而计算状态栏距离，如果是需要旋转的，此时如果不是异形屏则不需要有间距
     * @param {*} needRotate 当前是否旋转屏幕
     * @returns
     */
    isIPhoneXPaddTop(needRotate) {
        let isIphoneX = Platform.OS === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
        if (needRotate) {
            return (isIphoneX) ? 44 : 0
        } else {
            return (isIphoneX) ? 44 : (Platform.OS === "android") ? 0 : 20
        }
    },
    getPhoneTopDistance() {
        let isIphoneX = Platform.OS === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
        return isIphoneX ? 44 : (Platform.OS === "android") ? 0 : 20
    },
    getPhoneBottomDistance() {
        let isIphoneX = Platform.OS === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
        return isIphoneX ? 34 : 0
    },
    getAvailableZone() {
        let isIphoneX = Platform.OS === "ios" && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);
        return isIphoneX ? deviceHeight - 44 - 34 : deviceHeight;
    },
    randomStringId(n) {
        let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
        let tmp = '',
            i = 0,
            l = str.length;
        for (i = 0; i < n; i++) {
            tmp += str.charAt(Math.floor(Math.random() * l));
        }
        return tmp;
    },
    getItemType(data) {
        let classNameArray = data.className.split(".");
        return classNameArray[classNameArray.length - 1];
    },
    /**
     *
     * @description 两个元素换位子
     * @param {*} arr
     * @param {*} index1
     * @param {*} index2
     * @returns
     */
    swapArr(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    getObjectRectSize(points) {
        if (!points || points.length === 0) {
            return { width: 0, height: 0 };
        }
        let pointsArray = [];
        for (var i = 0; i < points.length - 1; i += 2) {
            pointsArray.push({ x: points[i], y: points[i + 1] })
        }
        let maxXPoint = _.maxBy(pointsArray, 'x');
        let maxYPoint = _.maxBy(pointsArray, 'y');
        let minXPoint = _.minBy(pointsArray, 'x');
        let minYPoint = _.minBy(pointsArray, 'y');

        return {
            x: minXPoint.x,
            y: minYPoint.y,
            width: maxXPoint.x - minXPoint.x,
            height: maxYPoint.y - minYPoint.y
        }
    },
    movePoints(points, moveX, moveY) {
        let pointsArray = [];
        let newPoints = [];
        for (var i = 0; i < points.length - 1; i += 2) {
            pointsArray.push({ x: points[i], y: points[i + 1] })
        }
        for (var i in pointsArray) {
            newPoints.push(pointsArray[i].x + moveX);
            newPoints.push(pointsArray[i].y + moveY);
        }
        return newPoints;
    },
    getTranslatedText(type, key, language) {
        return language.indexOf("zh") > -1 ? zh[type][key] : en[type][key];
    },
    getOffsetX(bgImage) {
        //竖屏模式要计算偏移量
        if (bgImage === "/sap/sports/trm/ui/catalog/images/field6.png") {
            return (1960 - 798.46) / 2;
        }
        return 0;
    },
    /**
     *
     * @description 在打开战术板时部分图形按照一定放大比例放大。保存数据时按照一定比例缩小
     * @param {*} item
     * @param {*} scaleType 当前需要放大尺寸还是缩小尺寸
     * @returns
     */
    dataScale(item, scaleType) {
        let classNameArray = item.className.split(".");
        let type = classNameArray[classNameArray.length - 1];
        let scale = this.getScaleNum(type, item.image);
        return (scaleType === "reduce") ? item.scale / scale : item.scale * scale;
    },
    getScaleNum(shape, type) {
        let regPlayer = /^(red|blue|yellow|green)[1-6].png$/;
        switch (shape) {
            case "SketchpadText": scale = Math.pow(1.1, 5); break;
            case "SketchpadShape":
                if (type.indexOf("football.png") > -1 || type.indexOf("medicine_ball.png") > -1) {
                    scale = Math.pow(1.1, 15);
                } else if (type.indexOf("coordination_ladder") > -1 || type.indexOf("goal") > -1 || type.indexOf("gymnastics_box") > -1) {
                    scale = 1;
                } else if (regPlayer.test(type)) {
                    scale = Math.pow(1.1, 5);
                } else {
                    scale = Math.pow(1.1, 10);
                }
                break;
            default: scale = 1; break;
        }
        return scale;
    },
    getDefaultScaleValue(shape, type) {
        let regPlayer = /^(red|blue|yellow|green)[1-6].png$/;
        let defaultValue = 1;
        if (shape === "SketchpadShape") {
            if (type.indexOf("medicine_ball") > -1 || type.indexOf("football") > -1) {
                defaultValue = 0.08;
            } else if (type.indexOf("goal1.png") > -1 || type.indexOf("goal3.png") > -1) {
                defaultValue = 0.4;
            } else if (type.indexOf("goal2.png") > -1) {
                defaultValue = 0.7;
            } else if (type.indexOf("flag.png") > -1 || type.indexOf("pole") > -1 || type.indexOf("gymnastics_box") > -1) {
                defaultValue = 0.2;
            } else if (type.indexOf("coordination_ladder2.png") > -1 || type.indexOf("opponent") > -1) {
                defaultValue = 0.25;
            } else if (regPlayer.test(type)) {
                defaultValue = 0.3;
            } else {
                defaultValue = 0.15;
            }
        }
        return defaultValue;
    },
    /**
     * 当PC端的数据显示到APP端，或者APP端的数据回写到PC端时，对数据的坐标偏移量和放大倍率进行重新计算，以确保两边数据能够正确显示
     *
     * @param {*} items sketchpad的数据内容
     * @param {*} offsetX 竖屏模式下X坐标的偏移量，PC端显示到APP端时应为正值，APP端回写到PC端是应为负值，横屏模式下应为0
     * @param {*} scaleType 倍率缩放的类型，PC端显示到APP端时应为 "enlarge"，APP端回写到PC端是应为 "reduce"
     * @returns
     */
    recalculateItems(items, offsetX, scaleType) {
        let newItems = [];
        for (var i in items) {
            let newItem = JSON.parse(JSON.stringify(items[i]));
            let classNameArray = newItem.className.split(".");
            let shape = classNameArray[classNameArray.length - 1];
            //处理points数组中的X坐标
            if (newItem.points) {
                for (let i = 0; i < newItem.points.length - 1; i += 2) {
                    newItem.points[i] = newItem.points[i] - offsetX;
                }
            }
            if (newItem.scale) {
                newItem.scale = this.dataScale(newItem, scaleType);
            }
            if (newItem.x) {
                newItem.x = newItem.x - offsetX;
            }
            // SketchpadShape 类型的item,需要将xy坐标舍入为int
            if (shape === "SketchpadShape") {
                newItem.x = Math.round(newItem.x);
                newItem.y = Math.round(newItem.y);
            }
            newItems.push(newItem)
        }
        return newItems;
    }
}

export default Utils;
