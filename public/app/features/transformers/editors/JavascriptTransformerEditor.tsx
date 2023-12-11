import React, { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';

import {
  DataTransformerID,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
  TransformerCategory,
} from '@grafana/data';
import { JavascriptTransformerOptions } from '@grafana/data/src/transformations/transformers/javascript';
import { CodeEditor } from '@grafana/ui';

import { getTransformationContent } from '../docs/getTransformationContent';

export const JavascriptTransformerEditor = ({
  input,
  options,
  onChange,
}: TransformerUIProps<JavascriptTransformerOptions>) => {
  const defaultSource = `let dataframes = JSON.parse(df)
  
  console.log('oh good so it worked I guess.', dataframes)

  // your code here ⤵︎
`
  const [source, setSource] = useState<string>(defaultSource);

  useDebounce(
    () => {
      console.log('debounced??');
      onChange({
        ...options,
        source,
      });
    },
    1250,
    [source]
  );

  // TODO: debounce
  const onCodeChange = useCallback((value: string | undefined) => {
    const source = value ?? '';
    setSource(source);
  }, []);

  const onBeforeEditorMount = (monaco: any) => {
    console.log('before mount')
    // TODO: monaco add fields for uneditable code
    monaco.languages.typescript.typescriptDefaults.addExtraLib('type DataFrame {}, let df: string') // TODO: read from compiled source
  }

  return (
    <>
      {/* TODO: debugging for input DataFrames -> output DataFrames */}
      {/* TODO: way to choose between input DataFrame and input row */}
      <CodeEditor
        height={200}
        value={options.source || defaultSource}
        onBeforeEditorMount={onBeforeEditorMount}
        onChange={onCodeChange}
        language="typescript"
        showLineNumbers={true}
        showMiniMap={false}
      />
    </>
  );
};

export const javascriptTransformerRegistryItem: TransformerRegistryItem<JavascriptTransformerOptions> = {
  id: DataTransformerID.javascript,
  editor: JavascriptTransformerEditor,
  transformation: standardTransformers.javascriptTransformer,
  name: standardTransformers.javascriptTransformer.name,
  description: 'Use Javascript to manipulate query results.',
  categories: new Set([TransformerCategory.Script]),
  help: getTransformationContent(DataTransformerID.javascript).helperDocs,
};
