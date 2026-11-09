"use client";

import { SyntheticEvent, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type Quote = {
  id: number;
  author: string;
  display_author: string;
  message: string;
  year: number;
  context?: string;
};

type NewQuote = Omit<Quote, "id">;

const emptyQuote: NewQuote = {
  author: "",
  display_author: "",
  message: "",
  year: new Date().getFullYear(),
  context: "",
};

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const payload = (await response.json()) as T | { error?: string };

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
        ? payload.error : "요청 실패.";
    throw new Error(message);
  }

  return payload as T;
}

export default function Homework4Page() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [draftQuote, setDraftQuote] = useState<NewQuote>(emptyQuote);
  const [formMessage, setFormMessage] = useState("");

  const quotesQuery = useQuery({
    queryKey: ["quotes", searchText],
    queryFn: () => {
      const query = searchText? `?message=${encodeURIComponent(searchText)}` : "";
      return requestJson<Quote[]>(`/api/word/search${query}`);
    },
  });

  const createQt = useMutation({
    mutationFn: (quote: NewQuote) =>
      requestJson<{ id: number }>("/api/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quote,
          year: Number(quote.year),
          context: quote.context || undefined,
        }),
      }),
    onSuccess: async () => {
      setDraftQuote(emptyQuote);
      setFormMessage("어록 추가 완.");
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
    }
  });

  const deleteQt = useMutation({
    mutationFn: (id: number) =>
      requestJson<{ ok: boolean }>(`/api/word/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });

  const handleCreateQuote = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    createQt.mutate(draftQuote);
  };

  const mutationError =
    createQt.error?.message ?? deleteQt.error?.message;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Homework4
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Library
          </h1>
          <p className="mt-2 text-slate-600">
            Tanstack query 구현
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">목록</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {quotesQuery.data?.length ?? 0}개의 어록
                </p>
              </div>
              <label className="w-full sm:max-w-xs">
                <span className="mb-1 block text-sm font-medium">
                  메시지 검색
                </span>
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            {quotesQuery.isPending && (
              <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                불러오는 중입니다...
              </p>
            )}

            {quotesQuery.isError && (
              <p className="rounded-lg bg-red-50 p-4 text-red-700">
                {quotesQuery.error.message}
              </p>
            )}

            {quotesQuery.isSuccess && quotesQuery.data.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                검색 결과가 없습니다.
              </p>
            )}

            <div className="space-y-3">
              {quotesQuery.data?.map((quote) => (
                <article
                  key={quote.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium leading-relaxed">
                        “{quote.message}”
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {quote.display_author} · {quote.year}
                      </p>
                      {quote.context && (
                        <p className="mt-2 text-sm text-slate-600">
                          {quote.context}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQt.mutate(quote.id)}
                      disabled={deleteQt.isPending}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">어록 추가</h2>
            <form onSubmit={handleCreateQuote} className="mt-5 space-y-4">
              <label className="block text-sm font-medium">
                원본 저자
                <input
                  required
                  value={draftQuote.author}
                  onChange={(event) =>
                    setDraftQuote({ ...draftQuote, author: event.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                표시할 저자명
                <input
                  required
                  value={draftQuote.display_author}
                  onChange={(event) =>
                    setDraftQuote({
                      ...draftQuote,
                      display_author: event.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                메시지
                <textarea
                  required
                  rows={4}
                  value={draftQuote.message}
                  onChange={(event) =>
                    setDraftQuote({ ...draftQuote, message: event.target.value })
                  }
                  className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">
                  연도
                  <input
                    required
                    type="number"
                    value={draftQuote.year}
                    onChange={(event) =>
                      setDraftQuote({
                        ...draftQuote,
                        year: Number(event.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  출처
                  <input
                    value={draftQuote.context}
                    onChange={(event) =>
                      setDraftQuote({
                        ...draftQuote,
                        context: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={createQt.isPending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createQt.isPending ? "추가 중..." : "어록 추가"}
              </button>
              {formMessage && (
                <p className="text-sm text-emerald-600">{formMessage}</p>
              )}
              {mutationError && (
                <p className="text-sm text-red-600">{mutationError}</p>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
