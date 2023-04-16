
import "./Modal.css";
import { useEffect } from "react"

const Modal = ( {closeModal, onSubmit, customClass, children, inputModalRef}   ) => {

    useEffect(() => {
      inputModalRef && inputModalRef.current.focus()
    },[inputModalRef])

  return (
    <div className="parent-of-modal">
    <form className="modal" onSubmit={onSubmit}>
      <div
        onClick={() => closeModal()}
        className="close-modal"
      >
        <i className="fa-solid fa-xmark"></i>
      </div>

      <div className={customClass}>{children}</div>

    </form>
  </div>
  );
}

export default Modal;