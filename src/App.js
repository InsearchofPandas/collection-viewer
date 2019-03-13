import React, {Component} from 'react';
import ImageColumn from './components/ImageColumn.js'

import './css/tailwind.css';
import _ from 'lodash'
import ScrollEvent from 'react-onscroll';
import ReactWindowResizeListener from 'window-resize-listener-react';

class App extends Component {
  constructor(props) {
    super(props)
    let colNum = this.setCol()
    this.state = {
      images: null,
      collection: 410546,
      title: "THE ROAD LESS TRAVELLED",
      pageSize: 6,
      pages: null,
      page: 1,
      collections: null,
      selected: 0,
      stickyMenu: 0,
      columns: colNum
    }
  }

  getCollections = (event) => {
    fetch('https://api.unsplash.com/search/collections?page=1&query=' + event.target.value + '&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {

      let collections = jsonResponse.results.map(response => {
        return {id: response.id, collection: response.title}
      })

      collections = collections.slice(0, 5)
      this.setState({collections: collections})
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

      this.setState({title: title, pages: pages})

    })
  }

  getImages = (collection, page) => {
    console.log("get images init " + collection + " " + page)
    fetch('https://api.unsplash.com/collections/' + collection + '/photos?per_page=' + this.state.pageSize + '&page=' + page + '&client_id=b63be2ba937a3d960d071bf1ab86b68c5a25d90a42d5e052f4f56c8b5b6fbbd5').then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Request failed!')
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      console.log("get images running " + jsonResponse)
      let images = jsonResponse.map(response => {
        return {
          id: response.id,
          image: response.urls.regular,
          photographer: response.user.name,
          profile: response.user.profile_image.medium,
          link: response.user.links.html,
          description: response.description
        }
      })
      console.log("get images ran " + images)
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

  backPage = (event) => {
    let page = this.state.page
    if (page > 1) {
      page--
      this.setState({page: page})
      this.getImages(this.state.collection, page)
    }
  }

  handleOnMouseEnter = (event) => { // mouse hover over search list
    let selected = event.target.value
    this.setState({selected: Number(selected)})
  }

  searchListClick = (event) => { // mouse click on search list
    let collection = event.target.id
    this.getImages(collection, 1)
    this.getPages(collection)
    this.setState({collection: collection, page: 1, collections: null, selected: 0})
  }

  handleKeyPress = (event) => {
    let searches = this.state.collections
    let selected = this.state.selected
    switch (event.key) {
      case 'Enter':
        if (searches) {
          this.getImages(searches[selected].id, 1)
          this.getPages(searches[selected].id)
          this.setState({collection: searches[selected].id, page: 1, collections: null, selected: 0})
        }
        break;
      case 'ArrowUp':
        if (searches && selected > 0) {
          selected--
          this.setState({selected: selected})
        }
        break;
      case 'ArrowDown':
        if (searches && selected < 4) {
          selected++
          this.setState({selected: selected})
        }
        break;

      default:

    }
  }

  handleScroll = () => {
    console.log(window.pageYOffset)
    console.log(this.refs.scroll);
  }

  handleScrollCallback = () => {

    let trigger
    if (102 > window.pageYOffset) {
      trigger = 0
      this.setState({stickyMenu: trigger})
    } else if (102 < window.pageYOffset) {
      trigger = 1
    }
    this.setState({stickyMenu: trigger})
  }

  resizeHandler = () => {
    let colNum
    if (window.innerWidth >= 1000) {
      colNum = 3
    } else if (window.innerWidth >= 600) {
      colNum = 2
    } else if (window.innerWidth >= 300) {
        colNum = 1
      }
    this.setState({
      columns: colNum
    })
  }

  setCol = () => {
      let colNum
      if (window.innerWidth >= 1000) {
        colNum = 3
      } else if (window.innerWidth >= 600) {
        colNum = 2
      } else if (window.innerWidth >= 300) {
          colNum = 1
        }
    return colNum
    }


  componentDidMount() {
    this.getImages(this.state.collection, this.state.page)
    this.getPages(this.state.collection)
  }

  render() {

    console.log("this is inner"+ window.innerWidth)
    const images = this.state.images
    if (!images) {
      return null;
    }

    let searches = this.state.collections
    let dropDown

    if (searches && searches.length >= 1) {
      dropDown = <div className=" absolute z-10  bg-grey-lightest border-2 rounded-lg w-2/5">
        {
          this.state.collections.map((collection, i) => <button className={(
              this.state.selected === i
              ? "bg-grey"
              : "bg-white") + " p-1 block  w-full text-left"} value={i} id={collection.id} onMouseEnter={this.handleOnMouseEnter} onClick={this.searchListClick} onKeyPress={this.handleKeyPress} key={collection.id}>
            {collection.collection}
          </button>)
        }
      </div>;
    }



    let imageColumns = _.chunk(images, Math.ceil(images.length / this.state.columns))

    return (<div className="bg-grey-lightest w-screen h-full" onWheel={this.handleScroll}>
      <ScrollEvent handleScrollCallback={this.handleScrollCallback}/>
      <ReactWindowResizeListener onResize={this.resizeHandler} />
      <div className=" pt-4">
        <p className="text-center h-4 text-xs md:text-lg md:mb-1">Unsplash Collection Viewer</p>
        <p className="py-1  md:py-3 text-center border-t-2 border-b-2  md:text-3xl ">
          {this.state.title}
        </p>
      </div>

      <div className="h-24">
        <div className={"flex justify-center z-20 h-24 " + (
            this.state.stickyMenu === 1
            ? " fixed w-full pin-t "
            : "")} onScroll={this.handleScroll}>

          <div className="flex justify-center w-full pt-6 z-30" ref="scroll pb-6">
            <div className="w-16 h-10 border-2 border-grey-darker mt-1 p-2 px-3 ml-6 font-bold  rounded-lg hover:text-red-dark" onClick={this.backPage}>Back</div>
            <div className="w-16"></div>

            <div className="w-4/5 mx-1 h-10 z-30">
              <div className=" relative flex w-full h-10 bg-grey-lightest  border-2 border-grey-darker px-1  rounded-lg ">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 1300 1100" className="mt-1">
                  <circle className="cls-1" cx="415" cy="417" r="386"/>
                  <path id="Rounded_Rectangle_1" data-name="Rounded Rectangle 1" d="M643.97,710.027l38.015-33.471c2.64-2.325,6.94-1.8,9.614,1.182l376,419.6c5,5.58,5.96,12.55,2.12,15.52l-55.27,42.7c-3.79,2.92-10.7.62-15.412-5.09L643.824,719.733C641.291,716.662,641.361,712.323,643.97,710.027Z"/>
                  <path id="Rounded_Rectangle_1_copy" data-name="Rounded Rectangle 1 copy" d="M706.573,811.752l69.883-59.927c2.889-2.477,7.778-1.718,10.932,1.715L1088.43,1081.2c5.09,5.54,6.1,12.49,2.23,15.48l-93.311,72.08c-3.766,2.91-10.605.58-15.248-5.17L706.682,822.618C703.787,819.034,703.744,814.178,706.573,811.752Z"/>
                </svg>
                <input className="text-red px-1 pt-3 pb-3 bg-grey-lightest " onChange={this.getCollections} onKeyDown={this.handleKeyPress} placeholder="Search Collections..."></input>
              </div>
              {dropDown}
            </div>
            <div className="w-16"></div>
            <div className="w-16  mt-1 h-10 border-2 border-grey-darker p-2 px-3 mr-10 font-bold z-30 rounded-lg hover:text-red-dark" onClick={this.nextPage}>Next</div>
          </div>
          <div className=" absolute z-20 w-full h-24 mb-10 bg-grey-lightest opacity-50"></div>
        </div>

      </div>

      <div className="flex justify-center">

        {imageColumns.map((col, i) => <ImageColumn className="z-0" key={i} images={col}/>)}

      </div>

    </div>);
  }
}

export default App;
