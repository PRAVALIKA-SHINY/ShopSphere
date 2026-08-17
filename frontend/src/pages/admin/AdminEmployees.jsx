import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Pencil,
  UserCheck,
  UserX,
  Trash2,
  X,
  Plus,
  Search,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react'

import { employeeApi } from '../../api/employeeApi'
import Loader from '../../components/Loader'

/* =========================================================
   INITIAL FORMS
========================================================= */

const blank = {
  name: '',
  email: '',
  password: '',
  mobile: '',
}

const editBlank = {
  name: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState(blank)

  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState(editBlank)

  const [query, setQuery] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  /* =========================================================
     MESSAGE HELPERS
  ========================================================= */

  const showSuccess = (text) => {
    setMessage(text)
    setMessageType('success')

    setTimeout(() => {
      setMessage('')
    }, 3500)
  }

  const showError = (text) => {
    setMessage(text)
    setMessageType('error')
  }

  /* =========================================================
     LOAD EMPLOYEES
  ========================================================= */

  const load = async () => {
    try {
      setLoading(true)

      const response = await employeeApi.getAll(0, 100)

      const data = response?.data?.data

      if (Array.isArray(data)) {
        setEmployees(data)
      } else if (Array.isArray(data?.content)) {
        setEmployees(data.content)
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error(
        'ADMIN EMPLOYEES LOAD ERROR:',
        error
      )

      showError(
        error.response?.data?.message ||
          'Could not load employees. Please check the backend.'
      )

      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /* =========================================================
     CREATE EMPLOYEE
  ========================================================= */

  const create = async (e) => {
    e.preventDefault()

    if (submitting) {
      return
    }

    /* -----------------------------------------
       PASSWORD VALIDATION
    ----------------------------------------- */

    if (form.password.length < 8) {
      showError(
        'Password must be at least 8 characters long.'
      )
      return
    }

    if (form.password.length > 100) {
      showError(
        'Password cannot be more than 100 characters.'
      )
      return
    }

    /* -----------------------------------------
       NAME VALIDATION
    ----------------------------------------- */

    if (!form.name.trim()) {
      showError(
        'Please enter the employee name.'
      )
      return
    }

    /* -----------------------------------------
       EMAIL VALIDATION
    ----------------------------------------- */

    if (!form.email.trim()) {
      showError(
        'Please enter the employee email.'
      )
      return
    }

    try {
      setSubmitting(true)
      setMessage('')

      await employeeApi.create({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        mobile: form.mobile.trim(),
      })

      /* Clear form */

      setForm(blank)

      showSuccess(
        'Employee created successfully.'
      )

      /* Reload employee list */

      await load()

    } catch (error) {
      console.error(
        'CREATE EMPLOYEE ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      showError(
        error.response?.data?.message ||
          'Could not create employee.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const openEdit = (employee) => {
    setEditId(employee.id)

    setEditForm({
      name: employee.name || '',
      mobile: employee.mobile || '',
      address: employee.address || '',
      city: employee.city || '',
      state: employee.state || '',
      pincode: employee.pincode || '',
    })

    setMessage('')
  }

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const cancelEdit = () => {
    setEditId(null)
    setEditForm(editBlank)
  }

  /* =========================================================
     SAVE EDIT
  ========================================================= */

  const save = async (e) => {
    e.preventDefault()

    if (!editId || submitting) {
      return
    }

    if (!editForm.name.trim()) {
      showError(
        'Employee name cannot be empty.'
      )
      return
    }

    try {
      setSubmitting(true)
      setMessage('')

      await employeeApi.update(
        editId,
        {
          ...editForm,
          name: editForm.name.trim(),
          mobile: editForm.mobile.trim(),
          address: editForm.address.trim(),
          city: editForm.city.trim(),
          state: editForm.state.trim(),
          pincode: editForm.pincode.trim(),
        }
      )

      setEditId(null)
      setEditForm(editBlank)

      showSuccess(
        'Employee details updated successfully.'
      )

      await load()

    } catch (error) {
      console.error(
        'UPDATE EMPLOYEE ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      showError(
        error.response?.data?.message ||
          'Could not update employee.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     ACTIVATE / DEACTIVATE
  ========================================================= */

  const toggleStatus = async (employee) => {
    const nextStatus =
      employee.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE'

    const action =
      nextStatus === 'ACTIVE'
        ? 'activate'
        : 'deactivate'

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${employee.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setSubmitting(true)
      setMessage('')

      await employeeApi.updateStatus(
        employee.id,
        nextStatus
      )

      showSuccess(
        `Employee ${
          nextStatus === 'ACTIVE'
            ? 'activated'
            : 'deactivated'
        } successfully.`
      )

      await load()

    } catch (error) {
      console.error(
        'UPDATE EMPLOYEE STATUS ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      showError(
        error.response?.data?.message ||
          'Could not update employee status.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     DELETE / DEACTIVATE
  ========================================================= */

  const remove = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${employee.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setSubmitting(true)
      setMessage('')

      await employeeApi.delete(employee.id)

      showSuccess(
        'Employee deactivated successfully.'
      )

      await load()

    } catch (error) {
      console.error(
        'DELETE EMPLOYEE ERROR:',
        error
      )

      console.error(
        'BACKEND RESPONSE:',
        error.response?.data
      )

      showError(
        error.response?.data?.message ||
          'Could not deactivate employee.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  const shown = useMemo(() => {
    const search = query
      .trim()
      .toLowerCase()

    if (!search) {
      return employees
    }

    return employees.filter((employee) => {
      return `${employee.name || ''} ${
        employee.email || ''
      } ${employee.mobile || ''} ${
        employee.status || ''
      }`
        .toLowerCase()
        .includes(search)
    })
  }, [employees, query])

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <Loader label="Loading employees…" />
    )
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

        <div>

          <span className="eyebrow">
            People
          </span>

          <h1 className="text-3xl font-display font-semibold mt-1">
            Employees
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Create staff accounts and control
            whether each account is active.
          </p>

        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading || submitting}
          className="btn-secondary !px-4 !py-2.5"
        >
          <RefreshCw
            size={15}
            className={
              loading
                ? 'animate-spin'
                : ''
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUCCESS / ERROR MESSAGE
      ===================================================== */}

      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${
            messageType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">

        {/* ===================================================
            CREATE EMPLOYEE
        =================================================== */}

        <form
          onSubmit={create}
          className="dashboard-card p-6 h-fit space-y-4"
        >

          {/* HEADER */}

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Plus size={18} />
            </div>

            <div>

              <h2 className="font-semibold text-lg">
                Add employee
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Credentials are created by admin.
              </p>

            </div>

          </div>

          {/* =================================================
              FULL NAME
          ================================================= */}

          <input
            className="input-field"
            required
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          {/* =================================================
              EMAIL
          ================================================= */}

          <input
            className="input-field"
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          {/* =================================================
              MOBILE
          ================================================= */}

          <input
            className="input-field"
            type="tel"
            placeholder="Mobile number"
            value={form.mobile}
            onChange={(e) =>
              setForm({
                ...form,
                mobile: e.target.value,
              })
            }
          />

          {/* =================================================
              PASSWORD

              THIS IS THE PART YOU ASKED ABOUT
          ================================================= */}

          <input
            className="input-field"
            required
            minLength={8}
            maxLength={100}
            type="password"
            placeholder="Temporary password (minimum 8 characters)"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <p className="text-xs text-slate-400 -mt-2">
            Password must contain at least 8
            characters.
          </p>

          {/* =================================================
              CREATE BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Creating employee...'
              : 'Create employee'}
          </button>

        </form>

        {/* ===================================================
            EMPLOYEE LIST
        =================================================== */}

        <div className="space-y-4">

          {/* SEARCH BAR */}

          <div className="dashboard-card p-3 flex items-center gap-3">

            <Search
              size={18}
              className="text-slate-400 flex-shrink-0"
            />

            <input
              className="w-full outline-none text-sm bg-transparent"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search employees by name, email or mobile..."
            />

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {shown.length}
            </span>

          </div>

          {/* LIST TITLE */}

          <div className="flex items-center justify-between px-1">

            <div>

              <h2 className="font-semibold text-lg text-slate-800">
                Employee List
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Manage your store staff accounts.
              </p>

            </div>

            <span className="text-xs text-slate-400">
              {employees.length} total
            </span>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {shown.length === 0 && (
            <div className="dashboard-card p-10 text-center">

              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">

                <Search
                  size={20}
                  className="text-slate-400"
                />

              </div>

              <h3 className="font-semibold mt-4">
                {employees.length === 0
                  ? 'No employees yet'
                  : 'No employees found'}
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                {employees.length === 0
                  ? 'Create your first employee using the form.'
                  : 'Try a different search term.'}
              </p>

            </div>
          )}

          {/* =================================================
              EMPLOYEE CARDS
          ================================================= */}

          {shown.map((employee) => (

            <div
              key={employee.id}
              className="dashboard-card p-5"
            >

              {/* =================================================
                  EDIT MODE
              ================================================= */}

              {editId === employee.id ? (

                <form
                  onSubmit={save}
                  className="space-y-4"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="font-semibold text-lg">
                        Edit employee
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        ID #{employee.id} •{' '}
                        {employee.email}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  {/* NAME */}

                  <input
                    className="input-field"
                    required
                    type="text"
                    placeholder="Full name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                  />

                  {/* MOBILE / PINCODE */}

                  <div className="grid sm:grid-cols-2 gap-3">

                    <input
                      className="input-field"
                      type="tel"
                      placeholder="Mobile"
                      value={editForm.mobile}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          mobile: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input-field"
                      type="text"
                      placeholder="Pincode"
                      value={editForm.pincode}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          pincode: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input-field"
                      type="text"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          city: e.target.value,
                        })
                      }
                    />

                    <input
                      className="input-field"
                      type="text"
                      placeholder="State"
                      value={editForm.state}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          state: e.target.value,
                        })
                      }
                    />

                  </div>

                  {/* ADDRESS */}

                  <input
                    className="input-field"
                    type="text"
                    placeholder="Address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        address: e.target.value,
                      })
                    }
                  />

                  {/* EDIT ACTIONS */}

                  <div className="flex gap-2">

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary disabled:opacity-60"
                    >
                      {submitting
                        ? 'Saving...'
                        : 'Save details'}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              ) : (

                /* =================================================
                   NORMAL EMPLOYEE VIEW
                ================================================= */

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* EMPLOYEE DETAILS */}

                  <div className="min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <p className="font-semibold text-lg text-slate-800">
                        {employee.name}
                      </p>

                      <span className="text-xs text-slate-400">
                        #{employee.id}
                      </span>

                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">

                      <p className="text-sm text-slate-500 flex items-center gap-1.5">

                        <Mail size={14} />

                        {employee.email}

                      </p>

                      <p className="text-sm text-slate-500 flex items-center gap-1.5">

                        <Phone size={14} />

                        {employee.mobile ||
                          'No phone'}

                      </p>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mt-3 ${
                        employee.status ===
                        'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          employee.status ===
                          'ACTIVE'
                            ? 'bg-emerald-500'
                            : 'bg-slate-400'
                        }`}
                      />

                      {employee.status}

                    </span>

                  </div>

                  {/* =================================================
                      ACTION ICONS
                  ================================================= */}

                  <div className="flex items-center gap-2">

                    {/* EDIT */}

                    <button
                      type="button"
                      title="Edit employee"
                      onClick={() =>
                        openEdit(employee)
                      }
                      disabled={submitting}
                      className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-50"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* ACTIVATE / DEACTIVATE */}

                    <button
                      type="button"
                      title={
                        employee.status ===
                        'ACTIVE'
                          ? 'Deactivate employee'
                          : 'Activate employee'
                      }
                      onClick={() =>
                        toggleStatus(employee)
                      }
                      disabled={submitting}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition disabled:opacity-50 ${
                        employee.status ===
                        'ACTIVE'
                          ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >

                      {employee.status ===
                      'ACTIVE' ? (
                        <UserX size={16} />
                      ) : (
                        <UserCheck size={16} />
                      )}

                    </button>

                    {/* DELETE / DEACTIVATE */}

                    <button
                      type="button"
                      title="Deactivate employee"
                      onClick={() =>
                        remove(employee)
                      }
                      disabled={submitting}
                      className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-red-500 hover:bg-rose-100 flex items-center justify-center transition disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}