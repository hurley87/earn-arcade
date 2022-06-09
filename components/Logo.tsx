import {SiApplearcade} from 'react-icons/si'
import Link from 'next/link'
import { useEffect, useState } from 'react';

const Logo = () => {
  const [matic, setMatic] = useState(0.0)

  useEffect(() => {
    async function loadMatic() {
        const res = await fetch("/api/matic", {
            body: JSON.stringify({
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });

        const response = await res.json();
        setMatic(response.amount)
    }
    loadMatic()
  }, [])

  return (
    <Link href="/">
    <div className='flex cursor-pointer'>
      <div className='bg-pink-700 rounded-lg text-2xl text-white p-2'><SiApplearcade /></div>
      <div className='text-white pl-2'>
        <h1 className='text-lg leading-6'>Arcade</h1>
        <p className='text-xs'>Rewards: 50 $MATIC</p>
      </div>
    </div>
  </Link>
  );
};

export default Logo;