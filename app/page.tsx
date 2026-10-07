"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Streamdown } from "streamdown";

import AuditIssueCard from "../components/AuditIssueCard";
import ScoreCard from "../components/ScoreCard";

type AuditIssue = {
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  fix: string;
};

type AuditResult = {
  overallScore: number;
  accessibilityScore: number;
  uxScore: number;
  responsivenessScore: number;
  resilienceScore: number;
  summary: string;
  issues: AuditIssue[];
  strengths: string[];
  recommendedNextSteps: string[];
};

export default function Home() {
  const [code, setCode] = useState("");
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState("");

  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  const chatContainerRef = useRef<HTMLElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isChatLoading =
    status === "submitted" || status === "streaming";

  async function handleAudit() {
    if (!code.trim()) {
      setAuditError("Paste some React or Next.js code first.");
      return;
    }

    try {
      setIsAuditing(true);
      setAuditError("");
      setAudit(null);

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "The audit could not be completed."
        );
      }

      setAudit(data);
    } catch (error) {
      setAuditError(
        error instanceof Error
          ? error.message
          : "Something went wrong while auditing the code."
      );
    } finally {
      setIsAuditing(false);
    }
  }

  function handleScroll() {
    const container = chatContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsAtBottom(distanceFromBottom < 80);
  }

  function jumpToLatest() {
    const container = chatContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setIsAtBottom(true);
  }

  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container || !isAtBottom) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, status, isAtBottom]);

  async function handleChatSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!input.trim() || isChatLoading) return;

    const message = input;

    setInput("");
    setIsAtBottom(true);

    await sendMessage(
      {
        text: message,
      },
      {
        body: {
          code,
          audit,
        },
      }
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            AI-powered frontend review
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Frontend AI Auditor
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Paste a React or Next.js component and receive a structured
            review covering accessibility, UX, responsiveness, and
            resilience.
          </p>
        </header>

        <section
          aria-labelledby="code-heading"
          className="rounded-2xl border border-gray-800 bg-gray-900 p-5"
        >
          <div className="mb-4">
            <h2
              id="code-heading"
              className="text-xl font-semibold"
            >
              Code to review
            </h2>

            <p
              id="code-help"
              className="mt-1 text-sm text-gray-400"
            >
              Paste a frontend component below. Do not include passwords,
              API keys, or other secrets.
            </p>
          </div>

          <label
            htmlFor="code-input"
            className="mb-2 block text-sm font-medium"
          >
            React or Next.js code
          </label>

          <textarea
            id="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-describedby="code-help"
            spellCheck={false}
            placeholder={`export default function LoginForm() {
  return (
    <form>
      <input placeholder="Email" />
      <button>Sign in</button>
    </form>
  );
}`}
            className="min-h-72 w-full resize-y rounded-xl border border-gray-700 bg-gray-950 p-4 font-mono text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />

          {auditError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-900 bg-red-950/50 p-4 text-sm text-red-300"
            >
              {auditError}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAudit}
              disabled={isAuditing || !code.trim()}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAuditing ? "Analyzing..." : "Analyze code"}
            </button>
          </div>
        </section>

        {audit && (
          <section
            aria-labelledby="results-heading"
            className="mt-8 space-y-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Analysis complete
                </p>

                <h2
                  id="results-heading"
                  className="text-2xl font-bold"
                >
                  Audit results
                </h2>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-400">
                  Overall score
                </p>

                <p className="text-4xl font-bold">
                  {audit.overallScore}
                  <span className="text-lg text-gray-500">
                    /100
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard
                label="Accessibility"
                score={audit.accessibilityScore}
              />

              <ScoreCard
                label="User experience"
                score={audit.uxScore}
              />

              <ScoreCard
                label="Responsiveness"
                score={audit.responsivenessScore}
              />

              <ScoreCard
                label="Resilience"
                score={audit.resilienceScore}
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="text-lg font-semibold">
                Summary
              </h3>

              <p className="mt-2 leading-7 text-gray-300">
                {audit.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="text-lg font-semibold">
                Issues found
              </h3>

              {audit.issues.length === 0 ? (
                <p className="mt-3 text-gray-400">
                  No significant issues were found.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {audit.issues.map((issue, index) => (
                    <AuditIssueCard
                      key={`${issue.title}-${index}`}
                      severity={issue.severity}
                      title={issue.title}
                      explanation={issue.explanation}
                      fix={issue.fix}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <h3 className="text-lg font-semibold">
                  Strengths
                </h3>

                <ul className="mt-3 space-y-2 text-gray-300">
                  {audit.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex gap-2"
                    >
                      <span aria-hidden="true">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                <h3 className="text-lg font-semibold">
                  Recommended next steps
                </h3>

                <ol className="mt-3 space-y-2 text-gray-300">
                  {audit.recommendedNextSteps.map(
                    (step, index) => (
                      <li
                        key={index}
                        className="flex gap-3"
                      >
                        <span className="font-semibold text-blue-400">
                          {index + 1}.
                        </span>

                        <span>{step}</span>
                      </li>
                    )
                  )}
                </ol>
              </div>
            </div>
          </section>
        )}

        <section
          aria-labelledby="chat-heading"
          className="mt-8"
        >
          <div className="mb-3">
            <h2
              id="chat-heading"
              className="text-xl font-semibold"
            >
              Follow-up chat
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Ask the AI for more detail about frontend improvements.
            </p>
          </div>

          <div className="relative">
            <section
              ref={chatContainerRef}
              onScroll={handleScroll}
              aria-live="polite"
              className="h-96 space-y-4 overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-4"
            >
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-center text-gray-400">
                  Ask a follow-up question when you are ready.
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-100"
                      }`}
                  >
                    <p className="mb-1 text-xs font-semibold opacity-60">
                      {message.role === "user"
                        ? "You"
                        : "AI"}
                    </p>

                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <Streamdown
                            key={index}
                            isAnimating={
                              status === "streaming" &&
                              message.role === "assistant"
                            }
                          >
                            {part.text}
                          </Streamdown>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              ))}

              {status === "submitted" && (
                <p className="text-sm text-gray-400">
                  AI is thinking...
                </p>
              )}
            </section>

            {!isAtBottom && messages.length > 0 && (
              <button
                type="button"
                onClick={jumpToLatest}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm shadow-lg hover:bg-gray-700"
              >
                Jump to latest
              </button>
            )}
          </div>

          <form
            onSubmit={handleChatSubmit}
            className="mt-3 flex gap-2"
          >
            <label
              htmlFor="chat-input"
              className="sr-only"
            >
              Ask a follow-up question
            </label>

            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={isChatLoading}
              className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            />

            {isChatLoading ? (
              <button
                type="button"
                onClick={stop}
                className="rounded-xl bg-red-600 px-5 py-3 font-medium hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}