import AuthWrapper from '../components/AuthWrapper'

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AuthWrapper>{children}</AuthWrapper>
}
