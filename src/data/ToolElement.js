const ToolElementItems = [{
    "title": "元素",
    "showTitle": true,
    "key": "ELEMENT",
    "image": "tool",
    "nodes": [
        {
            "title": "元素",
            "showTitle": true,
            "key": "ELEMENT",
            "image": "tool"
        },
        {
            "title": "线条",
            "key": "LINE",
            "image": "toolLine",
            "nodes": [
                {
                    "title": "单直线",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "image": "simpleLine"
                },
                {
                    "title": "单直线带开始箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "startArrow": true,
                    "image": "simpleLineStartArrow"
                },
                {
                    "title": "单直线带结束箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "endArrow": true,
                    "image": "simpleLineEndArrow"
                },
                {
                    "title": "单直线带双箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "startArrow": true,
                    "endArrow": true,
                    "image": "simpleLineBothArrow"
                },
                {
                    "title": "单直线虚线",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "style": [4],
                    "image": "simpleDashLine"
                },
                {
                    "title": "单直线虚线带开始箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "style": [4],
                    "startArrow": true,
                    "image": "simpleDashLineStartArrow"
                },
                {
                    "title": "单直线虚线带结束箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "endArrow": true,
                    "style": [4],
                    "image": "simpleDashLineEndArrow"
                },
                {
                    "title": "单直线虚线带双箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "simple",
                    "startArrow": true,
                    "endArrow": true,
                    "style": [4],
                    "image": "simpledashLineBothArrow"
                },
                {
                    "title": "曲线",
                    "shape": "SketchpadCurvedLine",
                    "image": "curvedLine"
                },
                {
                    "title": "曲线带开始箭头",
                    "shape": "SketchpadCurvedLine",
                    "startArrow": true,
                    "image": "curvedLineStartArrow"
                },
                {
                    "title": "曲线带结束箭头",
                    "shape": "SketchpadCurvedLine",
                    "endArrow": true,
                    "image": "curvedLineEndArrow"
                },
                {
                    "title": "曲线带双箭头",
                    "shape": "SketchpadCurvedLine",
                    "startArrow": true,
                    "endArrow": true,
                    "image": "curvedLineBothArrow"
                },
                {
                    "title": "曲线虚线",
                    "shape": "SketchpadCurvedLine",
                    "style": [4],
                    "image": "curvedDashLine"
                },
                {
                    "title": "曲线虚线带开始箭头",
                    "shape": "SketchpadCurvedLine",
                    "style": [4],
                    "startArrow": true,
                    "image": "curvedDashLineStartArrow"
                },
                {
                    "title": "曲线虚线带结束箭头",
                    "shape": "SketchpadCurvedLine",
                    "style": [4],
                    "endArrow": true,
                    "image": "curvedDashLineEndArrow"
                },
                {
                    "title": "曲线虚线带双箭头",
                    "shape": "SketchpadCurvedLine",
                    "style": [4],
                    "startArrow": true,
                    "endArrow": true,
                    "image": "curvedDashLineBothArrow"
                },
                {
                    "title": "波浪线",
                    "shape": "SketchpadStraightLine",
                    "type": "sinus",
                    "image": "sinusLine"
                },
                {
                    "title": "波浪线带开始箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "sinus",
                    "startArrow": true,
                    "image": "sinusLineStartArrow"
                },
                {
                    "title": "波浪线带结束箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "sinus",
                    "endArrow": true,
                    "image": "sinusLineEndArrow"
                },
                {
                    "title": "波浪线带双箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "sinus",
                    "startArrow": true,
                    "endArrow": true,
                    "image": "sinusLineBothArrow"
                },
                {
                    "title": "单直线粗线",
                    "shape": "SketchpadStraightLine",
                    "lineWidth": 3,
                    "type": "simple",
                    "image": "boldLine"
                },
                {
                    "title": "单直线粗线带开始箭头",
                    "shape": "SketchpadStraightLine",
                    "lineWidth": 3,
                    "type": "simple",
                    "startArrow": true,
                    "image": "boldLineStartArrow"
                },
                {
                    "title": "单直线粗线带结束箭头",
                    "shape": "SketchpadStraightLine",
                    "lineWidth": 3,
                    "type": "simple",
                    "endArrow": true,
                    "image": "boldLineEndArrow"
                },
                {
                    "title": "单直线粗线带双箭头",
                    "shape": "SketchpadStraightLine",
                    "lineWidth": 3,
                    "type": "simple",
                    "startArrow": true,
                    "endArrow": true,
                    "image": "boldLineBothArrow"
                },
                {
                    "title": "双直线",
                    "shape": "SketchpadStraightLine",
                    "type": "double",
                    "image": "doubleLine"
                },
                {
                    "title": "双直线带开始箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "double",
                    "startArrow": true,
                    "image": "doubleLineStartArrow"
                },
                {
                    "title": "双直线带结束箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "double",
                    "endArrow": true,
                    "image": "doubleLineEndArrow"
                },
                {
                    "title": "双直线带双箭头",
                    "shape": "SketchpadStraightLine",
                    "type": "double",
                    "startArrow": true,
                    "endArrow": true,
                    "image": "doubleLineBothArrow"
                }
            ]
        },
        {
            "title": "区域",
            "key": "AREAS",
            "image": "toolArea",
            "nodes": [
                {
                    "title": "自由多边形",
                    "shape": "SketchpadPolygon",
                    "key": "POLYGON",
                    "image": {
                        "Vertical": "polygonVertical",
                        "Horizontal": "polygonHorizontal"
                    }
                },
                {
                    "title": "矩形",
                    "shape": "SketchpadRectangle",
                    "key": "RECTANGLE",
                    "image": {
                        "Vertical": "rectangleVertical",
                        "Horizontal": "rectangleHorizontal"
                    }
                },
                {
                    "title": "椭圆形",
                    "shape": "SketchpadEllipse",
                    "key": "CYCLE",
                    "image": {
                        "Vertical": "ellipseVertical",
                        "Horizontal": "ellipseHorizontal"
                    }
                }
            ]
        },
        {
            "title": "文字",
            "key": "SketchpadText",
            "shape": "SketchpadText",
            "image": "toolFont",
        },
        {
            "title": "球员",
            "key": "PLAYERS",
            "image": "toolPlayer",
            "nodes": [
                {
                    "title": "球员1",
                    "type": "/sap/sports/trm/ui/catalog/images/red1.png",
                    "image": "red1",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员2",
                    "type": "/sap/sports/trm/ui/catalog/images/red2.png",
                    "image": "red2",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员3",
                    "type": "/sap/sports/trm/ui/catalog/images/red3.png",
                    "image": "red3",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员1",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow1.png",
                    "image": "yellow1",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员2",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow2.png",
                    "image": "yellow2",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员3",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow3.png",
                    "image": "yellow3",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员1",
                    "type": "/sap/sports/trm/ui/catalog/images/green1.png",
                    "image": "green1",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员2",
                    "type": "/sap/sports/trm/ui/catalog/images/green2.png",
                    "image": "green2",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员3",
                    "type": "/sap/sports/trm/ui/catalog/images/green3.png",
                    "image": "green3",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员1",
                    "type": "/sap/sports/trm/ui/catalog/images/blue1.png",
                    "image": "blue1",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员2",
                    "type": "/sap/sports/trm/ui/catalog/images/blue2.png",
                    "image": "blue2",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员3",
                    "type": "/sap/sports/trm/ui/catalog/images/blue3.png",
                    "image": "blue3",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员4",
                    "type": "/sap/sports/trm/ui/catalog/images/red4.png",
                    "image": "red4",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员5",
                    "type": "/sap/sports/trm/ui/catalog/images/red5.png",
                    "image": "red5",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员6",
                    "type": "/sap/sports/trm/ui/catalog/images/red6.png",
                    "image": "red6",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员4",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow4.png",
                    "image": "yellow4",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员5",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow5.png",
                    "image": "yellow5",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员6",
                    "type": "/sap/sports/trm/ui/catalog/images/yellow6.png",
                    "image": "yellow6",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员4",
                    "type": "/sap/sports/trm/ui/catalog/images/green4.png",
                    "image": "green4",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员5",
                    "type": "/sap/sports/trm/ui/catalog/images/green5.png",
                    "image": "green5",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员6",
                    "type": "/sap/sports/trm/ui/catalog/images/green6.png",
                    "image": "green6",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员4",
                    "type": "/sap/sports/trm/ui/catalog/images/blue4.png",
                    "image": "blue4",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员5",
                    "type": "/sap/sports/trm/ui/catalog/images/blue5.png",
                    "image": "blue5",
                    "shape": "SketchpadShape"
                },
                {
                    "title": "球员6",
                    "type": "/sap/sports/trm/ui/catalog/images/blue6.png",
                    "image": "blue6",
                    "shape": "SketchpadShape"
                }
            ]
        },
        {
            "title": "物品",
            "key": "FIELDITEMS",
            "image": "toolFieldItem",
            "nodes": [
                {
                    "type": "/sap/sports/trm/ui/catalog/images/football.png",
                    "image": "football",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/medicine_ball.png",
                    "image": "medicineBall",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/opponent.png",
                    "image": "opponent",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/goal2.png",
                    "image": "goal2",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/goal3.png",
                    "image": "goal3",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/pole_red.png",
                    "image": "poleRed",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_blue_big.png",
                    "image": "coneBlueBig",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_blue.png",
                    "image": "coneBlue",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_red_big.png",
                    "image": "coneRedBig",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_grey_big.png",
                    "image": "coneGreyBig",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cross.png",
                    "image": "cross",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/coordination_ladder2.png",
                    "image": "coordinationLadder2",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/gymnastics_box.png",
                    "image": "gymnasticsBox",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/obstacle.png",
                    "image": "obstacle",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/goal1.png",
                    "image": "goal1",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/pole_black.png",
                    "image": "poleBlack",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/flag.png",
                    "image": "flag",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/circle.png",
                    "image": "circle",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_red.png",
                    "image": "coneRed",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_yellow_big.png",
                    "image": "coneYellowBig",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_yellow.png",
                    "image": "coneYellow",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/cone_grey.png",
                    "image": "coneGrey",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/triangle.png",
                    "image": "triangle",
                    "shape": "SketchpadShape"
                },
                {
                    "type": "/sap/sports/trm/ui/catalog/images/coordination_ladder1.png",
                    "image": "coordinationLadder1",
                    "shape": "SketchpadShape"
                }
            ]
        }]
}];
export default ToolElementItems;
