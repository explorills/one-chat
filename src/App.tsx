import { EcosystemNavbar, EcosystemFooter, OneIdProvider } from '@explorills/one-ecosystem-ui'
import { HeroSection } from './components/HeroSection'

export default function App() {
  return (
    <OneIdProvider projectId="1fe344d4623291d85ad7369cbc6d9ec8">
      <div className="relative h-dvh overflow-hidden">
        <EcosystemNavbar
          logo="/logo.png"
          projectName="chat"
          themeColor="#dfdfdf"
          currentDomain="chat.expl.one"
        />
        <main className="h-full">
          <HeroSection />
        </main>
        <EcosystemFooter themeColor="#dfdfdf" />
      </div>
    </OneIdProvider>
  )
}
