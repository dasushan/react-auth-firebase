import React, { useState, useRef, useEffect } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutTimerRef = useRef(null);

  const loginHandler = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    console.log('logout')
  };

  useEffect(() => {
    if (userIsLoggedIn) {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      console.log('effect ran')
      logoutTimerRef.current = setTimeout(() => {
        logoutHandler();
      }, 300000);
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [userIsLoggedIn]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
