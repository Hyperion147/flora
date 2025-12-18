'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/app/supabase/client';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <FcGoogle className="w-5 h-5" />
      Sign in with Google
    </Button>
  );
}