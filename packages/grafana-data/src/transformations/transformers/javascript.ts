import { QuickJSWASMModule } from 'quickjs-emscripten';
import { map } from 'rxjs/operators';

import { DataTransformerInfo } from '../../types';
import { DataFrame } from '../../types/dataFrame';
import { SynchronousDataTransformerInfo } from '../../types/transformations';

import { DataTransformerID } from './ids';
import { noopTransformer } from './noop';

export interface JavascriptTransformerOptions {
  source: string;
  quickJS?: QuickJSWASMModule;
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
export const javascriptTransformer: SynchronousDataTransformerInfo<JavascriptTransformerOptions> = {
  id: DataTransformerID.javascript,
  name: 'Transform using Javascript',
  description: 'Write Javascript code to manipulate data frames',
  operator: async (options, ctx) => (source) =>
    source.pipe(map((data) => javascriptTransformer.transformer(options, ctx)(data))),
  transformer: (options, ctx) => (frames: DataFrame[]) => {
    console.log('transformer received options: ', options);
    return frames;
  },
};
