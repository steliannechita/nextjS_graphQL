import { ApolloProvider } from "@apollo/client";
import { AppPropsType } from "next/dist/next-server/lib/utils";
import Layout from "../components/Layout";
import { useApollo } from "../lib/client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppPropsType) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
