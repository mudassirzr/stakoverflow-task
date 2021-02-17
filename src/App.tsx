import {useState, CSSProperties} from 'react';
import { InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import axios from 'axios'
export default function App (){
  // This example assumes you have a way to know/load this information
  const remoteRowCount=100000;
  const pageSize = 100
  const [list, setList] = useState(new Array())
  const [page, setPage] = useState(1)
  const [rowCount, setRowCount] = useState(100)
  interface RowLoadProps {
    index: number
  }
  const isRowLoaded = function ({index}:RowLoadProps): boolean {
    return !!list[index];
  }
  interface loadMoreProps {
    startIndex: number, 
    stopIndex: number
  }
  const loadMoreRows = ({ startIndex, stopIndex }:loadMoreProps) => {
    let currentPage = startIndex===0?1:((Math.ceil(startIndex/100)*100)/pageSize)+1
    
    console.log(startIndex, currentPage, page)
    if (currentPage===1 || currentPage !== page){
      setPage(currentPage)
      return axios.get(`https://api.stackexchange.com/2.2/questions?key=U4DMV*8nvpm3EOpvf69Rxw((&&page=${currentPage}&pagesize=${pageSize}&order=desc&sort=activity&site=stackoverflow`)
      .then(function (response) {
        setList([...list,...response.data.items])
        currentPage === 1 && setRowCount(response.data.quota_max)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    }
    return new Promise<void>((resolve, reject)=>resolve())
    
  }
  const rowRenderer = (
    { key, index, style}:{
      key: string,
      index: number,
      style: CSSProperties
    }
    ) => {
    return (
      list[index]?<div
        key={key}
        style={{...style, padding: '5px', backgroundColor: index%2===0?'#dadada':'#fff', display: 'flex'}}
      >
        <span>{list[index] && list[index].title}</span><span style={{paddingLeft: '10px'}}>{index}</span>
      </div>:
      <div key={key} style={style}>
        loading...
      </div>
    )
  }
  return (
    <InfiniteLoader
    isRowLoaded={isRowLoaded}
    loadMoreRows={loadMoreRows}
    rowCount={remoteRowCount}
    threshold={80}
  >
    {({ onRowsRendered, registerChild }) => (
      <List
        height={200}
        onRowsRendered={onRowsRendered}
        ref={registerChild}
        rowCount={remoteRowCount}
        rowHeight={40}
        rowRenderer={rowRenderer}
        width={1000}
        minimumBatchSize={pageSize}
      />
    )}
  </InfiniteLoader>
  )
}