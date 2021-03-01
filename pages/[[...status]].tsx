import Head from "next/head";
import {
  TasksDocument,
  TasksQuery,
  TasksQueryVariables,
  TaskStatus,
  useTasksQuery,
} from "../generated/graphql-frontend";
import { initializeApollo } from "../lib/client";
import TaskList from "../components/TaskList";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskFilter from "../components/TaskFilter";
import { useRouter } from "next/router";
import Error from "next/error";
import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import Custom404 from "./404";

const isTaskStatus = (value: string): value is TaskStatus => {
  return Object.values(TaskStatus).includes(value as TaskStatus);
};

export default function Home() {
  const router = useRouter();
  const status =
    Array.isArray(router.query.status) && router.query.status.length
      ? router.query.status[0]
      : undefined;
  if (status !== undefined && !isTaskStatus(status)) {
    return <Custom404 />;
  }

  const prevStatus = useRef(status);
  useEffect(() => {
    prevStatus.current = status;
  }, [status]);
  const result = useTasksQuery({
    variables: { status },
    fetchPolicy:
      prevStatus.current === status ? "cache-first" : "cache-and-network",
  });
  const tasks = result.data?.tasks;

  return (
    <div>
      <Head>
        <title>Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateTaskForm onSuccess={result.refetch} />
      {result.loading && !tasks ? (
        <h1>Loading tasks...</h1>
      ) : result.error ? (
        <h1>An error occured</h1>
      ) : tasks && tasks.length ? (
        <TaskList tasks={tasks} />
      ) : (
        <h1 className="no-tasks-message">There are no tasks</h1>
      )}
      <TaskFilter status={status} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const status =
    typeof context.params?.status === "string"
      ? context.params.status
      : undefined;

  if (status === undefined || isTaskStatus(status)) {
    const apolloClient = initializeApollo();
    await apolloClient.query<TasksQuery, TasksQueryVariables>({
      query: TasksDocument,
      variables: { status },
    });
    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  }

  return { props: {} };
};
