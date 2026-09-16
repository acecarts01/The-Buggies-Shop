import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import LoginForm from './LoginForm';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await isAdminRequest()) redirect(next && next.startsWith('/admin/') ? next : '/admin/orders/');
  return <LoginForm next={next && next.startsWith('/admin/') ? next : '/admin/orders/'} />;
}
