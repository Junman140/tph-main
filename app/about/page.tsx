import AboutPage from "@/components/pages/about-page"
import { MainNav } from "@/components/layout/main-nav"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <AboutPage />
    </div>
  )
}

