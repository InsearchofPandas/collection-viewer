import React from 'react';

class ImageColumn extends React.Component {
render() {
  const images = this.props.images
  if (!images) { return null; }

  return (

    <div className="w-1/4 mx-3">
        {images.map(image => <img className="my-3" key={image.id} src={image.image} />)}
    </div>
  )
}
}

export default ImageColumn;
