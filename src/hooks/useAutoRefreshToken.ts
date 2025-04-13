'use client';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { differenceInMinutes } from 'date-fns';
function useAutoRefreshToken(exp: number) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = new Date(exp * 1000);
      const now = new Date();
      const difference = differenceInMinutes(timeLeft, now);
      console.log('Difference:', difference);
      //   if (timeLeft < 5 * 60 * 1000) {
      //     fetch('/api/auth/refresh-token')
      //       .then((res) => res.json())
      //       .then((data) => {
      //         update({
      //           ...session,
      //           accessToken: data.accessToken,
      //           accessTokenExpires: Date.now() + data.expiresIn * 1000,
      //         });
      //       })
      //       .catch((error) => {
      //         console.error('Failed to refresh token', error);
      //         signIn();
      //       });
      //   }
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
}

export default useAutoRefreshToken;
