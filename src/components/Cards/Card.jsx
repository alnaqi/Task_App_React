import "./Card.css";
import React from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import Moment from "react-moment";
import 'moment/locale/ar'
import { Loading } from "../../components/index";

function Card({ initialData, constInitialData }) {
  const { i18n } = useTranslation();
  
  const [value, loading, error] = useCollection(initialData || constInitialData)

  if (error) {
    return <h3>{error.message}</h3>;
  }

  if (loading) {
    return <Loading />;
  }

  if (value) {
    return (
      <section className="cards">
        {value.docs.map((item) => (
          <Link to={`/edit_task/${item.data().id}`} key={item.data().id}>
            <article
              dir="auto"
              className={`card ${item.data().completed ? "card-completed" : "card-incompleted"}`}
              key={item.data().id}
            >
              <h4>{item.data().title ? item.data().title : "no title"}</h4>
              <ul>
                {item.data().detailes.map((detaile, index) =>
                  index < 2 ? (
                    <li 
                      key={index}
                      // dir={i18n.language === "ar" ? "rtl" : null}
                      // lang={i18n.language}
                    >
                      {detaile}
                    </li>
                  ) : (
                    index === 2 && (
                      <li className="card-more" key={index}>
                        more...
                      </li>
                    )
                  )
                )}
              </ul>
              <span dir="ltr">
                {/* <ReactTimeAgo date={item.data().id} locale="en-US" /> */}
                <Moment fromNow date={item.data().id} locale={i18n.language} />
              </span>
            </article>
          </Link>
        ))}
        {!value.docs.length && <h3>{i18n.language === "ar" ? "لا توجد مهام" : "There is no Tasks"}</h3>}
      </section>
    );
  }
}
export default Card;

export const SelectGroup = ({ children, onChange, selected }) => {
  const SelectOptions = React.Children.map(children, (child) => {
    return React.cloneElement(child, {});
  });
  return (
    <select
      name="Tasks"
      className="btn secondry"
      onChange={onChange}
      value={selected}
    >
      {SelectOptions}
    </select>
  );
};

export const SelectOption = ({ value, children }) => {
  return (
    <option id={value} value={value}>
      {children}
    </option>
  );
};
