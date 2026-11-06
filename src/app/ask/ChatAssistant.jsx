"use client";

import { useState } from "react";

const SUGGESTIONS = ["Explain Niramaya AI’s architecture", "How does user scoped retrieval work?", "What internship is Deepesh looking for?"];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function ask(value) {
    const prompt = value.trim();
    if (!prompt || busy) return;
    setQuestion(""); setError(""); setBusy(true);
    setMessages((current) => [...current, { role: "user", text: prompt }, { role: "assistant", text: "", sources: [] }]);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: prompt }) });
      const type = response.headers.get("content-type") || "";
      if (!response.ok || !type.includes("text/event-stream")) {
        const data = await response.json().catch(() => ({}));
        const message = data.answer || data.error || "The assistant could not answer right now.";
        if (data.mode === "local-retrieval") setError("Answered from local portfolio notes.");
        setMessages((current) => [...current.slice(0, -1), { role: "assistant", text: message, sources: data.sources || [] }]);
        return;
      }
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n"); buffer = events.pop() || "";
        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data: "));
          if (!line || line === "data: [DONE]") continue;
          const data = JSON.parse(line.slice(6));
          if (data.error) setError(data.error);
          if (data.token || data.sources) setMessages((current) => current.map((item, index) => index === current.length - 1 ? { ...item, text: item.text + (data.token || ""), sources: data.sources || item.sources } : item));
        }
      }
    } catch { setError("The assistant could not connect. Please try again later."); }
    finally { setBusy(false); }
  }

  return <section className="chat-shell" aria-label="Ask the portfolio assistant">
    <div className="chat-topline"><span>PORTFOLIO KNOWLEDGE BASE</span><button type="button" onClick={() => { setMessages([]); setError(""); }} disabled={busy || !messages.length}>Clear chat</button></div>
    <div className="chat-messages" aria-live="polite">
      {!messages.length && <div className="chat-welcome"><span className="chat-mark">DS</span><h2>What would you like to know?</h2><p>Ask about Deepesh’s projects, engineering interests, or internship goals. Answers are grounded in the portfolio knowledge base.</p><div className="chat-suggestions">{SUGGESTIONS.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item} <span>↗</span></button>)}</div></div>}
      {messages.map((message, index) => <article className={`chat-message ${message.role}`} key={`${index}-${message.role}`}><span>{message.role === "user" ? "YOU" : "PORTFOLIO ASSISTANT"}</span><p>{message.text || (busy && index === messages.length - 1 ? "Searching the portfolio…" : "")}</p>{message.sources?.length > 0 && <div className="chat-sources">Sources: {message.sources.map((source) => <a key={`${source.title}-${source.path}`} href={source.path}>{source.title}</a>)}</div>}</article>)}
    </div>
    {error && <p className="chat-error" role="status">{error}</p>}
    <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); ask(question); }}><label className="sr-only" htmlFor="portfolio-question">Ask a question</label><textarea id="portfolio-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} rows={2} placeholder="Ask about projects, architecture, or experience…" disabled={busy} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(question); } }} /><button type="submit" disabled={busy || !question.trim()}>{busy ? "Working…" : "Send ↗"}</button></form>
    <p className="chat-note">Answers can be incomplete. Verify project details in the linked source repository.</p>
  </section>;
}
