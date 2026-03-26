import React, { useEffect, useMemo, useRef, useState } from "react";

type TaskItem = {
  label: string;
  why: string;
};

type RoleKey =
  | "mortal"
  | "human"
  | "student"
  | "employee"
  | "disciple"
  | "partner"
  | "family"
  | "citizen"
  | "polymath"
  | "artist"
  | "builder"
  | "consumer";

type ColumnKey = "must" | "should" | "could" | "wont";

type RoleData = {
  id: RoleKey;
  name: string;
  column: ColumnKey;
  icon: string;
  accent: string;
  border: string;
  chipBg: string;
  summary: string;
  why: string;
  tasks: Record<ColumnKey, TaskItem[]>;
};

type SectionDef = {
  key: ColumnKey;
  label: string;
  subtitle: string;
  tone: string;
  border: string;
};

const icons: Record<RoleKey | "quote", string> = {
  mortal: "M",
  human: "H",
  student: "S",
  employee: "E",
  disciple: "D",
  partner: "P",
  family: "F",
  citizen: "C",
  polymath: "Pm",
  artist: "Ar",
  builder: "B",
  consumer: "Co",
  quote: '"',
};

const roleData: Record<RoleKey, RoleData> = {
  mortal: {
    id: "mortal",
    name: "Mortal",
    column: "must",
    icon: icons.mortal,
    accent: "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(132,204,22,0.06))",
    border: "rgba(52,211,153,0.28)",
    chipBg: "rgba(16,185,129,0.18)",
    summary:
      "Take care of my physical body and baseline human needs so the rest of life is even possible.",
    why:
      "Without sleep, food, movement, and basic care, every other role degrades.",
    tasks: {
      must: [
        {
          label: "Sleep 7-9 hours",
          why: "This is foundational to mood, discipline, and reliability across every other role.",
        },
        {
          label: "Eat enough and drink water",
          why: "Basic nutrition and hydration are non-negotiable for functioning.",
        },
        {
          label: "Basic hygiene",
          why: "This supports dignity, health, and daily readiness.",
        },
      ],
      should: [
        {
          label: "Exercise 1-2x per week",
          why: "Supports strength, energy, and long-term health without overloading the week.",
        },
        {
          label: "Get sunlight and move daily",
          why: "Regulates mood, sleep, and baseline energy.",
        },
        {
          label: "PT exercises and shoulder stretches",
          why: "Important for injury management, but missing occasionally is not critical.",
        },
        {
          label: "Eat under calorie target",
          why: "Supports your current fat loss goal, but can flex when needed.",
        },
      ],
      could: [
        {
          label: "Additional cardio",
          why: "Helpful for fitness, but secondary to consistency in basics.",
        },
        {
          label: "Prioritize whole / organic foods",
          why: "Ideal for long-term health, but not worth blocking eating altogether.",
        },
        {
          label: "Consult doctor / get shoulder imaging",
          why: "Valuable, but time and mental cost make it a later priority.",
        },
      ],
      wont: [
        {
          label: "Major medical interventions this semester",
          why: "Would disrupt current priorities like school and work.",
        },
        {
          label: "Over-optimizing diet and training",
          why: "Too much complexity for this season; consistency matters more.",
        },
      ],
    },
  },
  human: {
    id: "human",
    name: "Human",
    column: "must",
    icon: icons.human,
    accent: "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(99,102,241,0.06))",
    border: "rgba(96,165,250,0.28)",
    chipBg: "rgba(59,130,246,0.18)",
    summary:
      "Govern my habits and impulses so I can reliably act in accordance with what I actually value.",
    why:
      "This is a keystone role because poor evenings and mornings spill over into school, work, relationships, and discipleship.",
    tasks: {
      must: [
        {
          label: "Protect sleep routine",
          why: "Late-night drift is one of the main sources of derailment.",
        },
        {
          label: "Reduce emotional buffering / avoid trigger loops",
          why: "This directly affects energy, self-trust, and focus.",
        },
        {
          label: "Get out of bed promptly",
          why: "The first few minutes after waking are a major leverage point.",
        },
      ],
      should: [
        {
          label: "Screen time boundaries",
          why: "Reducing frictionless scrolling makes better choices easier.",
        },
        {
          label: "Simple morning routine",
          why: "A repeatable first 10 minutes lowers decision fatigue.",
        },
      ],
      could: [
        {
          label: "Detailed habit tracking",
          why: "Potentially useful, but only if it supports action rather than over-analysis.",
        },
      ],
      wont: [
        {
          label: "Perfect discipline everywhere",
          why: "The goal is stability and progress, not a brittle perfection standard.",
        },
      ],
    },
  },
  student: {
    id: "student",
    name: "Student",
    column: "must",
    icon: icons.student,
    accent: "linear-gradient(135deg, rgba(139,92,246,0.16), rgba(217,70,239,0.06))",
    border: "rgba(167,139,250,0.28)",
    chipBg: "rgba(139,92,246,0.18)",
    summary: "Finish my remaining classes well and graduate with momentum.",
    why: "This semester has a clear end state, deadline pressure, and long-term consequences.",
    tasks: {
      must: [
        { label: "Attend class", why: "This is a direct requirement tied to current success." },
        {
          label: "Complete major assignments",
          why: "These carry the most outcome weight for finishing the semester well.",
        },
        {
          label: "Prepare for finals",
          why: "This is part of the core finish line, not optional enrichment.",
        },
      ],
      should: [
        {
          label: "Steady weekly homework blocks",
          why: "Important for avoiding last-minute pressure, but can flex week to week.",
        },
        {
          label: "Read assigned material with intention",
          why: "Supports stronger performance, though not every reading needs equal depth.",
        },
      ],
      could: [
        {
          label: "Extra academic enrichment / clubs",
          why: "Interesting, but not required to complete the degree well this semester.",
        },
      ],
      wont: [
        {
          label: "Additional self-imposed intellectual projects",
          why: "They compete with the actual finish line already in front of me.",
        },
        {
          label: "School culture / sports events",
          why: "These are not a good use of time or interest in this season, even if I enjoyed more of them earlier in college.",
        },
      ],
    },
  },
  employee: {
    id: "employee",
    name: "Worker",
    column: "should",
    icon: icons.employee,
    accent: "linear-gradient(135deg, rgba(245,158,11,0.16), rgba(249,115,22,0.06))",
    border: "rgba(251,191,36,0.28)",
    chipBg: "rgba(245,158,11,0.18)",
    summary:
      "Put in my hours, deliver assigned work, and stay trustworthy—while the job is slow enough to flex mental energy and time toward school when needed.",
    why:
      "The job is a real commitment (~30 hours), but this sprint treats school as the heavier Must. Workload has been light enough lately to protect school with time off and lighter cognitive load when that is honest and sustainable.",
    tasks: {
      must: [
        {
          label: "Be present for scheduled hours (~30 hrs / week)",
          why: "Core expectation; keeps income, trust, and continuity intact.",
        },
        {
          label: "Complete assigned work well and on time",
          why: "This is what the role is paying for; slipping here is the main professional risk.",
        },
      ],
      should: [
        {
          label: "Communicate clearly about capacity and deadlines",
          why: "Especially when shifting energy toward school or taking time that affects the team.",
        },
        {
          label: "Look for small ways to improve when bandwidth allows",
          why: "Nice to have; secondary to core delivery this semester.",
        },
      ],
      could: [
        {
          label: "Use slow weeks for school—time off or lighter focus when workload truly allows",
          why: "Matches recent reality; only when it does not hide problems or break commitments.",
        },
        {
          label: "Extra initiative beyond current scope",
          why: "Good when capacity exists, not required every week.",
        },
      ],
      wont: [
        {
          label: "Over-identifying with work at the cost of graduation and other primary roles",
          why: "Work matters, but this season the degree is the sharper constraint.",
        },
      ],
    },
  },
  disciple: {
    id: "disciple",
    name: "Disciple of Christ",
    column: "must",
    icon: icons.disciple,
    accent: "linear-gradient(135deg, rgba(234,179,8,0.16), rgba(253,224,71,0.06))",
    border: "rgba(250,204,21,0.28)",
    chipBg: "rgba(234,179,8,0.18)",
    summary:
      "Live the gospel and maintain my relationship with God so I can have the Spirit and become more like Christ.",
    why:
      "A Must in this sprint not because every hour competes on the calendar, but because discipleship is the anchor that permeates school, work, and relationships. Time may flex; the orientation does not. Pursue it faithfully rather than perfectionistically.",
    tasks: {
      must: [
        {
          label: "Sunday worship",
          why: "This is a baseline covenant and community anchor and should happen every week.",
        },
        {
          label: "Daily prayer",
          why: "A minimum viable spiritual practice keeps the relationship active every day.",
        },
        {
          label: "Daily scripture touchpoint",
          why: "Even one verse keeps scripture study alive when time is tight and is better than skipping it entirely.",
        },
        {
          label: "Temple once a month",
          why: "This is a realistic recurring spiritual anchor for your current season.",
        },
      ],
      should: [
        {
          label: "Real scripture study",
          why: "The ideal is more than a minimum touchpoint: actual study with time and attention.",
        },
        {
          label: "Study Come, Follow Me for the week",
          why: "This gives structure to weekly study and helps align scripture engagement with the Church rhythm.",
        },
        {
          label: "Move records and get a calling",
          why: "This would strengthen belonging and accountability, but it is not as urgent as core daily and weekly practices.",
        },
        {
          label: "Temple once a week",
          why: "A strong ideal, but more than what is realistically required right now.",
        },
      ],
      
      could: [
        
        {
          label: "BYU devotional each week",
          why: "Spiritually helpful, but not necessary for a successful week.",
        },
        {
          label: "Additional theological reading/listening",
          why: "Potentially rich, but not the core practice right now.",
        },
      ],
      wont: [
        {
          label: "Splits with the missionaries",
          why: "A good thing, but not a priority in this season compared with your more central responsibilities.",
        },
        {
          label: "Turning discipleship into a guilt-driven checklist",
          why: "The point is communion and transformation, not anxious scorekeeping.",
        },
      ],
    },
  },
  partner: {
    id: "partner",
    name: "Partner",
    column: "should",
    icon: icons.partner,
    accent: "linear-gradient(135deg, rgba(244,63,94,0.16), rgba(244,114,182,0.06))",
    border: "rgba(251,113,133,0.28)",
    chipBg: "rgba(244,63,94,0.18)",
    summary:
      "Cultivate and maintain a romantic relationship with Hannah in a present, intentional way.",
    why:
      "This matters deeply, but it has to be governed wisely so it strengthens the relationship without crowding out sleep, stability, or other core responsibilities.",
    tasks: {
      must: [
        {
          label: "Weekly intentional date",
          why: "Dedicated date time is one of the clearest ways to sustain and build the relationship.",
        },
        {
          label: "Weekly unstructured quality time",
          why: "Hannah seems to need both planned and relaxed connection, especially on weekends.",
        },
      ],
      should: [
        {
          label: "Weekly couple inventory",
          why: "A regular relationship check-in helps surface issues and keep the relationship deliberate rather than drifting.",
        },
        {
          label: "Discuss next steps in the relationship",
          why: "This helps clarify compatibility, expectations, and how to move forward wisely.",
        },
        {
          label: "Show affection and be emotionally available",
          why: "Presence is not just physical. Emotional warmth and responsiveness matter when you are together or talking.",
        },
        {
          label: "Be present and attentive",
          why: "The main danger is fragmented or distracted presence, not simply lack of contact.",
        },
        {
          label: "Resolve tensions and compromises directly",
          why: "Addressing friction openly helps the relationship progress instead of letting issues build or stay vague.",
        },
        {
          label: "Call during the week when it is realistic",
          why: "Calls help maintain connection, but they need to fit within actual time constraints rather than forcing long or poorly-timed conversations.",
        },
      ],
      could: [
        {
          label: "Help her with her goals",
          why: "This is a meaningful way to support her, but not a core weekly requirement.",
        },
        {
          label: "Take practical steps toward the next stage",
          why: "Things like ring shopping or other serious planning may matter soon, but they do not need to be a standing priority every week.",
        },
        {
          label: "Additional calls and outings",
          why: "Good when capacity exists, but not required for a successful week.",
        },
      ],
      wont: [
        {
          label: "Sacrifice sleep for extra relationship time",
          why: "This feels good in the moment, but it destabilizes the rest of life and eventually hurts the relationship too.",
        },
        {
          label: "Use the relationship as an escape from every other responsibility",
          why: "It should enrich life, not become avoidance.",
        },
      ],
    },
  },
  family: {
    id: "family",
    name: "Son / Brother / Family Member",
    column: "should",
    icon: icons.family,
    accent: "linear-gradient(135deg, rgba(120,113,108,0.20), rgba(228,228,231,0.05))",
    border: "rgba(168,162,158,0.28)",
    chipBg: "rgba(120,113,108,0.22)",
    summary:
      "Maintain real connection with my family and not drift into isolation from the people who matter most.",
    why:
      "This is important and identity-shaping, but it usually takes smaller recurring actions rather than heavy weekly time investment.",
    tasks: {
      must: [
        {
          label: "Stay responsive to important family needs",
          why: "Some family obligations become real priorities when they are concrete and present.",
        },
      ],
      should: [
        {
          label: "Call parents / check in",
          why: "Small recurring contact preserves closeness over time.",
        },
        {
          label: "Maintain some sibling connection",
          why: "This matters, but can be light and flexible depending on the week.",
        },
      ],
      could: [
        {
          label: "Additional family hangouts",
          why: "Good when practical, but not always realistic during a compressed semester.",
        },
      ],
      wont: [
        {
          label: "Trying to be maximally available to everyone every week",
          why: "That would create overload and reduce consistency.",
        },
      ],
    },
  },
  citizen: {
    id: "citizen",
    name: "Citizen",
    column: "could",
    icon: icons.citizen,
    accent: "linear-gradient(135deg, rgba(239,68,68,0.16), rgba(249,115,22,0.06))",
    border: "rgba(248,113,113,0.28)",
    chipBg: "rgba(239,68,68,0.18)",
    summary:
      "Stay somewhat engaged in community and politics without letting it consume the current season.",
    why:
      "There are some light obligations, but this is not the right semester for major investment here.",
    tasks: {
      must: [
        {
          label: "Fulfill minimum precinct obligations",
          why: "These are the only clearly binding commitments in this role right now.",
        },
      ],
      should: [
        {
          label: "Stay lightly informed",
          why: "Useful for continuity, but not worth letting it eat attention every day.",
        },
      ],
      could: [
        {
          label: "Attend occasional events or meetings",
          why: "Good when it fits, but not necessary for a successful semester.",
        },
      ],
      wont: [
        {
          label: "Deep political involvement right now",
          why: "It competes with school, work, and personal stability.",
        },
      ],
    },
  },
  polymath: {
    id: "polymath",
    name: "Polymath",
    column: "could",
    icon: icons.polymath,
    accent: "linear-gradient(135deg, rgba(6,182,212,0.16), rgba(20,184,166,0.06))",
    border: "rgba(34,211,238,0.28)",
    chipBg: "rgba(6,182,212,0.18)",
    summary: "Grow broad knowledge and capability across many fields over the long run.",
    why:
      "This is a legitimate aspiration, but it becomes stressful when treated like a current obligation instead of a long-term identity path.",
    tasks: {
      must: [
        {
          label: "None for this season",
          why: "This role is intentionally deactivated as a pressure source.",
        },
      ],
      should: [
        {
          label: "Keep a list of future interests",
          why: "Preserves the identity without forcing immediate action.",
        },
      ],
      could: [
        {
          label: "Podcasts / reading when naturally convenient",
          why: "Fine as enrichment, so long as it does not compete with more important roles.",
        },
      ],
      wont: [
        {
          label: "Systematic expansion across many disciplines right now",
          why: "That is a later-season project, not a current demand.",
        },
      ],
    },
  },
  artist: {
    id: "artist",
    name: "Artist",
    column: "wont",
    icon: icons.artist,
    accent: "linear-gradient(135deg, rgba(244,114,182,0.16), rgba(168,85,247,0.06))",
    border: "rgba(244,114,182,0.32)",
    chipBg: "rgba(244,114,182,0.18)",
    summary:
      "Express and refine creativity—music, writing, performance, and other artistic work—as its own lane.",
    why:
      "This identity matters long-term, but the semester sprint needs this channel quiet except for small restorative outlets.",
    tasks: {
      must: [
        {
          label: "None for this season",
          why: "This role is intentionally paused, not abandoned.",
        },
      ],
      should: [
        {
          label: "Capture creative ideas when they arise",
          why: "Keeps songwriting, writing, and other art alive without reactivating big commitments.",
        },
      ],
      could: [
        {
          label: "Very small optional creative moments",
          why: "Allowed if restorative, but not as another major project stream.",
        },
        {
          label: "Play my guitar",
          why: "For short moments of relaxation and enjoyment.",
        },
      ],
      wont: [
        {
          label: "Re-record and reproduce songs",
          why: "This is a long-term goal, not a current obligation.",
        },
        {
          label: "Start a Substack/Blog",
          why: "This is a long-term goal, not a current obligation.",
        },
      ],
    },
  },
  builder: {
    id: "builder",
    name: "Builder",
    column: "wont",
    icon: icons.builder,
    accent: "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(99,102,241,0.06))",
    border: "rgba(196,181,253,0.28)",
    chipBg: "rgba(168,85,247,0.18)",
    summary:
      "Ship systems, software, tooling, and structured projects—STEM and systemic work that creates leverage.",
    why:
      "Meaningful, but the clearest lane to park until after graduation alongside other deferred builds.",
    tasks: {
      must: [
        {
          label: "None for this season",
          why: "This role is intentionally paused, not abandoned.",
        },
      ],
      should: [
        {
          label: "Capture technical or product ideas when they arise",
          why: "Keeps the builder mindset alive without opening new execution threads.",
        },
      ],
      could: [
        {
          label: "Tiny optional fixes or spikes",
          why: "Only if restorative and minutes, not a new project stream.",
        },
      ],
      wont: [
        {
          label: "Launching major side projects before graduation",
          why: "This is the most obvious overload multiplier.",
        },
        {
          label: "Deploy farm website",
          why: "This will take significant time and effort, and there isn't any deadline pressure.",
        },
      ],
    },
  },
  consumer: {
    id: "consumer",
    name: "Consumer",
    column: "wont",
    icon: icons.consumer,
    accent: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(120,113,108,0.07))",
    border: "rgba(245,158,11,0.30)",
    chipBg: "rgba(245,158,11,0.16)",
    summary:
      "Spend money and attention on media, goods, and leisure in a bounded way—enough for real life, not as the main event.",
    why:
      "Consumption is unavoidable, but this sprint treats it as a small, guarded lane so it does not crowd out formation, relationships, or graduation work.",
    tasks: {
      must: [],
      should: [],
      could: [
        {
          label: "Shared entertainment with people I care about",
          why: "Movies, games, or shows are fine when the point is time together, not chasing content for its own sake.",
        },
        {
          label: "Buy enough for real needs and other goals",
          why: "Food, gear, and services that support health, school, and relationships—without treating shopping as a hobby or identity.",
        },
      ],
      wont: [
        {
          label: "Treat buying or scrolling as main decompression",
          why: "Default stress relief should not be solo consumption or endless feeds.",
        },
        {
          label: "Impulse upgrades, extra subscriptions, or retail as mood repair",
          why: "Small leaks add up and compete with tuition, time, and sleep.",
        },
        {
          label: "Keeping up with releases, hype, or lifestyle benchmarks",
          why: "Comparison-driven spending is a moving target that never satisfies.",
        },
      ],
    },
  },
};

