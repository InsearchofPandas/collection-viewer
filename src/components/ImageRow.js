import React from 'react';

class ImageRow extends React.Component {
render() {
  const images = this.props.images
  if (!images) { return null; }

  return (

    <div>
      <div className="flex justify-center">
        <div className=''>
        <img src={this.props.images[0]} />
        <img className="mx-10" src={this.props.images[1]} />
        <img src={this.props.images[2]} />
        </ div>
      </div>
    </div>
  )
}
}

export default ImageRow;
