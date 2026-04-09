import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-8 hover:bg-muted font-semibold">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Terms and Conditions</h1>
                    <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400">
                    <h2>1. Introduction</h2>
                    <p>Welcome to BookNest. By accessing this website and using our library management services, you accept these terms and conditions in full. Do not continue to use BookNest's website if you do not accept all of the terms and conditions stated on this page.</p>
                    
                    <h2>2. Intellectual Property Rights</h2>
                    <p>Unless otherwise stated, BookNest and/or its licensors own the intellectual property rights for all material on BookNest. All intellectual property rights are reserved. You may view and/or print pages from our website for your own personal use subject to restrictions set in these terms and conditions.</p>
                    
                    <h2>3. User Responsibilities</h2>
                    <p>As a user of the BookNest platform, you agree to:</p>
                    <ul>
                        <li>Maintain the confidentiality of your account information.</li>
                        <li>Not use the service for any illegal or unauthorized purpose.</li>
                        <li>Return borrowed digital or physical assets within the agreed timeframe.</li>
                        <li>Pay any applicable fines for overdue returns.</li>
                    </ul>
                    
                    <h2>4. Membership and Subscriptions</h2>
                    <p>BookNest offers various membership plans. By subscribing, you agree to pay all applicable fees associated with your chosen plan. Memberships are strictly non-transferable.</p>
                    
                    <h2>5. Limitation of Liability</h2>
                    <p>In no event shall BookNest, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this website.</p>
                    
                    <h2>6. Governing Law</h2>
                    <p>These terms and conditions are governed by and construed in accordance with the laws of our jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                </div>
            </div>
        </div>
    );
}