const sections: SectionDef[] = [
  {
    key: "must",
    label: "Must",
    subtitle: "Mandatory for a stable, successful semester",
    tone: "linear-gradient(180deg, rgba(139,92,246,0.16), rgba(139,92,246,0.04))",
    border: "rgba(167,139,250,0.22)",
  },
  {
    key: "should",
    label: "Should",
    subtitle: "Important and identity-shaping, but more flexible",
    tone: "linear-gradient(180deg, rgba(59,130,246,0.16), rgba(59,130,246,0.04))",
    border: "rgba(96,165,250,0.22)",
  },
  {
    key: "could",
    label: "Could",
    subtitle: "Good when capacity exists, not a weekly requirement",
    tone: "linear-gradient(180deg, rgba(245,158,11,0.16), rgba(245,158,11,0.04))",
    border: "rgba(251,191,36,0.22)",
  },
  {
    key: "wont",
    label: "Won't",
    subtitle: "Explicitly deferred for this season",
    tone: "linear-gradient(180deg, rgba(244,63,94,0.16), rgba(244,63,94,0.04))",
    border: "rgba(251,113,133,0.22)",
  },
];

/** Life-arc framing: which MoSCoW column each role sits in (semester task data unchanged). */
const lifeArcColumnByRole: Record<RoleKey, ColumnKey> = {
  mortal: "must",
  human: "must",
  disciple: "must",
  family: "must",
  partner: "must",
  student: "should",
  employee: "should",
  citizen: "should",
  polymath: "could",
  artist: "could",
  builder: "could",
  consumer: "wont",
};

