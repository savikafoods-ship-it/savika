'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react'

export default function ContactPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        // This simulates hooking into a serverless backend
        await new Promise(r => setTimeout(r, 1500))
        
        setLoading(false)
        setSuccess(true)
        
        setTimeout(() => setSuccess(false), 5000)
    }

    return (
        <main className="pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center space-y-4 mb-16 animate-fadeUp">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2E2E2E]">Get in Touch</h1>
                    <p className="text-[#5A5A5A] text-lg max-w-2xl mx-auto">
                        Whether you have a question about our spices, bulk orders, or just want to say hello, we&apos;re here for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-12 bg-white rounded-3xl shadow-xl border border-[#F0E8DC] overflow-hidden">
                    
                    {/* Contact Information */}
                    <div className="md:col-span-2 bg-[#1A1A1A] p-10 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-[#C47F17] shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Our Headquarters</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">Savika Foods Pvt. Ltd.<br />Umbergaon,<br />Gujarat - 396171,<br />India</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-[#C47F17] shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone Number</h3>
                                        <p className="text-gray-400 text-sm">+91 98981 76667</p>
                                        <p className="text-gray-400 text-xs mt-1">Mon-Fri from 9am to 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-[#C47F17] shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Email Support</h3>
                                        <p className="text-gray-400 text-sm">savikafoods@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12 text-gray-500 text-sm">
                            <p>For wholesale inquiries, please contact savikafoods@gmail.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-3 p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2E2E2E]">First Name *</label>
                                    <input required type="text" className="w-full bg-[#F9F4EE] border border-transparent focus:border-[#C47F17] focus:bg-white rounded-xl px-4 py-3 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2E2E2E]">Last Name *</label>
                                    <input required type="text" className="w-full bg-[#F9F4EE] border border-transparent focus:border-[#C47F17] focus:bg-white rounded-xl px-4 py-3 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2E2E2E]">Email Address *</label>
                                <input required type="email" className="w-full bg-[#F9F4EE] border border-transparent focus:border-[#C47F17] focus:bg-white rounded-xl px-4 py-3 outline-none transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2E2E2E]">Subject</label>
                                <select className="w-full bg-[#F9F4EE] border border-transparent focus:border-[#C47F17] focus:bg-white rounded-xl px-4 py-3 outline-none transition-all cursor-pointer">
                                    <option>General Inquiry</option>
                                    <option>Order Status</option>
                                    <option>Returns & Refunds</option>
                                    <option>Bulk / Wholesale</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2E2E2E]">Message *</label>
                                <textarea required rows={5} className="w-full bg-[#F9F4EE] border border-transparent focus:border-[#C47F17] focus:bg-white rounded-xl px-4 py-3 outline-none transition-all resize-y" placeholder="How can we help you?" />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || success}
                                className="w-full bg-[#C17F24] hover:bg-[#8B5E16] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {!loading && !success && <><Send className="w-5 h-5" /> Send Message</>}
                                {success && 'Message Sent Successfully!'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    )
}
