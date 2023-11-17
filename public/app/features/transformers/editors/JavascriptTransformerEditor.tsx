import React from 'react';

import {
  DataTransformerID,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
  TransformerCategory,
} from '@grafana/data';
import { JavascriptTransformerOptions } from '@grafana/data/src/transformations/transformers/javascript';
import { CodeEditor } from '@grafana/ui';
import { CodeEditorProps } from '@grafana/ui/src/components/Monaco/types';

import { getTransformationContent } from '../docs/getTransformationContent';
// import { useAllFieldNamesFromDataFrames } from '../utils';

export const JavascriptTransformerEditor = ({
  input,
  options,
  onChange,
}: TransformerUIProps<JavascriptTransformerOptions>) => {
  //   const fieldNames = useAllFieldNamesFromDataFrames(input).map((item: string) => ({ label: item, value: item }));

  //   const onSelectColumn = useCallback(
  //     (value: SelectableValue<string>) => {
  //       onChange({
  //         ...options,
  //         columnField: value?.value,
  //       });
  //     },
  //     [onChange, options]
  //   );

  //   const onSelectRow = useCallback(
  //     (value: SelectableValue<string>) => {
  //       onChange({
  //         ...options,
  //         rowField: value?.value,
  //       });
  //     },
  //     [onChange, options]
  //   );

  //   const onSelectValue = useCallback(
  //     (value: SelectableValue<string>) => {
  //       onChange({
  //         ...options,
  //         valueField: value?.value,
  //       });
  //     },
  //     [onChange, options]
  //   );

  //   const specialValueOptions: Array<SelectableValue<SpecialValue>> = [
  //     { label: 'Null', value: SpecialValue.Null, description: 'Null value' },
  //     { label: 'True', value: SpecialValue.True, description: 'Boolean true value' },
  //     { label: 'False', value: SpecialValue.False, description: 'Boolean false value' },
  //     { label: 'Empty', value: SpecialValue.Empty, description: 'Empty string' },
  //   ];

  //   const onSelectEmptyValue = useCallback(
  //     (value: SelectableValue<SpecialValue>) => {
  //       onChange({
  //         ...options,
  //         emptyValue: value?.value,
  //       });
  //     },
  //     [onChange, options]
  //   );

  return (
    <>
      <CodeEditor showLineNumbers={true} showMiniMap={false} />
    </>
  );
};

export const javascriptTransformerRegistryItem: TransformerRegistryItem<JavascriptTransformerOptions> = {
  id: DataTransformerID.javascript,
  editor: JavascriptTransformerEditor,
  transformation: standardTransformers.javascriptTransformer,
  name: standardTransformers.javascriptTransformer.name,
  description: 'Use Javascript to manipulate fields.',
  categories: new Set([TransformerCategory.Script]),
  help: getTransformationContent(DataTransformerID.javascript).helperDocs,
};
