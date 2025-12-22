"use client"

import { useState } from "react"
import { createMessage } from "@/lib/actions/message"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const data = {
            senderName: formData.get("name") as string,
            senderEmail: formData.get("email") as string,
            subject: formData.get("subject") as string,
            content: formData.get("message") as string,
        }

        try {
            await createMessage(data)
            toast({
                title: "Message Sent",
                description: "We've received your message and will get back to you shortly.",
            })
            // Reset form
            const form = document.getElementById("contact-form") as HTMLFormElement
            if (form) form.reset()
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="contact-form" action={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-400">Name</Label>
                    <Input id="name" name="name" required placeholder="Your name" className="bg-slate-900 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-400">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="your@email.com" className="bg-slate-900 border-slate-700 text-white" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-400">Subject</Label>
                <Input id="subject" name="subject" required placeholder="How can we help?" className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-400">Message</Label>
                <Textarea id="message" name="message" required rows={6} placeholder="Your message..." className="bg-slate-900 border-slate-700 text-white" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-6 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                {loading ? "Sending..." : "Send Message"}
            </Button>
        </form>
    )
}
