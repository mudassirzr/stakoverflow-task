import Dialog from "./Dialog";
import { QuestionItem } from "./types";
interface QuestionDetailProp {
  onClose: Function;
  selectedQuestion: QuestionItem;
}
export default function questionDetails({
  onClose,
  selectedQuestion,
}: QuestionDetailProp) {
  return (
    <Dialog onClose={() => onClose()}>
      <div className="modal-header">
        <button title="Close Modal" onClick={() => onClose()}>
          X
        </button>
      </div>
      <div className="modal-content">
        <h2>{selectedQuestion.title}</h2>
        <div
          dangerouslySetInnerHTML={{
            __html: selectedQuestion.body,
          }}
        />
        <a
          rel="noreferrer noopener"
          title="Open in new tab"
          target="__blank"
          href={selectedQuestion.link}
        >
          Open on Stackoverflow &#8599;
        </a>
      </div>
    </Dialog>
  );
}
