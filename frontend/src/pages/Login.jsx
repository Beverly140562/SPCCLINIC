import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [state, setState] = useState('Sign Up');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUpNewUser, signInUser, session } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signUpNewUser(name, email, password);
      if (result?.error) {
        setError(result.error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signInUser(email, password);
      if (result?.error) {
        setError(result.error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      navigate("/")
    }
  }, [session])

  if (session) return null;

  

  return (
    <form 
      onSubmit={state === 'Sign Up' ? handleSignUp : handleSignIn} 
      className='min-h-[80vh] flex items-center justify-center'
    >
      <div className='flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='text-gray-500'>{state === 'Sign Up' ? 'Sign up to book an appointment' : 'Log in to your account'}</p>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-300'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-300'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-300'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-2 rounded-md text-base text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
        >
          {loading ? 'Processing...' : state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <p className='text-sm'>
          {state === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>
                Sign up here
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;
