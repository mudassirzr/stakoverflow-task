import { useState, CSSProperties } from "react";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import "./loader.css";
import axios from "axios";
export default function App() {
  // const remoteRowCount=100000;
  const pageSize = 100;
  const [list, setList] = useState(new Array());
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(100);
  interface RowLoadProps {
    index: number;
  }
  const isRowLoaded = function ({ index }: RowLoadProps): boolean {
    return !!list[index];
  };
  interface loadMoreProps {
    startIndex: number;
    stopIndex: number;
  }
  // Converts EPOCH time stamp to local time
  const getLocaleStringFromEpoch = (time: number) => {
    return new Date(new Date(0).setUTCSeconds(time)).toLocaleDateString();
  };
  const loadMoreRows = ({ startIndex, stopIndex }: loadMoreProps) => {
    let currentPage =
      startIndex === 0 ? 1 : (Math.ceil(startIndex / 100) * 100) / pageSize + 1;
    if (currentPage === 1 || currentPage !== page) {
      setPage(currentPage);
      return axios
        .get(
          `https://api.stackexchange.com/2.2/questions?key=U4DMV*8nvpm3EOpvf69Rxw((&&page=${currentPage}&filter=withbody&pagesize=${pageSize}&order=desc&sort=activity&site=stackoverflow`
        )
        .then(function (response) {
          let newItems = response.data.items.map((item: any, key: number) => ({
            author: item.owner.display_name,
            title: item.title,
            creation_date: getLocaleStringFromEpoch(item.creation_date),
            question_id: item.question_id,
            body: item.body,
            link: item.link,
          }));
          setList([...list, ...newItems]);
          currentPage === 1 && setRowCount(response.data.quota_max * pageSize);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    }
    return new Promise<void>((resolve, reject) => resolve());
  };
  const rowRenderer = ({ index }: { index: number }) => {
    return list[index]
      ? { index: index, ...list[index] }
      : { index: "", author: "loading..", title: "" };
  };
  const onRowClick = ({ index }: { index: number }) => {
    // let doc = document.getElementById('root')
    console.log(list[index].body);
  };
  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
      threshold={80}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ width }: { width: number }) => (
            <Table
              height={500}
              headerHeight={40}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={rowCount}
              rowHeight={40}
              rowGetter={rowRenderer}
              width={1000}
              minimumBatchSize={pageSize}
              onRowClick={onRowClick}
            >
              <Column label="S.No." dataKey="index" width={0.1 * width} />
              <Column label="Author" dataKey="author" width={0.2 * width} />
              <Column label="Title" dataKey="title" width={0.65 * width} />
              <Column label="Creation Date" dataKey="creation_date" width={0.15 * width} />
            </Table>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}
