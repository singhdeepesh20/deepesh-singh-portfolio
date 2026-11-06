"use client";

import { useState } from "react";

const SUGGESTIONS = ["What is Niramaya AI?", "Explain the RAG architecture", "What kind of role is Deepesh seeking?"];

export default function PortfolioPrompt() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(value) {
    const prompt = value.trim();
    if (!prompt || busy) return;
    setBusy(true); setQuestion(""); setAnswer(""); setSources([]); setError("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: prompt }) });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const result = await response.json();
        if (!response.ok && response.status !== 503) throw new Error(result.error || "The assistant could not answer.");
        setAnswer(result.answer || result.error || "I couldn't find a relevant answer in my portfolio notes.");
        setSources(result.sources || []);
        if (response.status === 503) setError("Using the local portfolio knowledge fallback.");
        return;
      }
      if (!response.ok || !response.body) throw new Error("The assistant could not answer right now.");
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
          if (data.token) setAnswer((current) => current + data.token);
          if (data.sources) setSources(data.sources);
        }
      }
    } catch (requestError) { setError(requestError.message || "The assistant could not connect. Please try again."); }
    finally { setBusy(false); }
  }

  return <div className="portfolio-prompt" id="assistant">
    <form className="portfolio-prompt-form" onSubmit={(event) => { event.preventDefault(); submit(question); }}>
      <label className="sr-only" htmlFor="hero-portfolio-question">Ask about Deepesh’s work</label>
      <span className="prompt-spark" aria-hidden="true">✳</span>
      <input id="hero-portfolio-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder="Ask me anything about my work…" disabled={busy}/>
      <button type="submit" aria-label="Ask the portfolio assistant" disabled={busy || !question.trim()}>{busy ? "…" : "↗"}</button>
    </form>
    <div className="prompt-suggestions" aria-label="Suggested questions">{SUGGESTIONS.map((suggestion) => <button type="button" key={suggestion} disabled={busy} onClick={() => submit(suggestion)}>{suggestion}</button>)}</div>
    {(answer || error) && <div className="prompt-answer" aria-live="polite"><div><span>{busy ? "THINKING" : "FROM THE PORTFOLIO"}</span>{error && <small>{error}</small>}</div>{answer && <p>{answer}</p>}{sources.length > 0 && <nav aria-label="Answer sources">{sources.map((source) => <a key={`${source.title}-${source.path}`} href={source.path}>{source.title} ↗</a>)}</nav>}</div>}
    <a className="open-assistant" href="/ask">Open the full portfolio assistant ↗</a>
  </div>;
}
