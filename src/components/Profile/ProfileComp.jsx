import "./ProfileComp.css"
import { useTranslation } from 'react-i18next';
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";

function ProfileComp({user, deleteUser, signOut, auth}) {
  const { i18n } = useTranslation();
  const navigate = useNavigate()

  const deleteUserFromDB = () => {
    deleteUser(user).then(() => {
      signOut(auth).then(() => {
        navigate("/")
      }).catch((error) => {
        // An error happened.
      });
    }).catch((error) => {
      // An error ocurred
      // ...
    });
  }
  if (i18n.language === "ar") {
    return (
      <section className="profile-container"
        dir="rtl"
        lang="ar"
      >
        <div className="profile">
          <h2>البريد الإلكتروني: <span>{user?.email}</span></h2>
          <h2>التحقق: <span>{user?.emailVerified  ? "تم التحقق من البريد الإلكتروني" : "لم يتم التحقق من البريد الإلكتروني"}</span></h2>
          <h2>اسم المستخدم: <span>{user?.displayName}</span></h2>
          <h2>اخر تسجيل دخول: <span><Moment fromNow date={user?.metadata.lastSignInTime} locale={i18n.language}/></span></h2>
          <h2>تم إنشاء الحساب: <span><Moment fromNow date={user?.metadata.creationTime} locale={i18n.language}/></span></h2>
          <button 
            className="btn danger" 
            style={{marginTop: "20px"}}
            onClick={deleteUserFromDB}
          >
            حذف الحساب
          </button>
        </div>
      </section>
    )
  } else {
    return (
      <section className="profile-container">
        <div className="profile">
          <h2>Email: <span>{user?.email}</span></h2>
          <h2>verification: <span>{user?.emailVerified  ? "Email verified" : "Email not verified"}</span></h2>
          <h2>Username: <span>{user?.displayName}</span></h2>
          <h2>Last logged in: <span><Moment fromNow date={user?.metadata.lastSignInTime} locale={i18n.language}/></span></h2>
          <h2>Created account at: <span><Moment fromNow date={user?.metadata.creationTime} locale={i18n.language}/></span></h2>
          <button 
            className="btn danger" 
            style={{marginTop: "20px"}}
            onClick={deleteUserFromDB}
          >
            Delete Account
          </button>
        </div>
      </section>
    )
  }
}

export default ProfileComp