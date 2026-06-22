export type Cake = {
  id: string;
  name: string;
  prep: number;
  bake: number;
  color: string;
};

export type ScheduledCake = Cake & {
  prepStart: number;
  prepEnd: number;
  bakeStart: number;
  bakeEnd: number;
};