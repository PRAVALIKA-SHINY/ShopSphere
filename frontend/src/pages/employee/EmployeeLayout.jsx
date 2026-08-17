import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardShell from '../../components/DashboardShell'

export default function EmployeeLayout() {
  return (
    <DashboardShell type="employee">
      <Outlet />
    </DashboardShell>
  )
}