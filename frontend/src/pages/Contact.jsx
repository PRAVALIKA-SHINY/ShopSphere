import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [sent, setSent] = useState(false)

  const submit = (event) => {
    event.preventDefault()

    setSent(true)

    setForm({
      name: '',
      email: '',
      message: '',
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      <div className="max-w-3xl">
        <span className="eyebrow">
          Get in touch
        </span>

        <h1 className="text-4xl font-display font-semibold text-slate-800 mt-2">
          We'd love to hear from you.
        </h1>

        <p className="text-slate-500 mt-3 leading-7">
          Have a question about ShopSphere?
          Send us a message and our team will get back
          to you.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 mt-10">

        {/* CONTACT INFORMATION */}
        <div className="space-y-4">

          <div className="dashboard-card p-6">
            <Mail
              size={22}
              className="text-brand-600"
            />

            <h3 className="font-semibold text-slate-800 mt-4">
              Email
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              support@shopsphere.example
            </p>
          </div>

          <div className="dashboard-card p-6">
            <Phone
              size={22}
              className="text-emerald-600"
            />

            <h3 className="font-semibold text-slate-800 mt-4">
              Phone
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              +91 90000 00000
            </p>
          </div>

          <div className="dashboard-card p-6">
            <MapPin
              size={22}
              className="text-rose-500"
            />

            <h3 className="font-semibold text-slate-800 mt-4">
              Location
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              India
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="dashboard-card p-6 sm:p-8">
          {sent && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 text-sm mb-5">
              Your message has been received. Thank
              you for contacting ShopSphere!
            </div>
          )}

          <form
            onSubmit={submit}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Name
              </label>

              <input
                required
                className="input-field mt-2"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                required
                type="email"
                className="input-field mt-2"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>

              <textarea
                required
                rows={6}
                className="input-field mt-2"
                value={form.message}
                onChange={(event) =>
                  setForm({
                    ...form,
                    message: event.target.value,
                  })
                }
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              <Send size={17} />
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}