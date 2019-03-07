import React from 'react';

class SelectBox extends React.Component {
  render() {
    return (<select className="w-1/5 bg-grey-darkest text-white p-2 m-px" name={this.props.name}  onChange={this.props.handleChange}>
      {
        this.props.options.map(function(option, i) {
          return <option key={i} value={option}>{option}</option>
        })
      }
    </select>)
  }
}

export default SelectBox;
