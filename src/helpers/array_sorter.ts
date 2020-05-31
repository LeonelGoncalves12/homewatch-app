import { ThingsInfoHelper } from "./things_info";

export class ArraySorterHelper {
  static sortArrayByID(array: Array<{ id: number }>): Array<{ id: number }> {
    return array.sort((a, b) => a.id - b.id);
  }

  static filterAssignableThings(things: Array<any>): Array<any> {
    return things.filter(t => ThingsInfoHelper.getThingInfo(t.type).readOnly === false);
  }
}
