import { getQuickJS, QuickJSWASMModule, QuickJSHandle } from 'quickjs-emscripten';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { DataFrame } from '../../types/dataFrame';
import { DataTransformContext, SynchronousDataTransformerInfo } from '../../types/transformations';

import { DataTransformerID } from './ids';

export interface JavascriptTransformerOptions {
  source: string;
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
  quickJSVM?: any;
  handles?: QuickJSHandle[]
}

async function executeJavascriptWithOptions(
  options: JavascriptTransformerOptions,
  ctx: JavascriptTransformerContext,
  data: DataFrame[]
): Promise<DataFrame[]> {

  if (!ctx.quickJSVM) {
    let quickJS = await getQuickJS()
    ctx.quickJSVM = quickJS.newContext();
    console.log('what')
    const logHandle = ctx.quickJSVM.newFunction("log", (...args) => {
      const nativeArgs = args.map(ctx.quickJSVM.dump);
      console.log("JavascriptTransformation:", ...nativeArgs);
    })
    const consoleHandle = ctx.quickJSVM.newObject();
    // const jsonHandle = ctx.quickJSVM.newObject();
    // const parseHandle = ctx.quickJSVM.newFunction("parse", (...args) => {
    //   console.log('trying to parse here??', args)
    //   const nativeArgs = args.map(ctx.quickJSVM.dump) as any;
    //   console.log('passing args:', nativeArgs)
    //   const parsed = JSON.parse(nativeArgs)

    //   console.log('parsed:', parsed)
    //   return ctx.quickJSVM.newObject(parsed)

    // })
    // ctx.quickJSVM.setProp(ctx.quickJSVM.global, "JSON", jsonHandle)
    // ctx.quickJSVM.setProp(jsonHandle, "parse", parseHandle)
    ctx.quickJSVM.setProp(ctx.quickJSVM.global, "console", consoleHandle);
    ctx.quickJSVM.setProp(consoleHandle, "log", logHandle);
    logHandle.dispose();
    consoleHandle.dispose();
    // parseHandle.dispose();
    // jsonHandle.dispose();
  }
  let dataHandle = ctx.quickJSVM.newString(JSON.stringify(data))
  // TODO: consider different serde method
  ctx.quickJSVM.setProp(ctx.quickJSVM.global, "df", dataHandle)
  dataHandle.dispose();


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
    source.pipe(mergeMap((data: DataFrame[]) => from(executeJavascriptWithOptions(options, ctx, data)))),
  transformer: (options: JavascriptTransformerOptions, { quickJSVM }: JavascriptTransformerContext) => (frames: DataFrame[]) => {

    if (quickJSVM) {
      let result = quickJSVM.unwrapResult(quickJSVM.evalCode(options.source)).consume((dataframes) =>
        console.log('native state:', dataframes)
      );
      console.log("result baby???", result);
    }
    return frames;
  },
};
