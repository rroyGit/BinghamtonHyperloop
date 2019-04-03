import React from 'react';

class Temperature extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sensor1: [],
      sensor2: []
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  async onChange(event) {
    
    try {
      this.setState({ sensor1: [0,0,0,0,0,0,0,0,0,0] });
    }
    catch (err) {
      this.setState({ error: err.message || err.toString() });
    }
  }

  async onBlur(event) {
    console.log("temp blur");
  }

  async onSubmit(event) {
    console.log("temp submit");
  }

  render() {
    return <p> Temp </p>
  }

}

export default Temperature;
