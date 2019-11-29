import React, { Component } from 'react';
import { View, Text } from "react-native";
import PropTypes from 'prop-types';
import Container from "react-native-match-sketchpad/src/core/Container";

class Sketchpad extends Component {
    static propTypes = {
        fullMode: PropTypes.bool, // "true/false"
        renderTools: PropTypes.bool, // true/false,
        isEditable: PropTypes.bool,
        data: PropTypes.string
    };

    static defaultProps = {
        fullMode: false,
        renderTools: false,
        isEditable: false,
        data: '{"background": [{"image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND","scaleFactor": 1}],"items": []}'
    };
    constructor(props) {
        super(props);
    }
    /**
     *
     * @description 渲染草图的编辑工作条，包含复制，删除按钮
     * @returns 
     * @memberof Sketchpad
     */
    renderTools() {
        return (this.props.renderTools && !this.props.fullMode) ? (<View><Text>Render Edit Tools</Text></View>) : null;
    }
    render() {
        return (<View>
            <Container data={this.props.data} fullMode={this.props.fullMode} isEditable={this.props.isEditable} width={this.props.width} />
            {this.renderTools()}
        </View>)
    }
}

export default Sketchpad;
