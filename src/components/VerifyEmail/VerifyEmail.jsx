import React from 'react'
import { useTranslation } from "react-i18next";

function VerifyEmail({ sendEmailVerify, showHelpMsg }) {
  const { t, i18n } = useTranslation();
  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : null}
      lang={i18n.language} 
    >
      <h4>{i18n.language === "ar" ? "الرجاء التحقق من البريد الإلكتروني للإكمال..." : "Verify Your Email to continue..."}</h4>
      <button onClick={sendEmailVerify} className="btn secondry" style={{marginTop: "20px"}}>{t("send")} {t("verify")}</button>
      <p>{showHelpMsg}</p>
    </div>
  )
}

export default VerifyEmail