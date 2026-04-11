import { EcosystemNavbar, EcosystemFooter, OneIdProvider } from '@explorills/one-ecosystem-ui'
import { getOneIdApiUrl, getLootUrl, getNotificationUrl } from './lib/api'
import { HeroSection } from './components/HeroSection'

export default function App() {
  return (
    <OneIdProvider
      apiUrl={getOneIdApiUrl()}
      projectId="1fe344d4623291d85ad7369cbc6d9ec8"
      notificationUrl={getNotificationUrl()}
      lootUrl={getLootUrl()}
    >
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
