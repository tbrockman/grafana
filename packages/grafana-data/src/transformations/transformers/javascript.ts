import { getQuickJS, QuickJSWASMModule, shouldInterruptAfterDeadline } from 'quickjs-emscripten';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { DataTransformerInfo } from '../../types';
import { DataFrame } from '../../types/dataFrame';
import { DataTransformContext, SynchronousDataTransformerInfo } from '../../types/transformations';

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

export interface JavascriptTransformerContext extends DataTransformContext {
  quickJS?: QuickJSWASMModule;
}

async function executeJavascriptWithOptions(
  options: JavascriptTransformerOptions,
  ctx: JavascriptTransformerContext,
  data
): Promise<DataFrame[]> {
  console.log(options, ctx, data);
  let quickJS = ctx.quickJS;

  if (!quickJS) {
    quickJS = await getQuickJS();
  }

  const vm = quickJS.newContext();
  let state = 0;

  const fnHandle = vm.newFunction('getDataFrames', () => {
    console.log('getDataFrames called', data);
    return vm.newObject(data);
  });

  vm.setProp(vm.global, 'getDataFrames', fnHandle);
  fnHandle.dispose();

  vm.unwrapResult(vm.evalCode(`getDataFrames()`)).consume((dataframes) =>
    console.log('vm result:', vm.getObject(dataframes), 'native state:', dataframes)
  );
  vm.dispose();

  // const result = quickJS.evalCode(options.source, {
  // 	shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
  // 	memoryLimitBytes: 1024 * 1024
  // });
  // console.log('executeJavascriptWithOptions received: ', result);
  return javascriptTransformer.transformer(options, ctx)(data);
}

export const javascriptTransformer: SynchronousDataTransformerInfo<JavascriptTransformerOptions> = {
  id: DataTransformerID.javascript,
  name: 'Transform using Javascript',
  description: 'Write Javascript code to manipulate data frames',
  operator: (options, ctx) => (source) =>
    source.pipe(mergeMap(from(executeJavascriptWithOptions(options, ctx, source)))),
  transformer: (options: JavascriptTransformerOptions, ctx: DataTransformContext) => (frames: DataFrame[]) => frames,
};
