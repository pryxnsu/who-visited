'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-sm rounded-2xl p-4">
        <div className="mb-10 flex flex-col items-center text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-black md:text-4xl">Login to WhoVisited</h1>
          <p className="text-sm text-gray-500">Sign in to continue tracking your visitors.</p>
        </div>

        <div>
          <Button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            variant="outline"
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="mt-8 text-center text-xs leading-relaxed text-gray-500">
          By signing in, you agree to our{' '}
          <a
            href="/terms-of-service"
            className="font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-gray-900"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="/privacy-policy"
            className="font-medium text-gray-700 underline underline-offset-2 transition-colors hover:text-gray-900"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
