import "./Entry.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { auth } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { VerifyEmail, Button } from "../../components";

function Signup() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [showHelpMsg, setShowHelpMsg] = useState("");
  const [isSiginupLoading, setIsSiginupLoading] = useState(false);
  const userRef = useRef();

  // For Old User
  const dateOldAccount = new Date(user?.metadata.creationTime)
  const isOldAccount = user && (dateOldAccount.getDate() <= 16 && dateOldAccount.getMonth() <= 1 && dateOldAccount.getMonth() <= 2023)

  useEffect(() => {
    if ((user && user.emailVerified) || (user && isOldAccount)) {
      navigate("/");
    }
  }, [navigate, user, isOldAccount]);

  useEffect(() => {
    setErrorMsg("");
  }, [email, password]);

  const signupAuth = async (e) => {
    e.preventDefault();
    setIsSiginupLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.emailVerified)

        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("Email verification sent!")
          });

        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            // Signed in
            // navigate("/");
          })
          .catch((error) => {
            setErrorMsg(error.code);
          });
      })
      .catch((error) => {
        let errorCode = error.code;

        switch (errorCode) {
          case "auth/invalid-email":
            errorCode = "invalid email";
            break;
          case "auth/missing-email":
            errorCode = "missing email";
            break;
          case "auth/weak-password":
            errorCode = "weak password";
            break;
          case "auth/internal-error":
            errorCode = "missing password";
            break;
          case "auth/email-already-in-use":
            errorCode = "email already in use";
            break;
          case "auth/too-many-requests":
            errorCode = "too many requests, please try again later.";
            break;

          default:
            errorCode = "Error";
            break;
            
        }
        setErrorMsg(errorCode);
      });
      setIsSiginupLoading(false)
  };

  const sendEmailVerify = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert(t("Email verify sent"))
      });
      setShowHelpMsg(t("Please check the span mails box in your Email when you do not receive the sent mail"))
  }

  useEffect(() => {
    userRef.current.focus();
  }, []);

  if (!user) {
    return (
      <div className="entry-container">
        {errorMsg && (
          <div className="error-msg">
            <p>{errorMsg && t(errorMsg)}</p>
          </div>
        )}
        <form 
          className="entry"
        >
          <h3
            dir={i18n.language === "ar" ? "rtl" : null}
            lang={i18n.language}
          >
            {t("register")}</h3>
          <input
            type="text"
            placeholder={t("name") +" "+ t("user")}
            ref={userRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t("pass")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />        
          <Button 
            customClass="white btn-block"
            onClick={signupAuth}
            isDisabled={isSiginupLoading}
            isLoading={isSiginupLoading}
          >
            {t("submit")}
          </Button>
          <div className="entry-info">
            <p
              dir={i18n.language === "ar" ? "rtl" : null}
              lang={i18n.language}
            >
              {i18n.language === "ar" ? "اذا كنت لا تمتلك حساب" : "If you have an account"}
              <br />
              <span>
                <Link to="/signin">{t("signin")} {t("here")}</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    );
  }

  if (user && (!user.emailVerified && !isOldAccount)) {
    return <VerifyEmail 
      sendEmailVerify={sendEmailVerify}
      showHelpMsg={showHelpMsg}
    />
  }
  
}

export default Signup;
