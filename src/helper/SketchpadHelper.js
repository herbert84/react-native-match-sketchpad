const SketchpadHelper = {
	/**
     * 获取战术板的背景图片
     *
     * @memberof SketchpadHelper
     * @returns 背景图片数组,其中包含: 
     *   source: 图片的url,
     *   isHorizontal: 是否为横屏的标志位,
     *   data: 战术板的初始数据
     */
    getBackgroundImages: () => {
        return [
            {
                source: require("../images/field1.png"),
                isHorizontal: true,
                data: `{"background":[{"image":"/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND","scaleFactor":1}],"items":[]}`
            },
            {
                source: require("../images/field6.png"),
                isHorizontal: false,
                data: `{"background":[{"image":"/sap/sports/trm/ui/catalog/images/field6.png","scaleFactor":1}],"items":[]}`
            },
            {
                source: require("../images/field7.png"),
                isHorizontal: true,
                data: `{"background":[{"image":"/sap/sports/trm/ui/catalog/images/field7.png","scaleFactor":1}],"items":[]}`
            },
            {
                source: require("../images/field2.png"),
                isHorizontal: true,
                data: `{"background":[{"image":"/sap/sports/trm/ui/catalog/images/field2.png","scaleFactor":1}],"items":[]}`
            },
            {
                source: require("../images/field4.png"),
                isHorizontal: true,
                data: `{"background":[{"image":"/sap/sports/trm/ui/catalog/images/field4.png","scaleFactor":1}],"items":[]}`
            },
            {
                source: require("../images/field5.png"),
                isHorizontal: true,
                data: `{"background":[{"image":"/sap/sports/trm/ui/catalog/images/field5.png","scaleFactor":1}],"items":[]}`
            }
        ];
    }
}

export default SketchpadHelper;
