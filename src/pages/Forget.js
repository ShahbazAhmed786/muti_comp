import React, { useState } from 'react';
import { Email } from '@mui/icons-material';
import { TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Logo from '../Asset/images/Logo.jpg'; // Update the path to your logo

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/forgot-password', { email });

      if (response.data.success) {
        setSuccessMessage('A reset link has been sent to your email address.');
      } else {
        setError('Failed to send reset link. Please check your email and try again.');
      }
    } catch (err) {
      setError('An error occurred while trying to send the reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="h-screen flex items-center justify-center"
    style={{
      backgroundImage: `url(${Logo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}
  >
    <div
      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-75"
    />
      <motion.div
        className="relative bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="h-20 w-16 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Forgot Password</h2>
        <p className="text-gray-500 text-center mb-8">
          Enter your email address, and we’ll send you a link to reset your password.
        </p>

        {/* Success or Error Message */}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <span className="material-icons text-gray-400">
                  <Email />
                </span>
              ),
            }}
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(to right, #4facfe, #00f2fe)',
              color: 'white',
              py: 1.5,
              fontSize: '1rem',
              ':hover': {
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              },
            }}
            className="transition-transform transform hover:scale-105 duration-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <a href="/" className="text-blue-500 hover:underline">
            Back to Login
          </a>
        </div>
      </motion.div>
    </div>
 
  );
};

export default ForgetPasswordPage;
