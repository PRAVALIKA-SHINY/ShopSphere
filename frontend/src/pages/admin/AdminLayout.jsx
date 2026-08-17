import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardShell from '../../components/DashboardShell'

export default function AdminLayout() {
  const links = [
    {
      to: '/admin',
      label: 'Overview',
    },
    {
      to: '/admin/employees',
      label: 'Employees',
    },
    {
      to: '/admin/customers',
      label: 'Customers',
    },
    {
      to: '/admin/catalog',
      label: 'Products & Catalogue',
    },
    {
      to: '/admin/orders',
      label: 'Orders',
    },
  ]

  return (
    <DashboardShell
      title="Admin Control Room"
      subtitle="Manage your store, employees, customers, products and orders."
      links={links}
    >
      <Outlet />
    </DashboardShell>
  )
}