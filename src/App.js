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
      search: null,
      pageSize: 30,
      pages: null,
      page: 1,
      search: 'pandas'
    }
  }

  getCollections = () => {
    fetch('https://api.unsplash.com/search/collections?page=1&query=' + this.state.search + '&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      let collection = jsonResponse.results[0].id
      console.log(jsonResponse.results)
        this.setState({
          collection: collection,
          page: 1
        })
        this.getImages(collection, 1)
        this.getPages()
    })
  }

  getPages = () => {
    fetch('https://api.unsplash.com/collections/' + this.state.collection + '?&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {

      let pages = (jsonResponse.total_photos)
      pages = Math.ceil(pages / this.state.pageSize)

      this.setState({pages: pages})

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
        return {id: response.id, image: response.urls.regular, photographer: response.user.name, link: response.user.links.html}
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

  search = (event) => {
let search = event.target.value
 this.setState({
   search: search
 })

  }

  componentDidMount() {
    this.getImages(this.state.collection, this.state.page)
    this.getPages()
  }
  render() {
    const images = this.state.images
    if (!images) {
      return null;
    }

    let imageColumns = _.chunk(images, Math.ceil(images.length / 3))

    return (<div className="bg-grey-lightest w-screen h-screen" >

      <div className="py-4">
        <h1 className="py-3 text-center bg-grey-light font-normal">
          Unsplash Collection Viewer
        </h1>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-grey-dark p-2 px-3 mx-1 font-bold  rounded-lg" onClick={this.getCollections}>Search</div>
        <input className="w-1/5 bg-grey text-white p-2 mx-1" onChange={this.search}></input>
        <div className="bg-grey-dark p-2 font-bold  rounded-lg" onClick={this.nextPage}>Next</div>
      </div>

      <div className="flex justify-center">

        {imageColumns.map((col, i) => <ImageColumn key={i} images={col}/>)}

      </div>

    </div>);
  }
}

export default App;
