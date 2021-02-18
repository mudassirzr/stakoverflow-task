import { useState } from "react";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import Modal from "react-modal";
import "react-virtualized/styles.css";
import "./loader.css";
import axios from "axios";
export default function App() {
  interface LoadMoreValue {
    startIndex: number;
    stopIndex: number;
  }
  interface OwnerValue {
    display_name: string;
  }
  interface ItemValue {
    owner: OwnerValue;
    title: string;
    creation_date: number;
    question_id: number;
    link: string;
  }
  interface ListItemValue {
    author: string;
    title: string;
    creation_date: string;
    question_id: number;
  }
  interface ListValue {
    [key: number]: ListItemValue;
  }
  interface ListItemBodyValue {
    title: string;
    body: string;
    link: string;
  }
  const API_URL = "https://api.stackexchange.com/2.2/questions";
  const API_KEY = "U4DMV*8nvpm3EOpvf69Rxw((";
  const pageSize = 100;
  const [list, setList] = useState<ListValue>();
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState<number>(10);
  const [selectedItem, setSelectedItem] = useState<
    ListItemBodyValue | undefined
  >();
  interface RowLoadValue {
    index: number;
  }
  const isRowLoaded = function ({ index }: RowLoadValue): boolean {
    // !(index in list)
    return !!list && !!(index in list!);
  };
  // Converts EPOCH time stamp to local time
  const getLocaleStringFromEpoch = (time: number) => {
    return new Date(new Date(0).setUTCSeconds(time)).toLocaleDateString();
  };
  const loadMoreRows = ({ startIndex, stopIndex }: LoadMoreValue) => {
    let currentPage =
      startIndex === 0 ? 1 : (Math.ceil(startIndex / 100) * 100) / pageSize + 1;
    if (currentPage === 1 || currentPage !== page) {
      setPage(currentPage);
      return axios
        .get(
          API_URL +
            `?key=${API_KEY}&order=desc&sort=activity&site=stackoverflow&&page=${currentPage}&pagesize=${pageSize}`
        )
        .then(function (response) {
          let newItems: ListValue = {};
          response.data.items.forEach((item: ItemValue, key: number) => {
            newItems[key + currentPage * pageSize - pageSize] = {
              author: item.owner.display_name,
              title: item.title,
              creation_date: getLocaleStringFromEpoch(item.creation_date),
              question_id: item.question_id,
            };
          });
          setList({ ...list, ...newItems });
          currentPage === 1 && setRowCount(response.data.quota_max * pageSize);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    return new Promise<void>((resolve, reject) => resolve());
  };
  const rowRenderer = ({ index }: { index: number }) => {
    return list && !!(index in list!)
      ? { index: index, ...list![index] }
      : { index: "", author: "loading..", title: "" };
  };
  const onRowClick = ({ index }: { index: number }) => {
    axios
      .get(
        API_URL +
          `/${
            list![index].question_id
          }?key=${API_KEY}&filter=withbody&site=stackoverflow`
      )
      .then(function (response) {
        console.log();
        const { title, body, link } = response.data.items[0];
        setSelectedItem({
          title: title,
          body: body,
          link: link,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  Modal.setAppElement("body");
  return (
    <div>
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
                <Column
                  label="Creation Date"
                  dataKey="creation_date"
                  width={0.15 * width}
                />
              </Table>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
      <Modal
        isOpen={!!selectedItem}
        onRequestClose={() => setSelectedItem(undefined)}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
      >
        <div className="modal-header">
          <a
            href="#"
            title="Close Modal"
            onClick={() => setSelectedItem(undefined)}
          >
            X
          </a>
        </div>
        <div className="modal-content">
          <h2>{selectedItem?.title}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedItem?.body ? selectedItem.body : "",
            }}
          />
          <a
            rel="noreferrer noopener"
            title="Open in new tab"
            target="__blank"
            href={selectedItem?.link}
          >
            Open on Stackoverflow &#8599;
          </a>
        </div>
      </Modal>
    </div>
  );
}
