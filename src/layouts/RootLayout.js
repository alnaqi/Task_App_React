import { Outlet } from "react-router-dom"
import { Container, Header, Main, Footer } from "../components/index"


function RootLayout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  )
}

export default RootLayout