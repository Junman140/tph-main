"use client"

import { MainNav } from "@/components/layout/main-nav"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">Last Updated: May 8, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p>
              The Peculiar House Global ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when you register, contact us, or participate in our activities.</li>
              <li><strong>Account Information:</strong> Login credentials and profile information.</li>
              <li><strong>Prayer Requests and Testimonies:</strong> Content you submit for prayer requests or testimonies.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and actions taken.</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, device information, and other technology identifiers.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>To provide and maintain our services</li>
              <li>To process and respond to your requests, including prayer requests</li>
              <li>To send you information about our events, programs, and services</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraud and unauthorized transactions</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate our website and services.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
              <li><strong>Church Community:</strong> Prayer requests may be shared with our prayer team and congregation as specified in your submission.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Objection to processing of your personal information</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: thepeculiarhouseglobal@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
