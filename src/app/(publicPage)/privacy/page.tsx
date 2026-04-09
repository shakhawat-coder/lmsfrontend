import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background pt-22 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <Button variant="ghost" asChild className="mb-8 hover:bg-muted font-semibold">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Link>
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400">
                    <h2>1. Information We Collect</h2>
                    <p>At BookNest, we collect several different types of information for various purposes to provide and improve our service to you.</p>
                    <ul>
                        <li><strong>Personal Data:</strong> Email address, First name and last name, Phone number, Address, etc.</li>
                        <li><strong>Usage Data:</strong> Information on how the service is accessed and used, such as your IP address, browser type, browser version, and the pages of our Service that you visit.</li>
                    </ul>

                    <h2>2. Use of Data</h2>
                    <p>BookNest uses the collected data for various purposes:</p>
                    <ul>
                        <li>To provide and maintain our Service.</li>
                        <li>To notify you about changes to our Service.</li>
                        <li>To allow you to participate in interactive features of our Service.</li>
                        <li>To provide customer support.</li>
                    </ul>

                    <h2>3. Data Security</h2>
                    <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

                    <h2>4. Cookies</h2>
                    <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                    <h2>5. Changes to This Privacy Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us via our Contact Page.</p>
                </div>
            </div>
        </div>
    );
}
