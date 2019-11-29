import { Platform, Dimensions } from "react-native";
import ImageList from "./ImageList";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
console.log("screenSize:" + deviceHeight + "/" + deviceWidth);
const Utils = {
    loadImage(className) {
        if (className) {
            let bgImageUrlArray = className.split("/");
            let bgImageUrl = bgImageUrlArray[bgImageUrlArray.length - 1];
            if (bgImageUrl === "SKETCHPAD_BACKGROUND") {
                return require("../images/field1.png");
            } else {
                let imageName = bgImageUrl.split(".");
                return ImageList[imageName[0]];
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
        return isIphoneX ? 44 : (needRotate) ? 0 : 20
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
    }
}

export default Utils;