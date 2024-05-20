"use client";

import type { NextPage } from "next";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/lib/db";
import { api } from "~/trpc/react";

const Home: NextPage = () => {
  const { data: hello } = api.todo.hello.useQuery();
  const lists = useLiveQuery(() => db.todoLists.toArray());

  console.log("📋 ~ lists:", lists);
  console.log("📋 ~ hello:", hello);

  return (
    <div>
      <p>home page</p>
      <button onClick={() => db.deleteList(1)}>Db</button>
    </div>
  );
};

export default Home;
