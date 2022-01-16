import type { NextPage } from "next";
import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { lightTheme, darkTheme, GlobalStyles } from "../theme";
import NewTodo from "../components/NewTodo";
import Todos from "../components/Todos";
import Notification from "../components/Notification";

const Header = styled.header`
  border: 1px solid yellow;
  position: absolute;
  height: 50px;
  width: 100%;
  display: flex;
  height: 60px;
`;

const Main = styled.main`
  border: 1px solid black;
  min-height: 100vh;
  /* padding: 4rem 0; */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  padding: 50px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  min-width: 500px;
`;

const Home: NextPage = () => {
  const themeMode = useSelector<RootState>((state) => state.theme.mode);
  const notification = useSelector((state: RootState) => state.notification);
  console.log(notification.isActive);

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Head>
        <title>Todo Ap</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header></Header>
      <Main>
        <Container>
          <NewTodo />
          <Todos />
        </Container>
        {notification.isActive && <Notification notification={notification} />}
      </Main>
    </ThemeProvider>
  );
};

export default Home;
