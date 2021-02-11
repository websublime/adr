type LANGS = 'pt' | 'en';

export interface MarkDownReplacementOptions {
  replacements: {
    regex: RegExp | string;
    sub: string;
  }[];
}

export interface DecisionConfig {
  date: string;
  filename: string;
  id: number;
  name: string;
  state: string;
}

export type I18N_LANG = {
  [key in LANGS]: {
    DECISION: string;
    STATE: string;
    STATUS: {
      ACCEPTED: string;
      DEPRECATED: string;
      DONE: string;
      PROPOSED: string;
      SUPERSEDED: string;
    };
  };
};
