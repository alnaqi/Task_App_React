import "./Button.css"
import React from 'react'
import { Loading } from "../../components/index"

const ButtonGroup = ({ children }) => {
  const cloneElement = React.Children.map(children, child => {
    return React.cloneElement(child, {color:'red'})
  })

  return <div className={`buttons`}>{cloneElement}</div>
}
export default ButtonGroup;

export const Button = ({ customClass, isDisabled, isLoading, onClick, children, lang }) => {
  return (
    <button
      className={`btn ${customClass ? customClass : "primary"}`} 
      disabled={isDisabled}
      onClick={onClick}
      dir={lang === "ar" ? "rtl" : null}
      lang={lang}
    >
      {isLoading ? <Loading width={20} height={20}/> : children}
    </button>
  );
};