import React, { Component } from "react";
import {
    View,
    Dimensions,
} from 'react-native';
import RNMatchSketchpadTopView from './TopView';
const { width, height } = Dimensions.get('window')

export default class ModalContainer {
    static show(content) {
        const contentView = (
            <View style={{ width, height, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,1)', justifyContent: 'center', alignItems: 'center' }}>
                {content}
            </View>
        )
        return RNMatchSketchpadTopView.addContent(contentView);
    }

    static transformRoot(transform, animated, animatesOnly = null) {
        RNMatchSketchpadTopView.transform(transform, animated, animatesOnly);
    }

    static restoreRoot(animated, animatesOnly = null) {
        RNMatchSketchpadTopView.restore(animated, animatesOnly);
    }
}