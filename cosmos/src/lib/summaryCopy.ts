import type { Locale } from "@/lib/language";

const en = {
  heading: "✦ AI brief · English",
  tagline: "The story, in a smaller orbit.",
  description: "Get a concise English summary of the available official source text.",
  preparing: "Reading the source and preparing your brief…",
  generating: "Generating…",
  generate: "Generate summary ↗",
  disclaimer: "AI-generated from the available source text. Check the official article for full details.",
  timedOut: "The request timed out. Please try again.",
  empty: "The summary was empty. Please try again.",
  errors: {
    invalidOrigin: "Invalid request origin.",
    tooLarge: "Request is too large.",
    invalidRequest: "Invalid request.",
    invalidArticle: "Invalid article ID.",
    invalidLanguage: "Choose English or Japanese.",
    unavailable: "AI summaries are not available yet. You can still read the source excerpt below.",
    notFound: "This article is no longer in the current feed. Please read the official source.",
    tooShort: "There is not enough source text to summarize. Please read the official article.",
    busy: "AI summaries are busy. Please try again in a minute.",
    quota: "The free AI quota is temporarily exhausted. Please try again later or read the source excerpt below.",
    provider: "The summary service is unavailable. Please try again shortly.",
    incomplete: "The AI did not return a complete summary. Please try again.",
    failed: "The summary request failed or timed out. Please try again."
  }
};

const ja: typeof en = {
  heading: "✦ AI要約 · 日本語",
  tagline: "記事の要点を短く。",
  description: "公式記事の内容をもとに、日本語で短い要約を作成します。",
  preparing: "公式情報を読み込み、要約を作成しています…",
  generating: "作成中…",
  generate: "要約を作成 ↗",
  disclaimer: "公式情報をもとにAIが作成した要約です。詳しくは公式記事をご確認ください。",
  timedOut: "応答に時間がかかっています。もう一度お試しください。",
  empty: "要約が空でした。もう一度お試しください。",
  errors: {
    invalidOrigin: "リクエスト元が無効です。",
    tooLarge: "リクエストのサイズが大きすぎます。",
    invalidRequest: "リクエストが無効です。",
    invalidArticle: "記事IDが無効です。",
    invalidLanguage: "日本語または英語を選択してください。",
    unavailable: "現在、AI要約を利用できません。下の公式記事の抜粋は引き続きご覧いただけます。",
    notFound: "この記事は現在のフィードにありません。公式記事をご覧ください。",
    tooShort: "要約に必要な本文が不足しています。公式記事をご覧ください。",
    busy: "AI要約が混み合っています。1分ほど待ってからお試しください。",
    quota: "AI要約の無料利用枠に達しました。時間をおいて再試行するか、下の公式記事の抜粋をご覧ください。",
    provider: "要約サービスに接続できません。しばらくしてからお試しください。",
    incomplete: "要約を最後まで作成できませんでした。もう一度お試しください。",
    failed: "要約を取得できませんでした。もう一度お試しください。"
  }
};

export const summaryCopy: Record<Locale, typeof en> = { en, ja };
