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
// import { CodeEditorProps } from '@grafana/ui/src/components/Monaco/types'

import { getTransformationContent } from '../docs/getTransformationContent';
// import { useAllFieldNamesFromDataFrames } from '../utils';

export const JavascriptTransformerEditor = ({
  input,
  options,
  onChange,
}: TransformerUIProps<JavascriptTransformerOptions>) => {
  const [source, setSource] = useState<string>('');

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

  return (
    <>
      {/* TODO: debugging for input DataFrames -> output DataFrames */}
      {/* TODO: way to choose between input DataFrame and input row */}
      <CodeEditor
        height={200}
        value={options.source || ''}
        onChange={onCodeChange}
        language="javascript"
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
