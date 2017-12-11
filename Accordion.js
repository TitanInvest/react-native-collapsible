import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import Collapsible from './Collapsible';
import { ViewPropTypes } from './config';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

export default class Accordion extends Component {
  static propTypes = {
    sections: PropTypes.array.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    initiallyActiveSections: PropTypes.arrayOf(PropTypes.number),
    activeSections: PropTypes.arrayOf(PropTypes.number),
    underlayColor: PropTypes.string,
    touchableComponent: PropTypes.func,
    touchableProps: PropTypes.object,
  };

  static defaultProps = {
    underlayColor: 'black',
    touchableComponent: TouchableHighlight,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSections: props.initiallyActiveSections || [],
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.activeSections !== undefined) {
  //     this.setState({
  //       activeSection: nextProps.activeSections,
  //     });
  //   }
  // }

  _toggleSection(section) {
    const { activeSections } = this.state;
    const currentlyActive = activeSections.includes(section);
    if (currentlyActive) {
      const otherSections = activeSections.filter(a => a !== section);
      this.setState({ activeSections: otherSections });
    } else {
      activeSections.push(section);
      this.setState({ activeSections });
    }

    if (this.props.onChange) {
      this.props.onChange(activeSections);
    }
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};
    Object.keys(this.props).forEach(key => {
      if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.indexOf(key) !== -1) {
        viewProps[key] = this.props[key];
      }
    });

    const Touchable = this.props.touchableComponent;

    return (
      <View {...viewProps}>
        {this.props.sections.map((section, key) =>
          <View key={key}>
            <Touchable
              onPress={() => this._toggleSection(key)}
              underlayColor={this.props.underlayColor}
              {...this.props.touchableProps}
            >
              {this.props.renderHeader(
                section,
                key,
                this.state.activeSections.includes(key)
              )}
            </Touchable>
            <Collapsible
              collapsed={!this.state.activeSections.includes(key)}
              {...collapsibleProps}
            >
              {this.props.renderContent(
                section,
                key,
                this.state.activeSections.includes(key)
              )}
            </Collapsible>
          </View>
        )}
      </View>
    );
  }
}
