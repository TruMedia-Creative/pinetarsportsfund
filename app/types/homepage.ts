export type HomepageAboutTimelineItem = {
  period: string;
  label: string;
  description: string;
};

export type HomepageAboutProfile = {
  name: string;
  title: string;
  quote: string;
  body: string;
  imageUrl?: string;
  credibilityBullets: string[];
  timelineItems: HomepageAboutTimelineItem[];
};

export type HomepageLink = {
  label: string;
} & Record<string, unknown>;

export type HomepageNarrativeSection = {
  title: string;
  paragraphs: string[];
};

export type HomepageMechanismSection = {
  title: string;
  description: string;
  items: string[];
};

export type HomepageProcessItem = {
  step: string;
  title: string;
  description: string;
};

export type HomepageProcessSection = {
  title: string;
  items: HomepageProcessItem[];
};

export type HomepageContent = {
  seo?: {
    title?: string;
    description?: string;
  };
  title?: string;
  description?: string;
  hero: {
    headline?: string;
    links: HomepageLink[];
  };
  logos: {
    title: string;
    items: string[];
  };
  about: {
    headline?: string;
    title: string;
    description: string;
    primaryProfile: HomepageAboutProfile;
    profiles?: HomepageAboutProfile[];
  };
  metrics: {
    headline?: string;
    title: string;
    description: string;
    items: Array<{ value: string; label: string; class: string }>;
  };
  problem: HomepageNarrativeSection;
  guide: HomepageNarrativeSection;
  mechanism: HomepageMechanismSection;
  process: HomepageProcessSection;
  features: {
    headline?: string;
    title: string;
    description: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  cta: {
    title: string;
    description: string;
    command: string;
    links: HomepageLink[];
  };
};
