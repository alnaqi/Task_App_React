import "./Header.css"
import logo from "../../assets/imgs/logo.png"
import { useTranslation } from 'react-i18next';
import { useContext } from "react"
import ThemeContext from "../../context/ThemeContext"
import { Link, useNavigate } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../firebase/config"
import { signOut } from "firebase/auth";
import { Loading } from "../index"

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, loading, error] = useAuthState(auth);
  
  if (error) {
    <h3>{error.message}</h3>
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo"><img src={logo} alt="" width="25"/>Guts</div>
        <nav>
          <ul className="header-ul">
            <li><Link to="/">{t("home")}</Link></li>
            <li className="main-lang-list lang-list">
              <p>{t("langs")}</p>
              <ul className="lang-option">
                <li onClick={() => i18n.changeLanguage("ar")} lang="ar" dir="rtl">
                  <div>العربية (AR)</div> <div>{i18n.language === "ar" && <i className="fa-solid fa-check"></i>}</div>
                </li>
                <li onClick={() => i18n.changeLanguage("en")}>
                  <div>English (EN)</div> <div>{i18n.language === "en" && <i className="fa-solid fa-check"></i>}</div>
                </li>
              </ul>
            </li>
            {user && <li><Link to="/profile">{t("profile")}</Link></li>}
          </ul>
          {loading ? <Loading width={20} height={20} /> : (user ? (
            <ul className="header-ul">
              <li 
                className="header-li-signout"
                onClick={() => {
                    signOut(auth).then(() => {
                      navigate("/")
                    }).catch((error) => {
                      // An error happened.
                    });
                  }}
              ><i className="fa-solid fa-arrow-right-from-bracket"></i> {user.displayName === null ? user.email : user.displayName}</li>
            </ul>
          ) : (
            <ul className="header-ul">
              <li><Link to="/signin">{t('signin')}</Link></li>
              <li><Link to="/signup">{t('signup')}</Link></li>
            </ul>
          ))}
          <ul className="header-ul">
            <li>
              <button 
                className="theme-btn" 
                onClick={() => {
                  toggleTheme(theme === "light" ? "dark" : "light")
                }}
              >
                {/* {theme.charAt(0).toUpperCase() + theme.slice(1)} <span></span> */}
                {theme === "light" ? t("light") : t("dark")} <span></span>
                {theme === "light" ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header