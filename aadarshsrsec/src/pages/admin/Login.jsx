import React, { useState } from 'react';
import { loginAdmin } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom'; 
import image1 from '../../assets/banner1.jpg'
const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { user, error: authError } = await loginAdmin(formData.email, formData.password);

    if (user) {
      navigate('/'); 
    } else {
      let errorMsg = "Failed to login.";
      if (authError.includes('user-not-found')) errorMsg = "Admin account not found.";
      if (authError.includes('wrong-password')) errorMsg = "Incorrect password.";
      setError(errorMsg);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: School Image (Changed to 1/2 width) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-900">
        <img 
          src={image1}
          alt="School Campus" 
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        
        {/* Red/Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-red-900/60 to-blue-800/60 mix-blend-multiply"></div>

        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-lg text-gray-200">School Administration Portal</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form (Changed to 1/2 width) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shadow-xl z-20">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-red-900">Admin Login</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your credentials to access the panel</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-900 text-red-900 text-sm rounded shadow-sm">
              <p className="font-medium">Error</p>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900 outline-none transition-all"
                placeholder="admin@school.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 ease-in-out
                ${loading ? 'opacity-70 cursor-not-allowed scale-100' : 'hover:scale-[1.02]'}`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center mt-6">
              <a href="#" className="text-sm text-blue-800 hover:text-red-900 hover:underline font-medium">
                Forgot your password?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;