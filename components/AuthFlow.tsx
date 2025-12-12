import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Camera, 
  Linkedin, 
  Instagram,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Send
} from 'lucide-react';
import { UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthFlowProps {
  onComplete: (role: UserRole) => void;
  initialStep?: 'LOGIN' | 'SIGNUP' | 'VERIFY' | 'PROFILE';
}

type AuthStep = 'LOGIN' | 'SIGNUP' | 'VERIFY' | 'PROFILE';

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, initialStep = 'LOGIN' }) => {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [loading, setLoading] = useState(false);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    niche: '',
    bio: '',
    linkedinUrl: '',
    instagramHandle: ''
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (initialStep) setStep(initialStep);
  }, [initialStep]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setAuthError(null);
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
    }
    if (field === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || formData.password.length < 6) return;
    
    setLoading(true);
    setAuthError(null);

    try {
      await authService.signUpPractitioner({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        businessName: formData.businessName,
        niche: formData.niche
      });
      setStep('VERIFY');
    } catch (err: any) {
      console.error('Signup error:', err);
      setAuthError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setAuthError(null);
    setResendSuccess(null);
    try {
      await authService.resendVerificationEmail(formData.email);
      setResendSuccess("Email resent! Please check your inbox (and spam folder).");
    } catch (err: any) {
      console.error('Resend error:', err);
      // Supabase sometimes rate limits resends silently or throws specific errors
      setAuthError(err.message || 'Failed to resend email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCheck = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // Attempt to login with the credentials stored in state
      const { user } = await authService.login(formData.email, formData.password);
      
      if (user) {
        // Ensure profile created (Development shortcut / manual check)
        await authService.ensureProfileInitialized(user);

        // Allow immediate access
        onComplete(UserRole.PRACTITIONER);
      }
    } catch (err: any) {
      console.error('Verification check failed:', err);
      if (err.message.includes('Email not confirmed')) {
        setAuthError('Email not yet verified. Please click the link in your inbox.');
      } else {
        setAuthError(err.message || 'Could not verify session.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      // 1. Login with Supabase
      const { user } = await authService.login(formData.email, formData.password);
      
      if (!user) throw new Error('Login failed.');

      // 2. Ensure Profile Exists (Lazy Init)
      await authService.ensureProfileInitialized(user);

      // 3. Fetch Profile for Role
      const profile = await authService.getUserProfile(user.id);
      
      if (!profile) {
        if (isSuperAdminMode) {
           throw new Error('User profile not found.');
        }
        // If profile still missing, something is wrong, but we might proceed to onboarding?
      }

      // 4. Role verification
      if (isSuperAdminMode) {
        if (profile?.role !== 'super_admin') {
          await authService.logout();
          throw new Error('Access Denied — This portal is for Super Admins only.');
        }
        onComplete(UserRole.SUPER_ADMIN);
      } else {
        // Practitioner Login
        // Allow immediate access to dashboard on successful login
        onComplete(UserRole.PRACTITIONER);
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err.message || 'An error occurred during sign in.');
      if (err.message && err.message.includes('Access Denied')) {
        await authService.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    try {
      const session = await authService.getSession();
      if (!session?.user) throw new Error("No active session. Please login again.");

      let avatarUrl = undefined;
      
      if (avatarFile) {
        const url = await authService.uploadAvatar(session.user.id, avatarFile);
        if (url) avatarUrl = url;
      }

      await authService.completePractitionerProfile(session.user.id, {
        bio: formData.bio,
        avatarUrl,
        linkedinUrl: formData.linkedinUrl,
        instagramHandle: formData.instagramHandle
      });

      onComplete(UserRole.PRACTITIONER);
    } catch (err: any) {
      console.error("Profile completion error", err);
      setAuthError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERERS ---

  if (step === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-white relative overflow-hidden transition-all duration-500">
          
          {isSuperAdminMode && (
             <div className="absolute top-0 left-0 w-full bg-gray-900 text-yellow-400 text-xs font-bold py-2 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                 <ShieldCheck size={14}/> Super Admin Portal Access
             </div>
          )}

          <div className="text-center mb-10 mt-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 transition-colors ${isSuperAdminMode ? 'bg-yellow-400 text-black' : 'bg-gray-900'}`}>C</div>
            <h1 className="text-3xl font-bold text-gray-900">
               {isSuperAdminMode ? 'Admin Login' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          {authError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-600 font-medium">{authError}</p>
             </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4 ${isSuperAdminMode ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-900 text-white hover:bg-black'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (isSuperAdminMode ? 'Access Portal' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
             {!isSuperAdminMode && (
               <div className="text-sm text-gray-500">
                  Don't have an account? <button onClick={() => setStep('SIGNUP')} className="text-gray-900 font-bold hover:underline">Create Account</button>
               </div>
             )}
             
             <button 
                onClick={() => {
                   setIsSuperAdminMode(!isSuperAdminMode);
                   setAuthError(null);
                }}
                className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wider"
             >
                {isSuperAdminMode ? 'Switch to Practitioner Login' : 'Login as Super Admin'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'SIGNUP') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6 animate-fade-in">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-white">
          <div className="mb-8">
            <button onClick={() => setStep('LOGIN')} className="flex items-center text-gray-400 hover:text-gray-900 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} className="mr-1" /> Back to Login
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create Practitioner Account</h1>
            <p className="text-gray-500 mt-1">Join the platform to manage your coaching business.</p>
          </div>

          {authError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-600 font-medium">{authError}</p>
             </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 placeholder-gray-400 ${errors.email ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                  placeholder="name@business.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Create a strong password"
                />
              </div>
              {formData.password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Acme Coaching"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Niche</label>
                  <input 
                    type="text" 
                    required
                    value={formData.niche}
                    onChange={(e) => handleInputChange('niche', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 placeholder-gray-400"
                    placeholder="e.g. Wellness"
                  />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'VERIFY') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6 animate-fade-in">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] p-10 text-center shadow-xl border border-white">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-8">
            We've sent a verification link to <span className="font-bold text-gray-900">{formData.email}</span>. 
            Please check your inbox to verify your email.
          </p>

          {authError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-left">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-600 font-medium">{authError}</p>
             </div>
          )}

          {resendSuccess && (
             <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 text-left">
                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-green-600 font-medium">{resendSuccess}</p>
             </div>
          )}
          
          <div className="space-y-4">
             <button 
               onClick={handleVerificationCheck}
               disabled={loading}
               className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" /> : <>I've verified my email <ArrowRight size={16}/></>}
             </button>
             
             <div className="flex flex-col gap-2">
               <button 
                 onClick={handleResendEmail} 
                 disabled={loading}
                 className="text-sm text-gray-500 font-bold hover:text-gray-900 flex items-center justify-center gap-1"
               >
                 Didn't receive an email? Resend
               </button>
               
               <button 
                 onClick={() => setStep('LOGIN')} 
                 className="text-sm text-gray-400 font-medium hover:text-gray-900 mt-2"
               >
                 Return to Login
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'PROFILE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6 animate-fade-in">
        <div className="w-full max-w-[480px] bg-white rounded-[32px] p-8 shadow-xl border border-white">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-900">Complete Profile</h2>
             <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Step 2 of 2</span>
          </div>

          {authError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-600 font-medium">{authError}</p>
             </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center">
               <div className="relative group cursor-pointer">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-stone-100" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors">
                      <Camera size={24} className="mb-1" />
                      <span className="text-xs font-bold">Upload</span>
                    </div>
                  )}
                  <input type="file" onChange={handleAvatarChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <p className="text-xs text-gray-400 mt-2">Min 200x200px (PNG or JPG)</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                maxLength={500}
                required
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none h-32 resize-none text-gray-900 placeholder-gray-400"
                placeholder="Tell us about your coaching philosophy..."
              />
              <div className="text-right text-xs text-gray-400 mt-1">{formData.bio.length}/500</div>
            </div>

            {/* Socials */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Social Links (Optional)</label>
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <Linkedin size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="LinkedIn URL" 
                      className="flex-1 px-4 py-2 rounded-lg bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-gray-900 placeholder-gray-400" 
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <Instagram size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.instagramHandle}
                      onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                      placeholder="Instagram Handle" 
                      className="flex-1 px-4 py-2 rounded-lg bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm text-gray-900 placeholder-gray-400" 
                    />
                 </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Complete Setup'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};