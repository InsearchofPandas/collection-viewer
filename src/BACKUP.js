
import React, {Component} from 'react';
import ImageColumn from './components/ImageColumn.js'

import './css/tailwind.css';
import _ from 'lodash'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: null,
      collection: 410546,
      title: "THE ROAD LESS TRAVELLED",
      search: null,
      pageSize: 30,
      pages: null,
      page: 1,
      collections: null
    }
  }

  getCollections = (event) => {
    fetch('https://api.unsplash.com/search/collections?page=1&query=' + event.target.value + '&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {

       let collections = jsonResponse.results.map(response => { return {id: response.id, collection: response.title} } )

      collections = collections.slice(0, 4)
      this.setState({
        collection: collections[0].id,
        collections: collections
      })
    })
  }


  getPages = (collection) => {
    fetch('https://api.unsplash.com/collections/' + collection + '?&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {

      let pages = jsonResponse.total_photos
      let title = jsonResponse.title
      pages = Math.ceil(pages / this.state.pageSize)

      this.setState({
        title: title,
        pages: pages
      })

    })
  }

  getImages = (collection, page) => {

    fetch('https://api.unsplash.com/collections/' + collection + '/photos?per_page=' + this.state.pageSize + '&page=' + page + '&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {

      let images = jsonResponse.map(response => {
        return {id: response.id, image: response.urls.regular, photographer: response.user.name, link: response.user.links.html, description: response.description}
      })

      this.setState({images: images})
    })
  }

  nextPage = () => {
    let page = this.state.page
    if (page < this.state.pages) {
      page++
      this.setState({page: page})
      this.getImages(this.state.collection, page)
    }
  }

  backPage = () => {
    let page = this.state.page
    if (page > 1) {
      page--
      this.setState({page: page})
      this.getImages(this.state.collection, page)
    }
  }


  enter = () => {
    this.getImages(this.state.collection, 1)
    this.getPages(this.state.collection)
    this.setState({
      page: 1,
      collections: null
    })

  }

  searchListEnter = (event) =>{
  let  collection = event.target.id


  this.getImages(collection, 1)
  this.getPages(collection)

  this.setState({
    collection: collection,
    page: 1,
    collections: null
  })

}
  componentDidMount() {
    this.getImages(this.state.collection, this.state.page)
    this.getPages(this.state.collection)
  }

  render() {
    const images = this.state.images
    if (!images) {
      return null;
    }

    let searches  = this.state.collections
    let dropDown, drop
    if (searches) {
       dropDown = <div className=" absolute z-50 block bg-grey-lightest border-2 rounded-lg h-16 w-2/5">
        {this.state.collections.map(collection => <div
           className="hover:bg-grey" id={collection.id} onClick={this.searchListEnter} key={collection.id}>
         </div>)}
       </div>;
    }   if (searches) {
      drop =   <datalist className="hover:bg-red" id="drop">
      { this.state.collections.map(collection => <option className="hover:bg-red" key={collection.id} value={collection.id}>{collection.collection}</option>)}
      </datalist>
    }



    let imageColumns = _.chunk(images, Math.ceil(images.length / 3))

    return (<div className="bg-grey-lightest w-screen h-screen" >

      <div className="py-4">
        <p className="text-center">Unsplash Collection Viewer</p>
        <h1 className="py-3 text-center border-t-2 border-b-2 font-normal">
        {this.state.title}
        </h1>
      </div>

      <div className="flex justify-center ">
        <div className="  border-2 p-2 border-grey-darker  font-bold  rounded-lg" onClick={this.enter}>Search</div>
        <div className="w-2/5 mx-1">
          <input list="drop" className="relative w-full bg-grey-lightest  border-2 border-grey-darker px-2 text-red-dark rounded-lg h-10"
            onChange={this.getCollections} placeholder="Search Collections..."/>
        </div>

      </div>

  <div className="flex justify-center mb-2">
    <div className="w-7/8 flex justify-between fixed">
    <div className="w-20 border-2 border-grey-darker p-2 px-3 mx-1 font-bold  rounded-lg hover:text-red-dark" onClick={this.backPage}>Back</div>
    <div className="w-20 border-2 border-grey-darker p-2 px-3 mx-1 font-bold  rounded-lg hover:text-red-dark" onClick={this.nextPage}>Next</div>
    </div>
  </div>

      <div className="flex justify-center">

        {imageColumns.map((col, i) => <ImageColumn key={i} images={col}/>)}

      </div>

    </div>);
  }
}

export default App;
