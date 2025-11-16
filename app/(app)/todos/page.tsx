import { auth } from "@clerk/nextjs/server";
import { TodosHomeView } from "./todosHome.view";

export default async function TodosPage() {
  const { userId } = await auth();

  if (!userId) {
    // Middleware handle redirects, but return null to satisfy the type system.
    return null;
  }

  return <TodosHomeView />;
}
