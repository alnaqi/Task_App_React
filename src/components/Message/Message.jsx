import "./Message.css"

function Message({ statusOfMessage, children, lang }) {
  return (
    <div 
      className={`message ${statusOfMessage}`}
      dir={lang === "ar" ? "rtl" : null}
      lang={lang}
    >
      <i className="fa-sharp fa-solid fa-circle-check"></i> {children}
    </div>
  )
}

export default Message