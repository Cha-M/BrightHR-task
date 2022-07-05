import { type } from '@testing-library/user-event/dist/type';
import './GlobalStyles.css';
import jsonData from './data.json';// assert  {type:json };
import { useState } from 'react';

const App = () => {

  const DataItem = ({item}) => {
    //State to use for whether folder is expanded.
    const [expand, setExpand] = useState(false);
    //Keys of object stored in state
    const [keyList] = useState(Object.keys(item));

    const expander = () =>
    {
      setExpand(!expand);
    }

    const PrintKey = ({ itemObj, keyObj }) => {
      //Component to display individual key-value pairs 
      if (keyObj !== "files") 
        return (
          <div className="topSpan">
              <h3>{keyObj}</h3><h3>{itemObj[keyObj]}</h3>
          </div>
        )
    }

    if (item) {
      if (item.type === "folder" || item.type === "Folder") {
        if (expand) {
          // console.log(keyList)
          return (
            <div className="dataFolder">
              
              <div className="topSpan"><h2>{item.name}</h2><button onClick={expander}><h2>-</h2></button></div>

              {/* Display all key-value pairs of the object. */}
              {   
                  keyList.map(
                    (key) => (<PrintKey keyObj = {key} itemObj = {item}/>)
                    )          
                  }

              <div className="topSpan"><h3>{"Files"}</h3></div>
              {/* Display all files if expanded */}
              {
                item.files.map(
                  (file) => (  
                    <div className="dataDoc">
                      {
                      Object.keys(file).map(
                        (fileKey) => {
                          return (<PrintKey keyObj = {fileKey} itemObj = {file}/>)
                        }
                      )
                      }
                  </div>
                    ) 
                )
              }
        
            </div>
          )
        }
        else {
          return (
            <div className="dataFolder">
              <div className="topSpan"><h2>{item.name}</h2><button onClick={expander}><h2>+</h2></button></div>
              {/* Display all key-value pairs of the object. */}
              {   
                  keyList.map(
                    (key) => (<PrintKey keyObj = {key} itemObj = {item}/>)
                    )          
              }
        
            </div>
          )

        }
      }
      else {
        return (
          <div className="dataDoc">
            {/* Nothing to expand for documents. */}
            <div className="topSpan"><h2>{item.name}</h2></div>
            {/* Display all key-value pairs of the object. */}
            {   
                  keyList.map(
                    (key) => (<PrintKey keyObj = {key} itemObj = {item}/>)
                    )          
            }

          </div>
        )
      }
    }
  }

  //The array generated from the JSON data.
  const [dataArray, setDataArray] = useState(Object.values(jsonData));
  
  //Three string states to use to search and filter the array.
  const [dataKey, setDataKey] = useState("Type");
  const [textSearch, setTextSearch] = useState("");
  const [sortingOption, setSortingOption] = useState("name");
  
  const ItemList = () => {
    //Used to display all data objects from the JSON.
    return (
      <div>
        {
          dataArray.map(
            (item) => ( <DataItem item = {item}/> )
          )
        }
      </div>
    )
  }

  const stringSearch = () => {
    //Define the data array based on the JSON/
    setDataArray(Object.values(jsonData));

    //Only take items with the chosen property's value equal to the text search.
    setDataArray(
      dataArray.map(
          (item) => {
            return ((item[dataKey] === textSearch) && item)
          }
        )
        )
  }

  const sortList = (sortOption) => {
    // console.log("Sort list by", sortOption);
    let sortArray = dataArray;
    
    if (sortOption === "added")
    {
      //Sort by date parsed.
      sortArray = sortArray.sort(
        (a, b) => Date.parse(a[sortOption]) < Date.parse(b[sortOption]) ? -1 : 1
      );

    }
    else if (sortOption === "size")
    {
      sortArray = sortArray.sort(
        (a, b) => 
          parseInt(a[sortOption]) < parseInt(b[sortOption]) || b[sortOption] === undefined? -1 : 1
        
      );
    }
    else
    {
      sortArray = sortArray.sort(
        (a, b) => a[sortOption] < b[sortOption] ? -1 : 1
      );
    }

    setDataArray(
      [...sortArray]
    );

    // console.log(dataArray);
  }
  return (
    <div className="topColumn">

      <header><h1>Company Data</h1></header>
      <div className="menuContainer">


        <div className="dataMenu">
          <button onClick={() => {setDataArray(Object.values(jsonData))}}>
            Reset
          </button>
        </div>
        <div className="sortMenu" onChange = {(e) => {setSortingOption(e.target.value)}}>
          <select>
            <option value={"name"}>
              Name
            </option>
            <option value={"size"}>
              Size
            </option>
            <option value={"added"}>
              Date
            </option>
          </select>

          <button onClick={(e) => {sortList(sortingOption)}}>Sort Results</button>
        </div>
        <div className="dataMenu">
          <input name="Select key" type="text" placeholder="Key" onChange={(e) => {setDataKey(e.target.value)}}>
          </input>

          <input name="Text Search" type="text" placeholder="Search String" onChange={(e) => {setTextSearch(e.target.value)}}>
          </input>

          <button onClick={stringSearch}>Filter Results</button>
        </div>
      </div>

      <ItemList array = {dataArray}/>

    </div>
  );

}

export default App;
