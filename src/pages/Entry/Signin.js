import "./Entry.css";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../components";

function Signin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const [emailForgetPassword, setEmailForgetPassword] = useState("");
  const [showMsgSendPassword, setShowMsgSendPassword] = useState(false);
  const [addForgetPasswordClass, setAddForgetPasswordClass] = useState("");
  const [isDarkScreenActive, setIsDarkScreenActive] = useState(false);
  const [isSigninLoading, setIsSigninLoading] = useState(false);

  const userRef = useRef();
  const userForgetRef = useRef();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [email, password]);

  const switchMsg = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        errorCode = "user not found";
        break;
      case "auth/wrong-password":
        errorCode = "wrong password";
        break;
      case "auth/invalid-email":
          errorCode = "invalid email";
        break;
      case "auth/missing-email":
        errorCode = "missing email";
        break;
      case "auth/internal-error":
        errorCode = "missing password";
        break;
      case "auth/too-many-requests":
        errorCode = "too many requests, please try again later.";
        break;

      default:
        errorCode = "Error";
        break;
    }
    return errorCode
  }

  const signinAuth = async (e) => {
    e.preventDefault();
    setIsSigninLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setErrorMsg("");
        navigate("/");
      })
      .catch((error) => {
        let errorCode = error.code;
        setErrorMsg(switchMsg(errorCode));
      });
    setIsSigninLoading(false)
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, emailForgetPassword)
      .then(() => {
        setShowMsgSendPassword("Please check your email")
      })
      .catch((error) => {
        const errorCode = error.code;
        setShowMsgSendPassword(switchMsg(errorCode))
      });
  };

  if (!user) {
    return (  
      <>
        {isDarkScreenActive && <div className={`dark-screen ${addForgetPasswordClass}`}></div>}
        <div className="entry-container">
          {errorMsg && (
            <div className="error-msg">
              <p>{errorMsg}</p>
            </div>
          )}
        
          <form className={`forget-password ${addForgetPasswordClass}`}>
            <h3>{t("write")} {t("email")}</h3>
            <div
              className="close"
              onClick={() => setAddForgetPasswordClass("hide-forget-password")}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
        
            <input 
              type="email" 
              placeholder={t("email")} 
              ref={userForgetRef}
              value={emailForgetPassword}
              onChange={(e) => setEmailForgetPassword(e.target.value)}
              required 
            />
            <button
              className="btn secondry btn-block"
              onClick={(e) => {
                e.preventDefault();
                resetPassword();
              }}
            >
              {t("reset")} {t("pass")}
            </button>
            {showMsgSendPassword && <h4>{t(showMsgSendPassword)}</h4>}
          </form>
        
          <form className="entry">
            <h3
              dir= {i18n.language === "ar" ? "rtl" : null}
              lang= {i18n.language === "ar" ? "ar" : "en"}
            >{t("signin")}</h3>
            {/* <br /> */}
            <input
              // dir= {i18n.language === "ar" ? "rtl" : null}
              // lang= {i18n.language === "ar" ? "ar" : "en"}
              type="email"
              placeholder= {t("email")}
              ref={userRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder= {t("pass")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              customClass="white btn-block"
              onClick={e => signinAuth(e)}
              isDisabled={isSigninLoading}
              isLoading={isSigninLoading}
            >
              {t("submit")}
            </Button>
            <div className="entry-info">
              <p
                dir= {i18n.language === "ar" ? "rtl" : null}
                lang= {i18n.language === "ar" ? "ar" : "en"}
              >
                {i18n.language === "ar" ? "اذا كنت لا تمتلك حساب" : "If you don't have account"}{" "}
                <span>
                  <Link to="/signup">{t("signup")} {t("here")}</Link>
                </span>
              </p>
              <p
                dir= {i18n.language === "ar" ? "rtl" : null}
                lang= {i18n.language === "ar" ? "ar" : "en"}
              >
                <Link
                  onClick={() => {
                    setIsDarkScreenActive(true)
                    userForgetRef.current.focus();
                    setAddForgetPasswordClass("show-forget-password")
                  }}
                >
                  {i18n.language === "ar" ? "هل نسيت الرمز السري؟" : "Forget your password?"}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default Signin;
