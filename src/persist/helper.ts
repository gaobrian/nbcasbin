import { Model } from '../model';
// import { parse } from 'csv-parse';
import * as Papa from 'papaparse';


export class Helper {
  public static loadPolicyLine(line: string, model: Model): void {
    if (!line || line.trimStart().charAt(0) === '#') {
      return;
    }

    // const _parser = parse({
    //   delimiter: ',',
    //   skip_empty_lines: true,
    //   trim: true,
    // });

    const result = Papa.parse<string>(line, {
      delimiter: ',',
      skipEmptyLines: true,
      transform: (value: string, row) => {
        return value.trim();
      }
    });

    // const tokens: any = [];
    // _parser.on('readable', function () {
    //   let record;
    //   while ((record = _parser.read()) !== null) {
    //     tokens.push(record);
    //   }
    // });
    // _parser.write(line);
    // _parser.end();

    const tokens: any = result.data;
    if (!tokens || !tokens[0]) {
      return;
    }

    // console.log(tokens);
    // console.log("1",result);

    const key = tokens[0][0];
    const sec = key.substring(0, 1);
    const item = model.model.get(sec);
    if (!item) {
      return;
    }

    const policy = item.get(key);
    if (!policy) {
      return;
    }
    policy.policy.push(tokens[0].slice(1));
  }
}
