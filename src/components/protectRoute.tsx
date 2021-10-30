import React from 'react';
import { auth, firebase } from "../auth/firebase";
import OtpLogin from './otpLogin';

const ProtectRoute = ({ children }) => {
  const [userContext, setUserContext] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsReady(true);
      console.log("user", user);
      if (user) {
        setUserContext(true);
      } else {
        setUserContext(false);
      }
    });

    return unsubscribe;
  }, []);
  if(!isReady) {
    return <div>Loading...</div>
  }
  if (!userContext) {
    return <OtpLogin />;
  }
  return children;
};

export default ProtectRoute;