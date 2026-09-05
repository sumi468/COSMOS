import type { Mission } from "@/types/cosmos";

// Static reference profiles for real, publicly documented missions. These
// are NOT "news" — they're long-lived background facts (what a mission is,
// who runs it, where to find official updates) that don't need to be
// re-fetched every page load. Every entry links to the mission's official
// page so the person can check current, up-to-the-minute status there.
// Status/target fields are deliberately conservative — for exact dates,
// always defer to officialUrl.
export const MISSIONS: Mission[] = [
  {
    slug: "artemis",
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

export function getMissionBySlug(slug: string): Mission | undefined {
  return MISSIONS.find((m) => m.slug === slug);
}
