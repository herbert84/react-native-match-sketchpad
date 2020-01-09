'use strict';

import React, { Component } from "react";
import { StyleSheet, AppRegistry, DeviceEventEmitter, View, Animated, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window')

let keyValue = 0;
const rnmsLoadingKey = 'rnms-loading-key';

export default class RNMatchSketchpadTopView extends Component {
    static addContent(element) {
        let key = ++keyValue;
        DeviceEventEmitter.emit("addOverlay-Content", { key, element });
        return key;
    }

    static removeContent(key) {
        DeviceEventEmitter.emit("removeOverlay-Content", { key });
    }

    static removeAll() {
        DeviceEventEmitter.emit("removeAllOverlay-Content", {});
    }

    constructor(props) {
        super(props);
        this.state = {
            elements: [],
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
            scaleX: new Animated.Value(1),
            scaleY: new Animated.Value(1),
            contentElements: [],
        };
    }

    componentWillMount() {
        DeviceEventEmitter.addListener("addOverlay-Content", e => this.addContentToTopView(e));
        DeviceEventEmitter.addListener("removeOverlay-Content", (e) => this.removeContentFromTopView(e));
        DeviceEventEmitter.addListener("removeAllOverlay-Content", e => this.removeAll(e));
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners("addOverlay-Content");
        DeviceEventEmitter.removeAllListeners("removeOverlay-Content");
        DeviceEventEmitter.removeAllListeners("removeAllOverlay-Content");
    }

    removeContentFromTopView(e) {
        let { contentElements } = this.state;
        for (let i = contentElements.length - 1; i >= 0; --i) {
            if (contentElements[i].key === e.key) {
                contentElements.splice(i, 1);
                break;
            }
        }
        this.setState({ contentElements });
    }

    addContentToTopView(e) {
        let { contentElements } = this.state;
        contentElements.push(e);
        this.setState({ contentElements });
    }

    removeAll(e) {
        let { contentElements, elements } = this.state;
        this.setState({ contentElements: [], elements: [] });
    }

    transform(e) {
        let { translateX, translateY, scaleX, scaleY } = this.state;
        let { transform, animated, animatesOnly } = e;
        let tx = 0, ty = 0, sx = 1, sy = 1;
        transform.map(item => {
            if (item && typeof item === 'object') {
                for (let name in item) {
                    let value = item[name];
                    switch (name) {
                        case 'translateX': tx = value; break;
                        case 'translateY': ty = value; break;
                        case 'scaleX': sx = value; break;
                        case 'scaleY': sy = value; break;
                    }
                }
            }
        });
        if (animated) {
            let animates = [
                Animated.spring(translateX, { toValue: tx, friction: 9 }),
                Animated.spring(translateY, { toValue: ty, friction: 9 }),
                Animated.spring(scaleX, { toValue: sx, friction: 9 }),
                Animated.spring(scaleY, { toValue: sy, friction: 9 }),
            ];
            animatesOnly ? animatesOnly(animates) : Animated.parallel(animates).start();
        } else {
            if (animatesOnly) {
                let animates = [
                    Animated.timing(translateX, { toValue: tx, duration: 1 }),
                    Animated.timing(translateY, { toValue: ty, duration: 1 }),
                    Animated.timing(scaleX, { toValue: sx, duration: 1 }),
                    Animated.timing(scaleY, { toValue: sy, duration: 1 }),
                ];
                animatesOnly(animates);
            } else {
                translateX.setValue(tx);
                translateY.setValue(ty);
                scaleX.setValue(sx);
                scaleY.setValue(sy);
            }
        }

    }

    restore(e) {
        let { translateX, translateY, scaleX, scaleY } = this.state;
        let { animated, animatesOnly } = e;
        if (animated) {
            let animates = [
                Animated.spring(translateX, { toValue: 0, friction: 9 }),
                Animated.spring(translateY, { toValue: 0, friction: 9 }),
                Animated.spring(scaleX, { toValue: 1, friction: 9 }),
                Animated.spring(scaleY, { toValue: 1, friction: 9 }),
            ];
            animatesOnly ? animatesOnly(animates) : Animated.parallel(animates).start();
        } else {
            if (animatesOnly) {
                let animates = [
                    Animated.timing(translateX, { toValue: 0, duration: 1 }),
                    Animated.timing(translateY, { toValue: 0, duration: 1 }),
                    Animated.timing(scaleX, { toValue: 1, duration: 1 }),
                    Animated.timing(scaleY, { toValue: 1, duration: 1 }),
                ];
                animatesOnly(animates);
            } else {
                translateX.setValue(0);
                translateY.setValue(0);
                scaleX.setValue(1);
                scaleY.setValue(1);
            }
        }
    }

    render() {
        let { elements, contentElements, translateX, translateY, scaleX, scaleY } = this.state;
        let transform = [{ translateX }, { translateY }, { scaleX }, { scaleY }];
        return (
            <View style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, transform: transform }}>
                    {this.props.children}
                </Animated.View>
                {
                    elements.length > 0 || contentElements.length > 0 ?
                        <View style={styles.overlayContainer} pointerEvents={'box-none'} >
                            {
                                contentElements.map((item, index) => {
                                    // 同一时刻只加载elements中最后一个element
                                    //if (index == contentElements.length - 1) {
                                    return (
                                        <View key={'RRCTopView_Content' + item.key} style={styles.overlay} pointerEvents={'box-none'} >
                                            {item.element}
                                        </View>
                                    );
                                    //} else {
                                    //    return null;
                                    //}
                                })
                            }
                        </View>
                        : null
                }
            </View>
        );
    }
}

var styles = StyleSheet.create({
    overlayContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        position: 'absolute',
    }
});