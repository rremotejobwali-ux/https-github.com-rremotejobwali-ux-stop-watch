export interface Lap {
  id: number;
  time: number; // total time in ms when lap was recorded
  split: number; // time since last lap
  timestamp: Date;
}

export interface AIInsight {
  duration: number;
  fact: string;
}
