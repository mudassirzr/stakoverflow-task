import "react-virtualized/styles.css";
import "./App.css";
import { useState, MouseEvent, useCallback } from "react";
import {
  InfiniteLoader,
  Table,
  Column,
  WindowScroller,
  ScrollEventData,
} from "react-virtualized";
import QuestionDetails from "./components/QuestionDetails";
import { QuestionItem } from "./components/types";
import { getQuestions } from "./components/api";
import Loader from "./components/Loader";
export default function App() {
  const pageSize = 100;
  const [questionList, setQuestionList] = useState<QuestionItem[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<
    QuestionItem | undefined
  >();
  const isRowLoaded = function ({ index }: { index: number }): boolean {
    return !!questionList && !!questionList[index];
  };
  const fetchMoreRows = async ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    let newPage =
      startIndex === 0
        ? 1
        : (Math.ceil(startIndex / pageSize) * pageSize) / pageSize + 1;
    if (newPage === 1 || newPage !== currentPage) {
      setCurrentPage(newPage);
      const newItems = await getQuestions(newPage, pageSize);
      setQuestionList([...(questionList || []), ...newItems]);
    }
    return Promise.resolve();
  };
  const rowRenderer = useCallback(
    ({ index }: { index: number }) => {
      return !!questionList && questionList[index]
        ? { ...questionList[index] }
        : { author: "loading..", title: "" };
    },
    [questionList]
  );
  const onRowClick = useCallback(
    ({ index }: { index: number }) => {
      !!questionList && setSelectedQuestion({ ...questionList[index] });
    },
    [questionList]
  );
  const getRowCount = useCallback((): number => {
    return !!questionList && questionList.length > 0
      ? questionList.length + 1
      : pageSize;
  }, [questionList]);
  return (
    <div className="table-wrapper">
      {!questionList && <Loader />}
      <h1 className="main-heading">Questions from StackOverflow:</h1>
      <p className="help-text">
        <em>(Click a row to view question details)</em>
      </p>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={fetchMoreRows}
        rowCount={getRowCount()}
        threshold={80}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({
              height,
              isScrolling,
              onChildScroll,
              scrollTop,
            }: {
              height: number;
              isScrolling: boolean;
              onChildScroll: (info: ScrollEventData) => void;
              scrollTop: number;
            }) => (
              <Table
                autoHeight
                height={height}
                headerHeight={40}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={getRowCount()}
                rowHeight={40}
                rowGetter={rowRenderer}
                width={1000}
                minimumBatchSize={pageSize}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                onRowClick={onRowClick}
              >
                <Column label="Author" dataKey="author" width={200} />
                <Column label="Title" dataKey="title" width={600} />
                <Column
                  label="Creation Date"
                  dataKey="creation_date"
                  width={150}
                />
              </Table>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
      {!!selectedQuestion && (
        <QuestionDetails
          selectedQuestion={selectedQuestion}
          onClose={(e: MouseEvent) => {
            setSelectedQuestion(undefined);
          }}
        />
      )}
    </div>
  );
}
