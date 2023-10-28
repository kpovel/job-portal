import { type AppType } from "next/app";
import { AuthContext } from "~/utils/auth/authContext";
import useAuth from "~/utils/auth/useAuth";
import "~/styles/globals.css";
import Cookie from "js-cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const authToken = Cookie.get(AUTHORIZATION_TOKEN_KEY);
  const { currentUser, isLoading } = useAuth(authToken);

  return (
    <AuthContext.Provider value={currentUser}>
      {!isLoading && <Component {...pageProps} />}
    </AuthContext.Provider>
  );
};

export default MyApp;
