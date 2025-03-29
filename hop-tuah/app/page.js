'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page when the component mounts
    router.push('/login');
  }, [router]);

  // Optional: You can return a loading state or nothing
  // The content won't be visible because of the redirect
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(to bottom, #8FA6C3 0%, white 50%)',
    }}>
      <h1 style={{ 
        color: '#24154A', 
        fontSize: '2rem',
        fontFamily: 'sans-serif'
      }}>
      </h1>
    </div>
  );
}
