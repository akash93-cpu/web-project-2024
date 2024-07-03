import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/passwordreset.css';
// import graphQLFetchData from './graphQLFetch.js'; not used here

export default function ResetPasswordComponent() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.forms.resetUserpassword;
    const variables = {
      token: token,
      newPassword: form.newPassword.value.trim(),
    }
    try {
      const response = await fetch('http://localhost:3000/graphql-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `mutation ResetUserpassword($token: String!, $newPassword: String!) {
  resetUserpassword(
    token: $token,
    newPassword: $newPassword,
  ) {
    email
  }
}`,
          variables: variables,
        }),
      });

      const { data } = await response.json();
      console.log(data);
      form.reset();
      setNewPassword('');
      window.close();
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className='reset-password-main-div'>
    <div className="password-reset-form-container">
      <form onSubmit={handleSubmit} name="resetUserpassword" className="password-reset-form">
        <input
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="password-input"
          name='newPassword'
        />
        <div className='label-box'>
          <input type="checkbox" id="showPassword" className="show-password-checkbox" onChange={togglePasswordVisibility} />
          <label htmlFor="showPassword" className="show-password-label">{showPassword ? 'Hide Password' : 'Show Password'}</label>
        </div>
        <button type="submit" className="reset-button">Reset Password</button>
      </form>
    </div>
    </div>
  );
}