import React from 'react';
import { Plugin } from './types';
import { Document } from '@/types';

const ExamplePluginComponent: React.FC<{ document: Document }> = ({ document }) => {
  return <div data-testid="example-plugin">Example for {document.title}</div>;
};

export const ExamplePlugin: Plugin = {
  id: 'example',
  name: 'Example Plugin',
  component: ExamplePluginComponent,
};