const LIFE_ARC_ROLE_ORDER: RoleKey[] = [
  "mortal",
  "human",
  "disciple",
  "family",
  "partner",
  "student",
  "employee",
  "citizen",
  "polymath",
  "artist",
  "builder",
  "consumer",
];

const lifeArcOrderIndex: Record<RoleKey, number> = Object.fromEntries(
  LIFE_ARC_ROLE_ORDER.map((k, i) => [k, i]),
) as Record<RoleKey, number>;

function sortRolesForScope(roles: RoleData[], scope: "semester" | "life"): RoleData[] {
  if (scope === "semester") {
    return roles;
  }
  return [...roles].sort(
    (a, b) => (lifeArcOrderIndex[a.id] ?? 99) - (lifeArcOrderIndex[b.id] ?? 99),
  );
}

const quoteOptions = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    source: "Aristotle",
  },
  {
    text: "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    source: "Aristotle",
  },
  {
    text: "The good for man is an activity of the soul in accordance with virtue.",
    source: "Aristotle",
  },
  {
    text: "We should begin by recognizing the reality that just because something is good is not a sufficient reason for doing it… Some things are better, and others are best.",
    source: "Dallin H. Oaks",
  },
  {
    text: "Decide what you will be and then do what you must do.",
    source: "Spencer W. Kimball",
  },
];

