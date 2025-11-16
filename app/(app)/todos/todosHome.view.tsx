"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTodos } from "./useTodos";

export function TodosHomeView() {
  const [text, setText] = useState("");
  const {
    todos,
    isPending,
    isError,
    createTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const remaining = useMemo(
    () => todos.filter((todo) => !todo.done).length,
    [todos],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    createTodo.mutate(
      { text: text.trim() },
      { onSuccess: () => setText("") },
    );
  };

  const clearCompletedTodos = () => {
    const completedIds = todos.filter((todo) => todo.done).map((todo) => todo.id);
    if (completedIds.length === 0) return;
    clearCompleted.mutate(completedIds);
  };

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col gap-6 overflow-hidden px-4 pt-4 text-slate-100">
      <header className="space-y-2">
        <h1 className="text-4xl uppercase tracking-[0.35em] font-semibold text-slate-400">
          Clarydo
        </h1>
        <p className="text-sm text-slate-400">
          {remaining} Aufgaben offen · {todos.length} gesamt
        </p>
      </header>

      <section className="flex flex-1 flex-col gap-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40 backdrop-blur">
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {isPending ? (
            <p className="text-center text-sm text-slate-400">Lade Aufgaben…</p>
          ) : isError ? (
            <p className="rounded-xl border border-red-500/50 bg-red-950/60 px-4 py-3 text-center text-sm text-red-200">
              Fehler beim Laden der Aufgaben.
            </p>
          ) : todos.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700/80 px-4 py-8 text-center text-sm text-slate-400">
              Noch keine Einträge – starte unten mit deiner ersten Aufgabe.
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/80 px-4 py-3"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() =>
                        updateTodo.mutate({ id: todo.id, done: !todo.done })
                      }
                      className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-slate-100 focus:ring-slate-200"
                    />
                    <span
                      className={`text-base ${
                        todo.done
                          ? "text-slate-500 line-through"
                          : "text-slate-100"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTodo.mutate(todo.id)}
                    className="text-xs font-medium text-slate-500 transition hover:text-rose-400"
                    aria-label="Aufgabe löschen"
                  >
                    {deleteTodo.isPending ? "…" : "Entfernen"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {todos.some((todo) => todo.done) && (
          <button
            onClick={clearCompletedTodos}
            className="text-sm font-medium text-slate-400 transition hover:text-slate-100 disabled:cursor-not-allowed"
            disabled={clearCompleted.isPending}
          >
            {clearCompleted.isPending
              ? "Lösche erledigte…"
              : "Erledigte Aufgaben entfernen"}
          </button>
        )}

        <form
          className="sticky bottom-0 flex items-center gap-3 border-t border-slate-800 bg-slate-900/90 pt-4 backdrop-blur"
          onSubmit={handleSubmit}
        >
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Neue Aufgabe hinzufügen"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/40"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            aria-label="Aufgabe speichern"
            disabled={!text.trim() || createTodo.isPending}
          >
            <Plus className="h-5 w-5" />
          </button>
        </form>
      </section>
    </main>
  );
}
