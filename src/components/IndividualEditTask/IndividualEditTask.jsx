import "./IndividualEditTask.css";
import { useTranslation } from "react-i18next";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import Moment from "react-moment";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Loading,
  Modal,
  Message,
} from "../../components/index";
import { useRef, useState } from "react";

function IndividualEditTask({ user, db }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  let { id } = useParams();
  const [value, loading, error] = useDocument(doc(db, user.uid, id));

  const inputRef = useRef();
  const inputModalRef = useRef();

  const [showModal, setShowModal] = useState(false);
  const [addTask, setAddTask] = useState("");
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isTaskAdded, setIsTaskAdded] = useState("hide-message");

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmitDetailes = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setIsTaskLoading(true);

    await updateDoc(doc(db, user.uid, id), {
      detailes: arrayUnion(addTask),
    });

    setIsTaskLoading(false);
    setAddTask("");
    setShowModal(false);
    setIsTaskAdded("show-message");
    setTimeout(() => {
      setIsTaskAdded("hide-message");
    }, 3000);
  };

  const handleInput = async (e) => {
    await updateDoc(doc(db, user.uid, id), {
      title: e.target.value,
    });
  };
  const handleCheckBox = async (e) => {
    await updateDoc(doc(db, user.uid, id), {
      completed: e.target.checked,
    });
  };
  const handleRemoveTask = async (e) => {
    await updateDoc(doc(db, user.uid, id), {
      detailes: arrayRemove(e),
    });
  };

  const handleDeleteTask = async () => {
    setIsTaskLoading(true);
    navigate("/", { replace: true });
    await deleteDoc(doc(db, user.uid, id));
    setIsTaskLoading(false);
  };

  if (error) {
    return <h3>{error.message}</h3>;
  }

  if (loading) {
    return <Loading />;
  }

  if (value) {
    return (
      <>
        <Message statusOfMessage={isTaskAdded} lang={i18n.language}>
          {t("message1")}
        </Message>
        {showModal && (
          <Modal closeModal={closeModal} inputModalRef={inputModalRef}>
            <input
              value={addTask}
              onChange={(e) => setAddTask(e.target.value)}
              placeholder={t("add")+ " " + t("task")}
              type="text"
              ref={inputModalRef}
            />
            <Button
              customClass="process"
              onClick={(e) => handleSubmitDetailes(e, addTask)}
              isDisabled={isTaskLoading}
              isLoading={isTaskLoading}
            >
              {t("submit")}
            </Button>
          </Modal>
        )}
        <div key={value.data().id} className="edit-task-container">
          <section className="edit-task-title">
            <input
              style={{
                width: value.data().title.length + 3 + "ch",
                textDecoration: value.data().completed ? "line-through" : "none",
              }}
              type="text"
              value={value.data().title ? value.data().title : ""}
              onChange={handleInput}
              ref={inputRef}
            />
            <i
              className="fa-solid fa-pen-to-square"
              onClick={() => inputRef.current.focus()}
            ></i>
          </section>
          <section className="slices">
            <div className="slice-detailes">
              <p
                dir={i18n.language === "ar" ? "rtl" : null}
                lang={i18n.language}
              >
                {t("created")}: <Moment fromNow date={value.data().id} locale={i18n.language} />
              </p>
              <div className="checkbox-inline">
                <input
                  type="checkbox"
                  id="completed"
                  checked={value.data().completed}
                  onChange={handleCheckBox}
                />
                <label htmlFor="completed">{t("completed")}</label>
              </div>
            </div>
            {value.data().detailes.map((detaile, index) => (
              <div className="slice" key={index}>
                <p>{detaile}</p>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => handleRemoveTask(detaile)}
                ></i>
              </div>
            ))}
          </section>
          <ButtonGroup>
            <Button customClass="process" onClick={() => setShowModal(true)}>
              {t("add")} {t("more")}
            </Button>
            <Button
              customClass="danger"
              onClick={handleDeleteTask}
              isDisabled={isTaskLoading}
              isLoading={isTaskLoading}
            >
              {t("delete")} {t("task1")}
            </Button>
          </ButtonGroup>
        </div>
      </>
    );
  }
}

export default IndividualEditTask;
