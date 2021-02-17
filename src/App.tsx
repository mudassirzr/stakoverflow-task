import {useState, CSSProperties} from 'react';
import { InfiniteLoader, Table, Column, AutoSizer } from 'react-virtualized';
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
        let newItems = response.data.items.map((item:any, key:number)=> ({'author': item.owner.display_name, 'title': item.title, 'creation_date': new Date(new Date(0).setUTCSeconds(item.creation_date)).toLocaleDateString()}))
        console.log(newItems, 'herer')
        setList([...list,...newItems])
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
    {index}:{
      index: number
    }
    ) => {
      console.log(list,index,'slsl')
    return (
      list[index]? list[index]:{'author': 'loading..', 'title':''}
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
      <AutoSizer>
      {({ width}:{width:number}) => (
        <Table
          height={200}
          headerHeight={40}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={remoteRowCount}
          rowHeight={40}
          rowGetter={rowRenderer}
          width={1000}
          minimumBatchSize={pageSize}
        >
          <Column
            label='Author'
            dataKey='author'
            width={300}
          />
          <Column
            label='Title'
            dataKey='title'
            width={0.2*width}
          />
          <Column
            label='Creation Date'
            dataKey='creation_date'
            width={300}
          />
        </Table>
      )}
      </AutoSizer>
    )}
  </InfiniteLoader>
  )
}