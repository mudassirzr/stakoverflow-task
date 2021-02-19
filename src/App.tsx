import "react-virtualized/styles.css";
import "./App.css";
import { useState, MouseEvent } from "react";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import QuestionDetails from "./components/QuestionDetails";
import { QuestionItem } from "./components/types";
import { getQuestions } from "./components/api";
export default function App() {
  const rowCount = 10;
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
      startIndex === 0 ? 1 : (Math.ceil(startIndex / 100) * 100) / pageSize + 1;
    if (newPage === 1 || newPage !== currentPage) {
      setCurrentPage(newPage);
      const newItems = await getQuestions(newPage, pageSize);
      setQuestionList([...(questionList || []), ...newItems]);
    }
    return Promise.resolve();
  };
  const rowRenderer = ({ index }: { index: number }) => {
    return !!questionList && questionList[index]
      ? { ...questionList[index] }
      : { author: "loading..", title: "" };
  };
  const onRowClick = ({ index }: { index: number }) => {
    !!questionList && setSelectedQuestion({ ...questionList[index] });
  };
  const getRowCount = (): number => {
    return !!questionList && questionList.length > 0
      ? questionList.length + 1
      : rowCount;
  };
  return (
    <div className="table-wrapper">
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={fetchMoreRows}
        rowCount={getRowCount()}
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
                rowCount={getRowCount()}
                rowHeight={40}
                rowGetter={rowRenderer}
                width={1000}
                minimumBatchSize={pageSize}
                onRowClick={onRowClick}
              >
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
