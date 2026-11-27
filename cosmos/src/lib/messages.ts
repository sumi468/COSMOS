import type { Locale } from "@/lib/language";

const en = {
  nav: {
    home: "Home",
    latest: "Latest",
    missions: "Missions",
    upcoming: "Upcoming",
    images: "Images",
    settings: "Settings",
    label: "Main navigation",
    motto: "Stay curious.",
    sources: "Sources: NASA & JAXA official feeds.",
    independent: "Not affiliated with either agency."
  },
  meta: {
    title: "COSMOS — Explore What’s Happening Beyond Earth.",
    description: "Track NASA and JAXA news, missions, launches, and space imagery in one place — sourced directly from official feeds."
  },
  common: {
    all: "ALL",
    allCategories: "All categories",
    search: "Search",
    searchPlaceholder: "Search ISS, Artemis, H3, James Webb…",
    tryAgain: "Try again",
    officialSource: "Official source",
    organization: "Organization",
    status: "Status",
    target: "Target",
    loading: "Loading page",
    exploring: "Exploring the cosmos"
  },
  hero: {
    coordinate: "BEYOND THE KNOWN",
    explore: "+ EXPLORE",
    journal: "Independent space journal",
    edition: "EARTH / OUR POINT OF DEPARTURE",
    kicker: "For the endlessly curious",
    title: "GO BEYOND.",
    titleSecond: "STAY CURIOUS.",
    description: "A small window into an infinite universe.",
    descriptionSecond: "Discover the missions, ideas, and moments",
    descriptionThird: "taking us further.",
    start: "Start exploring",
    latest: "The latest dispatches",
    destinations: {
      missions: { label: "Follow the missions", detail: "Human ambition. Cosmic scale." },
      upcoming: { label: "Catch the next launch", detail: "The countdown to what comes next." },
      images: { label: "See the extraordinary", detail: "The universe, through a different lens." }
    }
  },
  home: {
    dispatches: "Dispatches from NASA & JAXA",
    dispatch: "The dispatch",
    stories: "Stories from beyond Earth",
    feedsUnavailable: "Couldn’t load NASA and JAXA news",
    checkBack: "Official feeds are temporarily unreachable. Please check back shortly.",
    fromAgencies: "From NASA & JAXA",
    viewAll: "View all",
    noMoreStories: "No additional stories right now",
    whatsNext: "What's next",
    fullSchedule: "Full schedule",
    eventsUnavailable: "Couldn’t load upcoming events",
    noLaunchesInWindow: "No confirmed NASA or JAXA launches found in the current window.",
    inFocus: "In focus",
    allMissions: "All missions"
  },
  latest: {
    title: "All NASA & JAXA news",
    noMatches: "No matching stories",
    filterHint: "Try a different filter combination.",
    queryHint: (query: string) => 'Nothing found for "' + query + '". Try a different term or clear the filters.'
  },
  news: {
    back: "Back to Latest",
    loadFailed: "Couldn’t load the article",
    retryHint: "This article couldn’t be loaded right now. Please try again, or head back to Latest.",
    excerpt: "Source excerpt",
    excerptUnavailable: "The source excerpt is unavailable. Please read the official article below.",
    noExcerpt: "No summary available. See the official source for details.",
    japaneseOnly: "This is a Japanese-language press release with no separate English-language article. See the official source for details.",
    publishedVia: (feed: string, source: string) =>
      "Published via " + feed + ". COSMOS shows a short excerpt. Read the full article on " + source + "’s own site.",
    readArticle: "Read official article"
  },
  missions: {
    title: "Active & upcoming",
    description: "Reference profiles for real, publicly documented NASA and JAXA missions. Each links to the agency’s own mission page for the latest status.",
    back: "Back to Missions",
    officialSite: "Official website",
    relatedNews: "Related news"
  },
  upcoming: {
    title: "What's next in space",
    noLaunches: "No confirmed NASA or JAXA launches found",
    checkSchedules: "Check back soon, or visit the official launch schedules directly.",
    attribution: "Launch data provided by The Space Devs via Launch Library 2 (thespacedevs.com).",
    localDates: "Dates are shown in your local time."
  },
  event: {
    back: "Back to Upcoming",
    label: "Event",
    countdown: "Countdown",
    localDate: "Date (local)",
    kind: "Type",
    location: "Location",
    description: "Description",
    source: "Source",
    details: "View launch details",
    inProgress: "In progress / TBD",
    units: { days: "D", hours: "H", minutes: "M", seconds: "S" }
  },
  images: {
    title: "Space Images",
    pictureOfDay: "Picture of the Day",
    apodUnavailable: "Couldn’t load NASA’s Picture of the Day.",
    savedImage: "Showing the last saved image.",
    retrySoon: "Try again shortly.",
    gallery: "Gallery",
    library: "NASA Image and Video Library",
    libraryUnavailable: "Couldn’t load the NASA image library.",
    noImages: "No images found",
    searchHint: "Try a different search term.",
    videoNotice: "Today’s NASA feature is a video. View it at the official source below.",
    credit: "Credit",
    readSource: "Read official source"
  },
  search: {
    title: "Find news & missions",
    hint: "Results include both news and mission pages, with source and date shown.",
    news: "News",
    noResults: (query: string) => 'No results for "' + query + '"'
  },
  settings: {
    language: "Display language",
    about: "About COSMOS",
    description: "COSMOS aggregates real-time public information directly from NASA and JAXA’s official feeds and APIs. Titles, source excerpts, dates, and links come from the original source. On article pages, you can generate an AI brief in your display language from the available source text. AI briefs are labeled and may contain mistakes. Every article links to its official source.",
    sources: "Data sources",
    visit: "Visit",
    independence: "COSMOS is an independent, unofficial app. It is not produced, endorsed, or affiliated with NASA or JAXA. NASA content is generally not copyrighted in the United States. JAXA press materials remain subject to JAXA’s own usage policies. Always confirm mission-critical or time-critical details on the agencies’ own sites."
  },
  sources: {
    nasaReleases: "NASA News Releases (RSS)",
    nasaLatest: "NASA Recently Published (RSS)",
    nasaArtemis: "NASA Artemis (RSS)",
    nasaStation: "NASA Space Station (RSS)",
    jaxaReleases: "JAXA Press Release, English (RSS)",
    apod: "NASA Astronomy Picture of the Day (API)",
    nasaImages: "NASA Image and Video Library (API)",
    launchLibrary: "Launch Library 2 by The Space Devs (API)"
  },
  sourceErrors: {
    news: (agency: string, feed: string) => "Couldn’t load " + agency + " news (" + feed + ")",
    events: (agency: string) => "Couldn’t load upcoming " + agency + " events"
  },
  time: {
    savedData: "Showing last saved data",
    justNow: "Just now",
    yesterday: "Yesterday",
    minutesAgo: (count: number) => count + "m ago",
    hoursAgo: (count: number) => count + "h ago",
    daysAgo: (count: number) => count + "d ago",
    updatedNow: "Updated just now",
    updatedMinutes: (count: number) => "Updated " + count + " min ago",
    updatedHours: (count: number) => "Updated " + count + "h ago",
    updatedToday: "Updated today"
  },
  category: {
    Launch: "Launch",
    Mission: "Mission",
    Science: "Science",
    ISS: "ISS",
    "Space Telescope": "Space Telescope",
    Earth: "Earth",
    Moon: "Moon",
    Mars: "Mars",
    Astronomy: "Astronomy",
    Aeronautics: "Aeronautics",
    General: "General"
  },
  missionStatus: {
    Upcoming: "Upcoming",
    Active: "Active",
    Extended: "Extended",
    Completed: "Completed"
  },
  agency: {
    NASA: "NASA",
    JAXA: "JAXA",
    International: "International",
    Commercial: "Commercial"
  },
  eventKind: {
    Launch: "Launch",
    Spacewalk: "Spacewalk",
    Docking: "Docking",
    Flyby: "Flyby",
    Landing: "Landing",
    Milestone: "Milestone"
  },
  notFound: {
    title: "Page not found",
    home: "Back to Home"
  }
};

