
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Temperature from '../presentation/temperature.jsx';
import Tab from '../presentation/tab.jsx';
import Input from '../presentation/input.jsx';

/*************************** App Component ***************************/

class Model extends Component {

  constructor(props) {
    super(props);

    this.ws = props.ws;

    this.components = {
      Temperature: <Temperature app={this} key="temperature"/>,
    };

    this.selectTab = this.selectTab.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      selected: 'temperature',
      contentName: '',
    };
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  /** Set contentName and select content tab */
  setContentName(contentName) {
    this.setState({contentName, selected: 'content'});
  }

  selectTab(v) {
    this.setState({selected: v});
  }

  render() {
    const tabs = ['temperature'].map((k, i) => {
      let component = this.components[k];
      let label = k[0].toUpperCase() + k.substr(1);
    
      const isSelected = (this.state.selected === k);
      const tab = (
        <Tab component={component} key={k} tabId={k}
          label={label} index={i}
          selectTab={this.selectTab} isSelected={isSelected}/>
      );
      return tab;
    });
    const { selected } = this.state;
    return (
      <form id="article-form">
        <div className="tabs">{tabs}</div>
        <Input
          text="SEO title"
          label="seo_title"
          type="text"
          id="seo_title"
          value={selected}
          handleChange={this.handleChange}
        />
      </form>
    );
  }

}

export default Model;