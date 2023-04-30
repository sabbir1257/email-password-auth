import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Register = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  const handleEmailChange = (event) => {
    console.log(event.target.value);
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    // 1. prevent page refresh
    event.preventDefault();
    setSuccess('');
    // 2. collect form data
    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.name.value; 
    console.log(name, email, password);
    // validate
    if (!/(?=.*[A-Z])/.test(password)) {
        setError('Please add at least one uppercase');
        return;
    }
    else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
        setError('Please add at least two numbers');
        return
    }
    else if (password.length < 6) {
        setError('Please add at least 6 characters in your password')
        return;
    }
    //3. create user in fb
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        setError('');
        event.target.reset()
        setSuccess('User has created success')
        sendVerificationEmail(result.user);
        updateUserData(result.user, name);
      })
      .catch((error) => {
        console.error(error.massage);
        setError(error.massage);
      });
  };

  const sendVerificationEmail = (user) => {
    sendEmailVerification(user)
    .then(result => {
      console.log(result);
      alert('Please verify your email')
    })
  }

  const updateUserData = (user, name) => {
    updateProfile(user, {
      displayName: name
    })
    .then( () => {
      console.log('user name updated');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const handlePasswordBlur = (event) => [console.log(event.target.value)];
  return (
    <div className="w-50 mx-auto ">
      <h2>register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Your N~ame"
          required
        />
        <br />
        <input
          onChange={handleEmailChange}
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          required
        />
        <br />
        <input
          onBlur={handlePasswordBlur}
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          required
        />
        <br />
        <input type="submit" value="Register" />
      </form>
      <p><small>Already have an account? Please <Link to="/login">Login</Link> </small></p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Register;
