import { Hero } from '../components/home/Hero'
import { ServicesSection } from '../components/home/ServicesSection'
import { FeaturedDoctorsSection } from '../components/home/FeaturedDoctorsSection'
import { AIAssistantSection } from '../components/home/AIAssistantSection'
import { CtaBanner } from '../components/home/CtaBanner'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle('MediConnect AI | Smart Healthcare, Simplified')

  return (
    <>
      <Hero />
      <ServicesSection />
      <FeaturedDoctorsSection />
      <AIAssistantSection />
      <CtaBanner />
    </>
  )
}
