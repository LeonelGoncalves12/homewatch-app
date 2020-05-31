import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Translate} from "./Translate";
import {Injectable} from "@angular/core";

@Injectable()
export class DateCalculator {
  constructor(public translate: Translate) {

  }
   async TranslateNextRun(nextrun, language) {
console.log(language)
    return Moment(nextrun, 'YYYY-MM-DDTHH:mm:ssZ').locale(language).fromNow();
  }

  calculateHourRange(initial, final) {

    const moment = extendMoment(Moment);

    let range = moment.range(initial, final);

    return Array.from(range.by('hours')).map(m => m.format('H'));

  }

}
