import "./Footer.css"
import { useTranslation } from 'react-i18next';

function Footer() {
  const { i18n } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-container">
        <p 
          dir={i18n.language === "ar" ? "rtl" : null}
          lang={i18n.language}
        >&copy; {i18n.language === "ar" ? "تم إنشاء الموقع من قبل تركي الناقي" : "created by Turki Nasser"}</p>
      </div>
    </footer>
  )
}

export default Footer