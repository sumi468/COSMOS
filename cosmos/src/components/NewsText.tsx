import { Suspense } from "react";
import { getLocalization } from "@/lib/localization";
import { getJapaneseNewsText, isJapaneseText, type NewsTextField } from "@/lib/japaneseNews";
import { previewText } from "@/lib/text";
import type { NewsItem } from "@/types/cosmos";

interface Props {
  item: NewsItem;
  field: NewsTextField;
  previewLength?: number;
  showTranslationLabel?: boolean;
}

export default function NewsText({ item, field, previewLength, showTranslationLabel }: Props) {
  const { locale, copy } = getLocalization();
  const notice = field === "summary" && item.excerptNotice;
  const source = notice
    ? copy.news[notice]
    : item[field] || (showTranslationLabel ? copy.news.excerptUnavailable : "");
  const fallback = previewLength ? previewText(source, previewLength) : source;

  if (locale === "en") return fallback;

  return (
    <Suspense fallback={<span lang={isJapaneseText(source) ? "ja" : "en"}>{fallback}</span>}>
      <JapaneseText
        item={item}
        field={field}
        previewLength={previewLength}
        label={showTranslationLabel ? copy.news.machineTranslation : undefined}
        fallback={fallback}
      />
    </Suspense>
  );
}

async function JapaneseText({ item, field, previewLength, label, fallback }: Props & { label?: string; fallback: string }) {
  const result = await getJapaneseNewsText(item, field);
  if (!result) return fallback;

  return (
    <>
      <span lang={result.language}>{previewLength ? previewText(result.text, previewLength) : result.text}</span>
      {label && result.translated && <span className="block mt-2 text-xs text-cosmos-muted">{label}</span>}
    </>
  );
}
