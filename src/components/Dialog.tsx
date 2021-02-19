import { ReactNode, MouseEvent } from "react";
interface DialogProps {
  children: ReactNode;
  onClose: (e: MouseEvent) => void;
}
export default function Dialog({ children, onClose }: DialogProps) {
  return (
    <div onClick={onClose} className="modal-overlay">
      <dialog onClick={(e) => e.stopPropagation()} className="modal-box" open>
        {children}
      </dialog>
    </div>
  );
}
