import "./Profile.css"
import { useTranslation } from "react-i18next";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../firebase/config"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { ProfileComp, VerifyEmail, Loading } from "../../components/index";
import { sendEmailVerification, deleteUser, signOut } from "firebase/auth";

function Secret() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const [user, loading, error] = useAuthState(auth);

  // For Old User
  const dateOldAccount = new Date(user?.metadata.creationTime)
  const isOldAccount = user && (dateOldAccount.getDate() <= 16 && dateOldAccount.getMonth() <= 1 && dateOldAccount.getMonth() <= 2023)
  
  // not logged In
  useEffect(() => {
    if (!user && !loading) {
      navigate("/")
    }
  }, [navigate, user, loading])

  const sendEmailVerify = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert(t("Email verify sent"))
      });
  }

  // || Logged In:
  // Loading
  if (loading) {
    return <Loading />;
  }

  // Error
  if (error) {
    return <h2>{error.message}</h2>;
  }

  // Not Verify and not Old User
  if (user && (!user.emailVerified && !isOldAccount)) {
    return <VerifyEmail 
      sendEmailVerify={sendEmailVerify}
    />
  }

  // Verified or old User
  if ((user && user.emailVerified) || (user && isOldAccount)) {
    return (
      <ProfileComp user={user} deleteUser={deleteUser} signOut={signOut} auth={auth} />
    )
  }
}

export default Secret