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
    recalculateItems(items, offsetX) {
        let newItems = [];
        for (var i in items) {
            let newItem = JSON.parse(JSON.stringify(items[i]));
            //处理points数组中的X坐标
            if (newItem.points) {
                for (let i = 0; i < newItem.points.length - 1; i += 2) {
                    newItem.points[i] = newItem.points[i] - offsetX;
                }
            }
            if (newItem.x) {
                newItem.x = newItem.x - offsetX;
            }
            newItems.push(newItem)
        }
        return newItems;
    }
}

export default Utils;