"use client"

import { MainNav } from "@/components/layout/main-nav"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">Last Updated: May 8, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">General Disclaimer</h2>
            <p>
              The information provided on The Peculiar House Global website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Not Professional Advice</h2>
            <p>
              The content on our website is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
            <p className="mt-4">
              Similarly, our content is not intended to be a substitute for professional legal, financial, or spiritual counseling. We encourage you to seek appropriate professional advice for specific situations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Religious Content</h2>
            <p>
              The Peculiar House Global is a religious organization, and our website contains religious content based on our faith and beliefs. The interpretations, views, and opinions expressed on our website represent our understanding of scripture and religious teachings but may not be universally accepted by all religious denominations or individuals.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">External Links Disclaimer</h2>
            <p>
              Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with The Peculiar House Global. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Testimonials and Results</h2>
            <p>
              The testimonials and prayer requests displayed on our website are real experiences shared by our community members. However, they are personal experiences that may not be representative of all who participate in our services or programs. Individual results may vary.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Errors and Omissions</h2>
            <p>
              While we strive to keep the information on our website up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website for any purpose.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Fair Use Disclaimer</h2>
            <p>
              This website may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research. We believe this constitutes a &quot;fair use&quot; of any such copyrighted material as provided for in section 107 of the United States Copyright Law.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">No Responsibility Disclaimer</h2>
            <p>
              The information on the website is provided with the understanding that The Peculiar House Global is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal, or other competent advisers.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">&quot;Use at Your Own Risk&quot; Disclaimer</h2>
            <p>
              All information in this website is provided &quot;as is,&quot; with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.
            </p>
            <p className="mt-4">
              The Peculiar House Global will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by the website or for any consequential, special, or similar damages, even if advised of the possibility of such damages.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Disclaimer, please contact us at:
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
