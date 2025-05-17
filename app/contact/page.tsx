'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_ACCESS_KEY_HERE', // <-- Replace with your real key
        subject: 'New Contact Message',
        ...formData,
      }),
    })

    const result = await res.json()
    setLoading(false)

    if (result.success) {
      setResponseMessage('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } else {
      setResponseMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex flex-col items-center justify-start">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Contact Us</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <textarea 
            name="message" 
            rows={4} 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          ></textarea>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md transition-colors hover:bg-teal-500 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {responseMessage && (
            <p className="text-center text-sm text-gray-600">{responseMessage}</p>
          )}
        </form>

        <div className="border-t pt-6 text-sm text-gray-700 space-y-2">
          <p><strong>You may contact us using the information below:</strong></p>
          <p><strong>Merchant Legal Entity Name:</strong> RITESH SANTRAM GHUMATKAR</p>
          <p><strong>Registered Address:</strong> Tandulwadi, Shelke Wasti, Baramati, Tandulwadi, Tandulwadi Pune 413102</p>
          <p><strong>Operational Address:</strong>Baramati, 413102, Dist: Pune, MH, India.</p>
          <p><strong>Telephone No:</strong> 8380075733</p>
          <p><strong>Email ID:</strong> riteshprintstudio@gmail.com</p>
        </div>
      </div>
    </div>
  )
}
