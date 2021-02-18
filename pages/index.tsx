import Head from "next/head";
import {
  TasksDocument,
  TasksQuery,
  useTasksQuery,
} from "../generated/graphql-frontend";
import { initializeApollo } from "../lib/client";
import TaskList from "../components/TaskList";
import CreateTaskForm from "../components/CreateTaskForm";

export default function Home() {
  const result = useTasksQuery();
  const tasks = result.data?.tasks;

  return (
    <div>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateTaskForm onSuccess={result.refetch} />
      {result.loading ? (
        <h1>Loading tasks...</h1>
      ) : result.error ? (
        <h1>An error occured</h1>
      ) : tasks && tasks.length ? (
        <TaskList tasks={tasks} />
      ) : (
        <h1 className="no-tasks-message">There are no tasks</h1>
      )}
    </div>
  );
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();
  await apolloClient.query<TasksQuery>({ query: TasksDocument });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
