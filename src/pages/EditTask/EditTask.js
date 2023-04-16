import "./EditTask.css";
import { IndividualEditTask,Loading } from "../../components/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";

function EditTask() {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    return <h3>{error.message}</h3>;
  }

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return (
      <>
        <IndividualEditTask
          user={user}
          db={db}
        />
      </>
    );
  }
}

export default EditTask;
