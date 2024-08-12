import { useState, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css'
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
    const history = useHistory();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const switchAuthModuleHandler = () => {
        setIsLogin((prevState) => !prevState);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: Add validation
        setIsLoading(true);
        if(isLogin) {
            fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBKniczVLNJrXICnBbwj2W29ttGPgAtKCY',{
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then((res) => {
                setIsLoading(false);
                if(res.ok){
                    return res.json().then(data => {
                        authCtx.login(data.idToken);
                        history.replace('/profile');
                    }) 
                    
                } else{
                    return res.json().then(data => {
                        // show an error modal
                        let errorMessage = 'Authentication failed!';
                        if(data && data.error && data.error.message){
                            errorMessage = data.error.message;
                        }
                        alert(errorMessage)
                    })
                }
            })

        } else{
            fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBKniczVLNJrXICnBbwj2W29ttGPgAtKCY', {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                setIsLoading(false);
                if(res.ok) {
                    // ...
                    return res.json().then(data => {
                        authCtx.login(data.idToken);
                        history.replace('/');
                    }) 

                } else {
                    return res.json().then(data => {
                        // show an error modal
                        let errorMessage = 'Authentication failed!';
                        if(data && data.error && data.error.message){
                            errorMessage = data.error.message;
                        }
                         alert(errorMessage);
                    })
                }
            })
        }
    }
    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailInputRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' required ref={passwordInputRef}/>
                </div>
                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    {isLoading && <p>Sending request...</p>}
                    <button
                    type='button'
                    className={classes.toggle}
                    onClick={switchAuthModuleHandler}>
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AuthForm