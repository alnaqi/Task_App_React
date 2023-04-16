import "./Home.css";
import { useTranslation } from "react-i18next";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useState } from "react";
import { Link } from "react-router-dom";
import { collection, orderBy, query, where } from "firebase/firestore";
import logo from "../../assets/imgs/logo.png"

import {
  Card,
  SelectGroup,
  SelectOption,
  ButtonGroup,
  Button,
  Modal,
  Message,
  Loading,
} from "../../components/index";
import { useRef } from "react";

function Home() {
  const { t, i18n } = useTranslation();
  const [user, loading, error] = useAuthState(auth);
  const [initialData, setInitialData] = useState(null);
  let constInitialData;
  if (user) {
    constInitialData = query(collection(db, user.uid), orderBy("id", "desc"));
  }
  const [selected, setSelected] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isTaskAdded, setIsTaskAdded] = useState("hide-message");

  const [title, setTitle] = useState("");
  const [detailes, setDetailes] = useState("");
  const [detailesArr, setDetailesArr] = useState([]);
  const [isTaskLoading, setIsTaskLoading] = useState(false);

  const [isNewest, setIsNewest] = useState(true);
  const [isOldest, setIsOldest] = useState(false);

  const inputModalRef = useRef();

  const OpenModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleDetailes = (e) => {
    e.preventDefault();
    if (detailes === "") {
      return;
    }
    setDetailesArr([...detailesArr, detailes]);
    setDetailes("");
  };

  const taskId = new Date().getTime();
  const handleSubmitDetailes = async (e) => {
    e.preventDefault();
    setIsTaskLoading(true);
    await setDoc(doc(db, user.uid, `${taskId}`), {
      useremail: user.email,
      title: title,
      detailes: detailesArr,
      completed: false,
      id: taskId,
    });
    setIsTaskLoading(false);
    setShowModal(false);
    setTitle("");
    setDetailesArr([]);
    setIsTaskAdded("show-message");
    setTimeout(() => {
      setIsTaskAdded("hide-message");
    }, 3000);
  };

  const handleClear = e => {
    e.preventDefault()
    setTitle("");
    setDetailes("")
    setDetailesArr([]);
  }

  const handleNewest = () => {
    setIsNewest(true);
    setIsOldest(false);
    setSelected("all");
    setInitialData(query(collection(db, user.uid), orderBy("id", "desc")));
  };
  const handleOldest = () => {
    setIsOldest(true);
    setIsNewest(false);
    setSelected("all");
    setInitialData(query(collection(db, user.uid), orderBy("id", "asc")));
  };

  const handleSelect = (e) => {
    switch (e.target.value) {
      case "all":
        if (isOldest) {
          setInitialData(query(collection(db, user.uid), orderBy("id", "asc")));
        } else {
          setInitialData(
            query(collection(db, user.uid), orderBy("id", "desc"))
          );
        }
        break;
      case "completed":
        setInitialData(
          query(collection(db, user.uid), where("completed", "==", true))
        );
        break;
      case "not completed":
        setInitialData(
          query(collection(db, user.uid), where("completed", "==", false))
        );
        break;
      default:
        console.log("error");
        break;
    }
    setSelected(e.target.value);
  };

  if (error) {
    return <h3>{error.message}</h3>;
  }

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return (
      <div className="task-container">
        <Message statusOfMessage={isTaskAdded} lang={i18n.language}>
          {t("message1")}
        </Message>
        {showModal && (
          <Modal
            closeModal={closeModal}
            onSubmit={handleSubmitDetailes}
            customClass={`add-task`}
            inputModalRef={inputModalRef}
          >
            <input
              dir={i18n.language === "ar" ? "rtl" : null}
              lang={i18n.language}
              type="text"
              placeholder={t("add") + " " + t("title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={inputModalRef}
            />
            <div
              dir={i18n.language === "ar" ? "rtl" : null}
              lang={i18n.language}
            >
              <input
                type="text"
                placeholder={t("detailes")}
                value={detailes}
                onChange={(e) => setDetailes(e.target.value)}
              />
              <Button customClass="process" onClick={handleDetailes}>
                {t("add")}
              </Button>
            </div>
            <ul>
              {detailesArr.map((detaile) => (
                <li 
                  key={Math.random()}
                  dir={i18n.language === "ar" ? "rtl" : null}
                  lang={i18n.language}
                >
                  {detaile}
                </li>
              ))}
            </ul>
            <ButtonGroup>
              <Button
                customClass="process"
                isDisabled={isTaskLoading}
                isLoading={isTaskLoading}
              >
                {t("submit")}
              </Button>
              <Button customClass="danger" onClick={e => handleClear(e)}>
                {t("clear")}
              </Button>
            </ButtonGroup>
          </Modal>
        )}
        <ButtonGroup>
          <Button
            customClass="primary"
            isDisabled={isNewest}
            onClick={handleNewest}
            lang={i18n.language}
          >
            {i18n.language === "ar" ? "الأحدث اولاً" : "Newest first"}
          </Button>
          <Button
            customClass="primary"
            isDisabled={isOldest}
            onClick={handleOldest}
            lang={i18n.language}
          >
          {i18n.language === "ar" ? "الأقدم اولاً" : "Oldest first"}
          </Button>

          <SelectGroup
            onChange={(e) => {
              handleSelect(e);
            }}
            selected={selected}
          >
            <SelectOption value="all">
              {t("all")} {t("tasks")}
            </SelectOption>
            <SelectOption value="completed">{t("completed")}</SelectOption>
            <SelectOption value="not completed">
              {t("not")} {t("completed")}
            </SelectOption>
          </SelectGroup>
        </ButtonGroup>
        <Card 
          initialData={initialData} 
          constInitialData={constInitialData} 
        />
        <section>
          <Button 
            customClass="process" 
            onClick={OpenModal}
            lang={i18n.language}
          >
            {i18n.language === "ar" ? "أضف مهمة جديدة" : "Add new task"}{" "}
            <i className="fa-solid fa-plus"></i>
          </Button>
        </section>
      </div>
    );
  }

  if (!user) {
    
    if (i18n.language === "ar") {
      return (
        <div>
        <section className="interface-container">
          <div className="interface">
            <div className="interface-info"  lang="ar" dir="rtl">
              <h1>
                <span lang="en" dir="ltr">Guts</span>{t("Stay organized with")}<span></span>{t("a powerful task")}
              </h1>
              <p>
                {t("Get Ready to run your tasks by creating an account")}<span></span>
                <Link to="/signup">{t("signup")} {t("here")}</Link>.
              </p>
            </div>
            <div className="interface-img-container">
              <div className="interface-img">
                <img src={logo} alt="logo" width="220" />
              </div>
            </div>
          </div>
        </section>
      </div>
      );
    } else {
      return (
        <div>
          <section className="interface-container">
            <div className="interface">
              <div className="interface-info">
                <h1>
                  <span>Guts</span>{t("Stay organized with")}<span></span>{t("a powerful task")}
                </h1>
                <p>
                  {t("Get Ready to run your tasks by creating an account")}<span></span>
                  <Link to="/signup">{t("signup")} {t("here")}</Link>.
                </p>
              </div>
              <div className="interface-img-container">
                <div className="interface-img">
                  <img src={logo} alt="logo" width="220" />
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
  }
}

export default Home;
