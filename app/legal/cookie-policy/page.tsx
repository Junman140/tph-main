import { MainNav } from "@/components/layout/main-nav"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">Last Updated: May 8, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies enhance user experience by remembering your preferences and enabling certain features.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
            <p>
              The Peculiar House Global website uses cookies for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.</li>
              <li><strong>Analytics Cookies:</strong> We use analytics cookies to collect information about how visitors use our website. This helps us improve our website by reporting on how you use it.</li>
              <li><strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.</li>
              <li><strong>Authentication Cookies:</strong> These cookies help us identify you when you log in to our website so we can provide you with personalized content and experiences.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website. These third parties may include:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Google Analytics (for website analytics)</li>
              <li>Social media platforms (for sharing and engagement features)</li>
              <li>Payment processors (for secure transactions)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
            </p>
            <p className="mt-4">
              To manage cookies in different browsers, please refer to the following links:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Cookie Consent</h2>
            <p>
              When you first visit our website, you will be shown a cookie banner requesting your consent to set cookies. By clicking &quot;Accept All Cookies,&quot; you consent to the use of all cookies described in this policy. You can also choose to set your preferences by clicking &quot;Cookie Settings.&quot;
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Our Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
            <p className="mt-4">
              We encourage you to review this Cookie Policy periodically to stay informed about how we are using cookies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
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