const QUOTE_ROTATE_MS = 5000;

const baseCard: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
};

function Pill({
  role,
  active,
  onClick,
}: {
  role: RoleData;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 18,
        border: `1px solid ${role.border}`,
        background: role.chipBg,
        color: "#f4f4f5",
        padding: "14px",
        cursor: "pointer",
        opacity: active ? 1 : 0.9,
        transform: active ? "translateY(-1px) scale(1.01)" : "translateY(0)",
        transition: "all 160ms ease",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {role.icon}
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>{role.name}</div>
        <div style={{ fontSize: 12, color: "#a1a1aa", marginTop: 2 }}>
          {role.summary}
        </div>
      </div>
    </button>
  );
}

function TaskChip({ item }: { item: TaskItem }) {
  return (
    <div
      title={item.why}
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.05)",
        color: "rgba(244,244,245,0.92)",
        padding: "10px 12px",
        fontSize: 14,
        lineHeight: 1.45,
      }}
    >
      {item.label}
    </div>
  );
}

function SectionCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: TaskItem[];
  tone: string;
}) {
  return (
    <div
      style={{
        ...baseCard,
        background: tone,
        borderRadius: 22,
        padding: 16,
      }}
    >
      <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
        {title}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((item, idx) => (
          <TaskChip key={`${title}-${idx}-${item.label}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function ResponsiveGrid({
  children,
  minWidth = 260,
}: {
  children: React.ReactNode;
  minWidth?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleKey>("mortal");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayQuoteIndex, setDisplayQuoteIndex] = useState(0);
  const [quoteExiting, setQuoteExiting] = useState(false);
  const [quoteAnimReady, setQuoteAnimReady] = useState(false);
  const quoteExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quoteRotationSeenRef = useRef(false);

  const [scopeView, setScopeView] = useState<"semester" | "life">("semester");

  useEffect(() => {
    setQuoteAnimReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setQuoteIndex((i) => (i + 1) % quoteOptions.length);
        scheduleNext();
      }, QUOTE_ROTATE_MS);
    };
    scheduleNext();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (quoteIndex === displayQuoteIndex) return;
    if (quoteExitTimerRef.current) {
      clearTimeout(quoteExitTimerRef.current);
      quoteExitTimerRef.current = null;
    }
    setQuoteExiting(true);
    quoteExitTimerRef.current = setTimeout(() => {
      setDisplayQuoteIndex(quoteIndex);
      setQuoteExiting(false);
      quoteRotationSeenRef.current = true;
      quoteExitTimerRef.current = null;
    }, 320);
    return () => {
      if (quoteExitTimerRef.current) {
        clearTimeout(quoteExitTimerRef.current);
        quoteExitTimerRef.current = null;
      }
    };
  }, [quoteIndex, displayQuoteIndex]);

  const selectedRole = roleData[selectedRoleId] ?? roleData.mortal;

  const groupedRoles = useMemo(() => {
    return sections.map((section) => {
      const roles = Object.values(roleData).filter((role) =>
        scopeView === "semester"
          ? role.column === section.key
          : lifeArcColumnByRole[role.id] === section.key,
      );
      const subtitle =
        section.key === "must"
          ? scopeView === "semester"
            ? "Mandatory for a stable, successful semester"
            : "Mandatory for a stable, successful life"
          : section.subtitle;
      return {
        ...section,
        subtitle,
        roles: sortRolesForScope(roles, scopeView),
      };
    });
  }, [scopeView]);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#f4f4f5",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 28%), radial-gradient(circle at top right, rgba(251,191,36,0.10), transparent 24%), radial-gradient(circle at bottom, rgba(168,85,247,0.12), transparent 30%), #0a0d12",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div className="page-shell" style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div className="hero-grid">
          <div className="hero-head">
            <div
              style={{
                display: "inline-block",
                marginBottom: 16,
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(20, 14, 14, 0.05)",
                color: "#e4e4e7",
                fontSize: 12,
                letterSpacing: "0.03em",
              }}
            >
              IS 562 - Prioritization Frameworks - Josh Michaelson
            </div>
            <h1
              style={{
                margin: 0,
                maxWidth: 760,
                fontSize: "clamp(2.25rem, 8vw, 5.5rem)",
                lineHeight: 0.96,
                fontWeight: 650,
                letterSpacing: "-0.03em",
              }}
            >
              Telos-Driven MoSCoW Prioritization
            </h1>
          </div>

          <div className="hero-statue">
            <img
              src={`${import.meta.env.BASE_URL}statue.png`}
              alt="Man carving himself from marble"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>

          <div className="hero-rest">
            <p
              style={{
                margin: 0,
                maxWidth: 760,
                color: "#d4d4d8",
                fontSize: 18,
                lineHeight: 1.75,
              }}
            >
              A role-based MoSCoW framework for ordering responsibilities according to the kind of life I am trying to build.
            </p>

            <div
              style={{
                ...baseCard,
                marginTop: 22,
                borderRadius: 22,
                padding: 20,
                maxWidth: 760,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "#c4c4cc",
                }}
              >
                The good life is ordered, not exhaustive. This is a MoSCoW snapshot for the sprint to graduation: roles in the grid below, and another MoSCoW inside each role when you open it. It frames this season, not my whole life. Toggle{" "}
                <strong style={{ color: "#e4e4e7", fontWeight: 600 }}>Semester sprint</strong>
                {" "}
                and{" "}
                <strong style={{ color: "#e4e4e7", fontWeight: 600 }}>Life arc</strong>
                {" "}
                above the grid to compare this term against the longer arc.
              </p>
            </div>

            <div
              style={{ ...baseCard, marginTop: 20, borderRadius: 24, padding: 18 }}
              aria-live="polite"
              aria-atomic="true"
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20, color: "#a1a1aa", lineHeight: 1 }} aria-hidden="true">
                  {icons.quote}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    key={displayQuoteIndex}
                    className={
                      quoteAnimReady && quoteExiting
                        ? "quote-rotator-panel quote-rotator-exit"
                        : quoteAnimReady && !quoteExiting && quoteRotationSeenRef.current
                          ? "quote-rotator-panel quote-rotator-enter"
                          : "quote-rotator-panel"
                    }
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.75,
                        color: "#e4e4e7",
                        fontStyle: "italic",
                      }}
                    >
                      “{quoteOptions[displayQuoteIndex].text}”
                    </p>
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        color: "#71717a",
                      }}
                    >
                      — {quoteOptions[displayQuoteIndex].source}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section style={{ marginTop: 64 }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 34, fontWeight: 620 }}>Role Hierarchy</h2>
              <p
                style={{
                  marginTop: 10,
                  maxWidth: 780,
                  color: "#a1a1aa",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Select a role to continue
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setScopeView("semester")}
                style={{
                  borderRadius: 999,
                  border:
                    scopeView === "semester"
                      ? "1px solid rgba(255,255,255,0.22)"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    scopeView === "semester"
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(255,255,255,0.03)",
                  color: "#e4e4e7",
                  fontSize: 12,
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                Semester sprint (to graduation)
              </button>
              <button
                type="button"
                onClick={() => setScopeView("life")}
                style={{
                  borderRadius: 999,
                  border:
                    scopeView === "life"
                      ? "1px solid rgba(255,255,255,0.22)"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    scopeView === "life"
                      ? "rgba(255,255,255,0.10)"
                      : "rgba(255,255,255,0.03)",
                  color: "#e4e4e7",
                  fontSize: 12,
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                Life arc
              </button>
            </div>
          </div>

          <ResponsiveGrid minWidth={260}>
            {groupedRoles.map((section) => (
              <div
                key={section.key}
                style={{
                  ...baseCard,
                  background: section.tone,
                  borderRadius: 26,
                  border: `1px solid ${section.border}`,
                  padding: 16,
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 19, fontWeight: 620, color: "#ffffff" }}>
                    {section.label}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "#a1a1aa",
                    }}
                  >
                    {section.subtitle}
                  </div>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {section.roles.length === 0 ? (
                    <div style={{ color: "#71717a", fontSize: 13, lineHeight: 1.6 }}>
                      <div>None for now.</div>
                      {scopeView === "life" && section.key === "wont" && (
                        <div style={{ marginTop: 8, fontSize: 12, color: "#52525b" }}>
                          Later: life-arc “won’t” might name explicitly deferred identities, habits, or seasons.
                        </div>
                      )}
                    </div>
                  ) : (
                    section.roles.map((role) => (
                      <Pill
                        key={role.id}
                        role={role}
                        active={selectedRoleId === role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </ResponsiveGrid>
        </section>

        <section style={{ marginTop: 64 }}>
          <div
            style={{
              ...baseCard,
              borderRadius: 32,
              border: `1px solid ${selectedRole.border}`,
              background: selectedRole.accent,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 12,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.16)",
                    color: "#d4d4d8",
                    padding: "8px 12px",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  <span>{selectedRole.icon}</span>
                  Active role analysis
                </div>
                <h3 style={{ margin: 0, fontSize: 36, fontWeight: 640 }}>{selectedRole.name}</h3>
                <p
                  style={{
                    marginTop: 12,
                    maxWidth: 800,
                    color: "#e4e4e7",
                    fontSize: 16,
                    lineHeight: 1.75,
                  }}
                >
                  {selectedRole.summary}
                </p>
              </div>
              <div
                style={{
                  maxWidth: 520,
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.16)",
                  padding: 16,
                  color: "#e4e4e7",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <div
                  style={{
                    marginBottom: 6,
                    color: "#a1a1aa",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  Why this role belongs here
                </div>
                {selectedRole.why}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              {scopeView === "life" && (
                <div
                  style={{
                    marginBottom: 20,
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(0,0,0,0.22)",
                    padding: "14px 16px",
                    color: "#d4d4d8",
                    fontSize: 13,
                    lineHeight: 1.65,
                  }}
                >
                  <strong style={{ color: "#e4e4e7" }}>Semester task ordering.</strong> The Must / Should / Could / Won’t lists below are still sorted for finishing this semester’s sprint—not re-ranked for life-arc role priority. Use <strong>Life arc</strong> above for which roles sit in which column; use <strong>Semester sprint</strong> for task-level ordering through graduation.
                </div>
              )}
              <ResponsiveGrid minWidth={220}>
                <SectionCard
                  title="Must"
                  items={selectedRole.tasks.must}
                  tone="linear-gradient(180deg, rgba(139,92,246,0.14), rgba(139,92,246,0.03))"
                />
                <SectionCard
                  title="Should"
                  items={selectedRole.tasks.should}
                  tone="linear-gradient(180deg, rgba(59,130,246,0.14), rgba(59,130,246,0.03))"
                />
                <SectionCard
                  title="Could"
                  items={selectedRole.tasks.could}
                  tone="linear-gradient(180deg, rgba(245,158,11,0.14), rgba(245,158,11,0.03))"
                />
                <SectionCard
                  title="Won't"
                  items={selectedRole.tasks.wont}
                  tone="linear-gradient(180deg, rgba(244,63,94,0.14), rgba(244,63,94,0.03))"
                />
              </ResponsiveGrid>
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: 64,
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            color: "#71717a",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Telos, in this project, means ordering responsibilities according to ends: not merely what can be done, but what should govern this season of life.
        </footer>
      </div>

      <style>{`
        .quote-rotator-panel {
          will-change: transform, opacity;
        }
        .quote-rotator-enter {
          animation: quoteRotatorIn 0.4s ease-out both;
        }
        .quote-rotator-exit {
          animation: quoteRotatorOut 0.3s ease-in forwards;
        }
        @keyframes quoteRotatorIn {
          from {
            opacity: 0;
            transform: translateX(1.25rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes quoteRotatorOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-1.1rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .quote-rotator-enter,
          .quote-rotator-exit {
            animation: none !important;
          }
          .quote-rotator-exit {
            opacity: 0.001;
          }
        }
        .hero-grid {
          display: grid;
          gap: 32px;
          grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.95fr);
          grid-template-rows: auto 1fr;
          grid-template-areas:
            "head statue"
            "rest statue";
          align-items: start;
        }
        .hero-head {
          grid-area: head;
        }
        .hero-statue {
          grid-area: statue;
          min-width: 0;
        }
        .hero-rest {
          grid-area: rest;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        @media (max-width: 960px) {
          .page-shell {
            padding: 24px 16px 40px !important;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            grid-template-areas:
              "head"
              "statue"
              "rest";
            gap: 24px;
          }
          .hero-statue img {
            max-height: min(380px, 50vh);
            width: 100%;
            object-fit: contain;
            object-position: center top;
          }
        }
      `}</style>
    </div>
  );
}