const ja: typeof en = {
  nav: {
    home: "ホーム",
    latest: "最新ニュース",
    missions: "ミッション",
    upcoming: "予定",
    images: "画像",
    settings: "設定",
    label: "メインメニュー",
    motto: "好奇心のままに。",
    sources: "情報源はNASAとJAXAの公式フィードです。",
    independent: "COSMOSは独立したアプリです。"
  },
  meta: {
    title: "COSMOS — 地球の先で起きていること",
    description: "NASAとJAXAの公式情報をもとに、宇宙のニュース、ミッション、打ち上げ予定、画像をまとめてチェックできます。"
  },
  common: {
    all: "すべて",
    allCategories: "すべてのカテゴリ",
    search: "検索",
    searchPlaceholder: "ISS、アルテミス、H3、ジェイムズ・ウェッブなどを検索",
    tryAgain: "再試行",
    officialSource: "公式情報源",
    organization: "機関",
    status: "ステータス",
    target: "目的地",
    loading: "ページを読み込み中",
    exploring: "宇宙の情報を読み込み中"
  },
  hero: {
    coordinate: "未知のその先へ",
    explore: "+ 探索",
    journal: "独立系の宇宙ジャーナル",
    edition: "地球 / 探索の出発点",
    kicker: "宇宙に好奇心を抱くすべての人へ",
    title: "地球の先へ。",
    titleSecond: "好奇心のままに。",
    description: "無限に広がる宇宙をのぞいてみませんか。",
    descriptionSecond: "宇宙への理解を広げるミッション、",
    descriptionThird: "発見、その瞬間を追いかけよう。",
    start: "探索を始める",
    latest: "最新の特集を見る",
    destinations: {
      missions: { label: "ミッションを追う", detail: "人類の挑戦が宇宙へ広がる。" },
      upcoming: { label: "次の打ち上げを確認", detail: "打ち上げまでのカウントダウン。" },
      images: { label: "宇宙の画像を見る", detail: "いつもと違う視点から宇宙を眺める。" }
    }
  },
  home: {
    dispatches: "NASAとJAXAの最新情報",
    dispatch: "特集",
    stories: "地球のその先から届くニュース",
    feedsUnavailable: "NASAとJAXAの最新情報を取得できませんでした",
    checkBack: "現在、公式フィードに接続できません。しばらくしてからもう一度お試しください。",
    fromAgencies: "NASAとJAXAから",
    viewAll: "すべて見る",
    noMoreStories: "ほかのニュースはありません",
    whatsNext: "次のイベント",
    fullSchedule: "予定をすべて見る",
    eventsUnavailable: "今後のイベントを取得できませんでした",
    noLaunchesInWindow: "現在の表示期間に、確定したNASAまたはJAXAの打ち上げ予定はありません。",
    inFocus: "注目のミッション",
    allMissions: "すべてのミッション"
  },
  latest: {
    title: "NASAとJAXAのニュース",
    noMatches: "条件に一致するニュースがありません",
    filterHint: "絞り込み条件を変えてお試しください。",
    queryHint: (query: string) => "「" + query + "」に一致するニュースがありません。検索語や絞り込み条件を変えてお試しください。"
  },
  news: {
    back: "最新ニュースに戻る",
    loadFailed: "記事を読み込めませんでした",
    retryHint: "もう一度お試しいただくか、最新ニュースに戻ってください。",
    excerpt: "公式記事の抜粋",
    excerptUnavailable: "抜粋を取得できませんでした。下記の公式記事をご覧ください。",
    noExcerpt: "抜粋を取得できませんでした。詳しくは公式記事をご覧ください。",
    japaneseOnly: "このプレスリリースは日本語で公開されています。詳しくは公式記事をご覧ください。",
    publishedVia: (feed: string, source: string) =>
      feed + "で配信された記事です。全文は" + source + "の公式サイトでご覧いただけます。",
    readArticle: "公式記事を読む"
  },
  missions: {
    title: "進行中・今後のミッション",
    description: "NASAとJAXAが公開しているミッションの概要です。最新の状況は各ミッションの公式ページでご確認ください。",
    back: "ミッション一覧に戻る",
    officialSite: "公式サイト",
    relatedNews: "関連ニュース"
  },
  upcoming: {
    title: "今後の宇宙イベント",
    noLaunches: "確定したNASAまたはJAXAの打ち上げ予定がありません",
    checkSchedules: "しばらくしてから確認するか、公式の打ち上げスケジュールをご覧ください。",
    attribution: "打ち上げデータ提供元はThe Space DevsのLaunch Library 2（thespacedevs.com）です。",
    localDates: "日時は現地時間で表示しています。"
  },
  event: {
    back: "予定一覧に戻る",
    label: "イベント",
    countdown: "カウントダウン",
    localDate: "日時（現地時間）",
    kind: "種類",
    location: "場所",
    description: "概要",
    source: "情報源",
    details: "打ち上げの詳細を見る",
    inProgress: "進行中・予定未定",
    units: { days: "日", hours: "時間", minutes: "分", seconds: "秒" }
  },
  images: {
    title: "宇宙の画像",
    pictureOfDay: "今日の天体写真",
    apodUnavailable: "NASAの今日の天体写真を取得できませんでした。",
    savedImage: "前回保存した画像を表示しています。",
    retrySoon: "しばらくしてからもう一度お試しください。",
    gallery: "ギャラリー",
    library: "NASA画像・動画ライブラリ",
    libraryUnavailable: "NASA画像ライブラリを取得できませんでした。",
    noImages: "画像が見つかりませんでした",
    searchHint: "別の検索語でお試しください。",
    videoNotice: "今日のNASAの特集は動画です。下記の公式ページから視聴できます。",
    credit: "クレジット",
    readSource: "公式ページを見る"
  },
  search: {
    title: "ニュースとミッションを探す",
    hint: "ニュースとミッションが検索結果に表示されます。情報源や日付も確認できます。",
    news: "ニュース",
    noResults: (query: string) => "「" + query + "」に一致する結果がありません"
  },
  settings: {
    language: "表示言語",
    about: "COSMOSについて",
    description: "COSMOSは、NASAとJAXAの公式フィードやAPIから最新の公開情報を集めています。記事の見出し、抜粋、日付、リンクは公式情報に基づきます。記事ページでは、公式情報をもとに選択した言語でAI要約を生成できます。要約にはAIで生成したことを表示します。内容に誤りが含まれる場合は、各記事の公式リンクから確認できます。",
    sources: "情報源",
    visit: "開く",
    independence: "COSMOSはNASAやJAXAから独立した非公式アプリです。NASAのコンテンツは米国では一般に著作権の対象外ですが、JAXAの報道資料にはJAXAの利用条件が適用されます。重要な日時やミッションの詳細は各機関の公式サイトでご確認ください。"
  },
  sources: {
    nasaReleases: "NASAプレスリリース（RSS）",
    nasaLatest: "NASA最新記事（RSS）",
    nasaArtemis: "NASAアルテミス計画（RSS）",
    nasaStation: "NASA宇宙ステーション（RSS）",
    jaxaReleases: "JAXAプレスリリース・英語版（RSS）",
    apod: "NASA今日の天体写真（API）",
    nasaImages: "NASA画像・動画ライブラリ（API）",
    launchLibrary: "The Space DevsのLaunch Library 2（API）"
  },
  sourceErrors: {
    news: (agency: string, feed: string) => agency + "の最新情報を取得できませんでした（" + feed + "）",
    events: (agency: string) => agency + "の今後のイベントを取得できませんでした"
  },
  time: {
    savedData: "前回保存したデータを表示中",
    justNow: "たった今",
    yesterday: "昨日",
    minutesAgo: (count: number) => count + "分前",
    hoursAgo: (count: number) => count + "時間前",
    daysAgo: (count: number) => count + "日前",
    updatedNow: "たった今更新",
    updatedMinutes: (count: number) => count + "分前に更新",
    updatedHours: (count: number) => count + "時間前に更新",
    updatedToday: "今日更新"
  },
  category: {
    Launch: "打ち上げ",
    Mission: "ミッション",
    Science: "科学",
    ISS: "ISS",
    "Space Telescope": "宇宙望遠鏡",
    Earth: "地球",
    Moon: "月",
    Mars: "火星",
    Astronomy: "天文学",
    Aeronautics: "航空",
    General: "その他"
  },
  missionStatus: {
    Upcoming: "予定",
    Active: "進行中",
    Extended: "延長ミッション",
    Completed: "完了"
  },
  agency: {
    NASA: "NASA",
    JAXA: "JAXA",
    International: "国際共同",
    Commercial: "民間"
  },
  eventKind: {
    Launch: "打ち上げ",
    Spacewalk: "船外活動",
    Docking: "ドッキング",
    Flyby: "フライバイ",
    Landing: "着陸",
    Milestone: "マイルストーン"
  },
  notFound: {
    title: "ページが見つかりませんでした",
    home: "ホームに戻る"
  }
};

export const messages: Record<Locale, typeof en> = { en, ja };
