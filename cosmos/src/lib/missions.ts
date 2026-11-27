import type { Locale } from "@/lib/language";
import type { Mission } from "@/types/cosmos";

export type MissionProfile = Mission & {
  ja: Pick<Mission, "name" | "description" | "target" | "latestUpdateNote">;
};

// Static reference profiles for real, publicly documented missions. These
// are NOT "news" — they're long-lived background facts (what a mission is,
// who runs it, where to find official updates) that don't need to be
// re-fetched every page load. Every entry links to the mission's official
// page so the person can check current, up-to-the-minute status there.
// Status/target fields are deliberately conservative — for exact dates,
// always defer to officialUrl.
export const MISSIONS: MissionProfile[] = [
  {
    slug: "artemis",
    ja: {
      name: "アルテミス計画",
      description: "NASAが宇宙飛行士を再び月に送り、継続的な月探査を目指す計画。大型ロケットSLSと宇宙船オリオンが計画の中心を担います。",
      target: "月",
      latestUpdateNote: "最新の乗組員、打ち上げ日、進行状況はアルテミス計画の公式ページをご覧ください。"
    },
    name: "Artemis",
    organization: "NASA",
    description:
      "NASA's program to return astronauts to the Moon and establish long-term lunar exploration, using the SLS rocket and Orion spacecraft as the backbone of the campaign.",
    status: "Upcoming",
    target: "Moon",
    officialUrl: "https://www.nasa.gov/humans-in-space/artemis/",
    latestUpdateNote: "See the official Artemis page for the current crew, launch date, and mission status."
  },
  {
    slug: "iss",
    ja: {
      name: "国際宇宙ステーション",
      description: "地球低軌道を周回する有人研究施設。NASA、ロスコスモス、ESA、JAXA、CSAが共同で運用し、JAXAは実験棟「きぼう」と補給機HTV-Xを担当しています。",
      target: "地球低軌道",
      latestUpdateNote: "現在の長期滞在クルーやスケジュールはISSの公式ページをご覧ください。"
    },
    name: "International Space Station",
    organization: "International",
    description:
      "A continuously crewed research laboratory in low Earth orbit, operated jointly by NASA, Roscosmos, ESA, JAXA, and CSA. JAXA contributes and operates the Kibo module and HTV-X resupply vehicle.",
    status: "Active",
    target: "Low Earth Orbit",
    officialUrl: "https://www.nasa.gov/international-space-station/",
    latestUpdateNote: "See the official ISS page for the current expedition crew and schedule."
  },
  {
    slug: "jwst",
    ja: {
      name: "ジェイムズ・ウェッブ宇宙望遠鏡",
      description: "ESAとCSAの協力で開発された赤外線宇宙望遠鏡。太陽と地球のL2点付近から、初期の銀河や恒星・惑星の形成、太陽系外惑星の大気を観測します。",
      target: "太陽・地球系のL2点",
      latestUpdateNote: "最新の科学成果はウェッブ宇宙望遠鏡の公式ページをご覧ください。"
    },
    name: "James Webb Space Telescope",
    organization: "NASA",
    description:
      "An infrared space observatory developed with ESA and CSA, studying the earliest galaxies, star and planet formation, and exoplanet atmospheres from the Sun-Earth L2 point.",
    status: "Active",
    target: "Sun-Earth L2",
    officialUrl: "https://science.nasa.gov/mission/webb/",
    latestUpdateNote: "See the official Webb mission page for the latest science releases."
  },
  {
    slug: "hubble",
    ja: {
      name: "ハッブル宇宙望遠鏡",
      description: "地球低軌道から可視光、紫外線、近赤外線を観測する宇宙望遠鏡。1990年から運用され、ESAとの協力で観測を続けています。",
      target: "地球低軌道",
      latestUpdateNote: "最新の画像や発見はハッブル宇宙望遠鏡の公式ページをご覧ください。"
    },
    name: "Hubble Space Telescope",
    organization: "NASA",
    description:
      "A visible/ultraviolet/near-infrared space observatory in low Earth orbit, operating since 1990 and still producing new science in partnership with ESA.",
    status: "Active",
    target: "Low Earth Orbit",
    officialUrl: "https://science.nasa.gov/mission/hubble/",
    latestUpdateNote: "See the official Hubble mission page for the latest imagery and findings."
  },
  {
    slug: "h3-rocket",
    ja: {
      name: "H3ロケット",
      description: "JAXAと三菱重工業が共同開発した基幹ロケット。H-IIAロケットの後継として、政府や民間の衛星などを打ち上げます。",
      target: "各種軌道",
      latestUpdateNote: "最新の飛行状況はJAXAのH3ロケット公式ページをご覧ください。"
    },
    name: "H3 Launch Vehicle",
    organization: "JAXA",
    description:
      "JAXA's next-generation flagship launch vehicle, developed with Mitsubishi Heavy Industries to succeed the H-IIA rocket for both government and commercial payloads.",
    status: "Active",
    target: "Various orbits",
    officialUrl: "https://global.jaxa.jp/projects/rockets/h3/",
    latestUpdateNote: "See JAXA's official H3 program page for the latest flight status."
  },
  {
    slug: "htv-x",
    ja: {
      name: "新型宇宙ステーション補給機 HTV-X",
      description: "宇宙ステーション補給機「こうのとり」の後継となるJAXAの無人補給機。国際宇宙ステーションへの物資輸送と、新しい搭載技術の実証を行います。",
      target: "国際宇宙ステーション",
      latestUpdateNote: "運用状況はJAXAの国際宇宙ステーション・有人宇宙活動の公式ページをご覧ください。"
    },
    name: "HTV-X",
    organization: "JAXA",
    description:
      "JAXA's next-generation unmanned cargo spacecraft, the successor to the H-II Transfer Vehicle (Kounotori), resupplying the ISS and testing new onboard technology.",
    status: "Active",
    target: "International Space Station",
    officialUrl: "https://global.jaxa.jp/projects/iss_human/",
    latestUpdateNote: "See JAXA's official ISS/human spaceflight page for HTV-X mission status."
  },
  {
    slug: "hayabusa2-extended",
    ja: {
      name: "はやぶさ2 拡張ミッション",
      description: "小惑星探査機「はやぶさ2」の拡張ミッション。2020年に小惑星リュウグウの試料を地球に届けた後、別の小天体を目指して飛行を続けています。",
      target: "深宇宙の小惑星",
      latestUpdateNote: "フライバイ観測の最新情報はJAXAの「はやぶさ2」公式ページをご覧ください。"
    },
    name: "Hayabusa2#",
    organization: "JAXA",
    description:
      "The extended mission of JAXA's Hayabusa2 asteroid sample-return spacecraft, now flying past additional small bodies after delivering its Ryugu samples to Earth in 2020.",
    status: "Extended",
    target: "Deep space asteroid flybys",
    officialUrl: "https://global.jaxa.jp/projects/sas/hayabusa2/",
    latestUpdateNote: "See JAXA's official Hayabusa2 page for the latest flyby results."
  },
  {
    slug: "slim",
    ja: {
      name: "小型月着陸実証機 SLIM",
      description: "JAXAの小型月着陸実証機。将来の探査に向けたピンポイント着陸技術を実証し、月の狙った地点付近への着陸に成功しました。",
      target: "月",
      latestUpdateNote: "ミッションの詳細はJAXAのSLIM公式ページをご覧ください。"
    },
    name: "SLIM",
    organization: "JAXA",
    description:
      "JAXA's Smart Lander for Investigating Moon, a technology demonstrator that achieved a precision lunar landing, testing pinpoint landing techniques for future exploration.",
    status: "Completed",
    target: "Moon",
    officialUrl: "https://global.jaxa.jp/projects/sas/slim/",
    latestUpdateNote: "See JAXA's official SLIM page for the full mission summary."
  }
];

export function getMissionBySlug(slug: string): MissionProfile | undefined {
  return MISSIONS.find((m) => m.slug === slug);
}

export function localizeMission(mission: MissionProfile, locale: Locale): Mission {
  return locale === "ja" ? { ...mission, ...mission.ja } : mission;
}
