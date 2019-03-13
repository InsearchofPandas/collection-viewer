import React from 'react';

class ImageColumn extends React.Component {
render() {
  const images = this.props.images
  if (!images) { return null; }

  return (

    <div className="sm:w-full md:w-2/5 lg:w-1/4 mx-3 z-0 ">
        {images.map(image =>
          <div key={image.id} className="relative">
            <img className="my-3 z-0"  src={image.image} alt={image.description}/>
            <img className="absolute z-10 pin-b pin-l mb-5 ml-2 rounded-full "  width="40" height="40"  src={image.profile} alt=""/>
            <div className="absolute z-1 opacity-25 bg-grey text-grey pin-b pin-l pl-5 pr-4 p-2 mb-6 ml-8 ">{image.photographer}</div>
            <div className="absolute z-1  text-white pin-b pin-l pl-5 pr-4 p-2 mb-6 ml-8">{image.photographer}</div>
          </div>
      )}
    </div>
  )
}
}

export default ImageColumn;
