import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten';
import { map } from 'rxjs/operators';

import { DataTransformerInfo } from '../../types';

import { DataTransformerID } from './ids';
import { noopTransformer } from './noop';

export interface JavascriptTransformerOptions {
  // True/False or auto
  // timeSeries?: boolean;
  // mode: CalculateFieldMode; // defaults to 'reduce'
  // // Only one should be filled
  // reduce?: ReduceOptions;
  // window?: WindowOptions;
  // cumulative?: CumulativeOptions;
  // binary?: BinaryOptions;
  // unary?: UnaryOptions;
  // index?: IndexOptions;
  // // Remove other fields
  // replaceFields?: boolean;
  // // Output field properties
  // alias?: string; // The output field name
  // // TODO: config?: FieldConfig; or maybe field overrides? since the UI exists
}

export const javascriptTransformer: DataTransformerInfo<JavascriptTransformerOptions> = {
  operator: (options, ctx) => (outerSource) => {
    const operator = noopTransformer.operator({}, ctx);
    getQuickJS().then((QuickJS) => {
      const result = QuickJS.evalCode('1 + 1', {
        shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
        memoryLimitBytes: 1024 * 1024,
      });
      console.log(result);
    });
    return outerSource.pipe(
      operator,
      map((data) => data)
    );
  },
  id: DataTransformerID.javascript,
  name: 'Transform using Javascript',
  description: 'Write Javascript code to manipulate data frames',
};
