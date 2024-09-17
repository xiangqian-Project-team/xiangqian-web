'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { setItem } from '../utils/storage';

const apiURI = 'http://api.xiangqian.tech';
const hostURI = 'http://127.0.0.1:3000';

export default function WechatAuthCallback() {
  const searchParams = useSearchParams();
  const route = useRouter();

  const fetchData = async () => {
    const option = {
      method: 'POST',
      body: JSON.stringify({ code: searchParams.get('code') }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(`${apiURI}/wechat/auth`, option);

    if (!res.ok) {
      return;
    }

    const data: { Token: string } = await res.json();

    setItem('token', data.Token);

    route.replace(`${hostURI}/`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return null;
}
