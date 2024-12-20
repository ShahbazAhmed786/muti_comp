import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../Asset/images/Logo.jpg';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);

      if (response.status === 200) {
        const { token, role } = response.data;

        localStorage.setItem('authToken', token);

        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-20 mx-auto mb-4"
          />
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              className="bg-red-100 text-red-600 p-4 rounded-lg text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </motion.div>
          )}

          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="material-icons text-gray-400">email</i>
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="material-icons text-gray-400">lock</i>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #4facfe, #00f2fe)',
              color: 'white',
              py: 1.5,
              fontSize: '1rem',
              ':hover': {
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              },
            }}
          >
            Login
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <a
              href="/forgetpassword"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
            <p className="mt-2">
              Don’t have an account?{' '}
              <a
                href="/CompanyRegister"
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
