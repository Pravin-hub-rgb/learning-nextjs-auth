'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div >
      <h2 className='text-center text-2xl font-extrabold mt-6'>🔰 Level 2: Supabase Auth</h2>

      <p className="m-6 text-center font-bold">Take me to the <Link className="underline text-amber-300" href='/secret'>Secret Route</Link></p>
      <p className="mt-30 text-center">Note: after signup you have to confirm your email, then only you can login!!</p>
    </div>
  );
}
