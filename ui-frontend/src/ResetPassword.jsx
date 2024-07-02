import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import graphQLFetchData from './graphQLFetch.js';

export default function ResetPasswordComponent() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:3000/graphql-server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            mutation ResetUserpassword($changes: resetPassword!) {
  resetUserpassword(changes: {
    token: $token,
    newPassword: $newPassword
  }) {
    username
  }
}`,
            variables: { token, newPassword },
          }),
        });
  
        const { data } = await response.json();
        console.log(data.resetPassword); // Success message
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <button type="submit">Reset Password</button>
      </form>
    );
  }