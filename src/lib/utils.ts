import { partition } from "@gbagan/utils";
import type { Cake, ScheduledCake } from "./types";

export function computeSchedule(order: Cake[]): ScheduledCake[] {
  let prepAvailableAt = 0;
  let ovenAvailableAt = 0;

  return order.map((cake) => {
    const prepStart = prepAvailableAt;
    const prepEnd = prepStart + cake.prep;

    const bakeStart = Math.max(prepEnd, ovenAvailableAt);
    const bakeEnd = bakeStart + cake.bake;

    prepAvailableAt = prepEnd;
    ovenAvailableAt = bakeEnd;

    return {
      ...cake,
      prepStart,
      prepEnd,
      bakeStart,
      bakeEnd
    };
  });
}

export function johnsonOrder(cakes: Cake[]): Cake[] {
  const [firstPart, secondPart] = partition(cakes, c => c.prep <= c.bake);
  firstPart.sort((a, b) => a.prep - b.prep);
  secondPart.sort((a, b) => b.bake - a.bake);
  return [...firstPart, ...secondPart];
}