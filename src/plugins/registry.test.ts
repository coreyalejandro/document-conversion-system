import { pluginRegistry } from './registry';
import { Plugin } from './types';
import React from 'react';

describe('PluginRegistry', () => {
  afterEach(() => {
    // Clear registry after each test
    pluginRegistry.getPlugins().forEach((p) => pluginRegistry.unregister(p.id));
  });

  it('loads, enables, and disables plugins', () => {
    const events: string[] = [];
    const plugin: Plugin = {
      id: 'test',
      name: 'Test Plugin',
      component: () => React.createElement('div'),
      onLoad: () => events.push('load'),
      onEnable: () => events.push('enable'),
      onDisable: () => events.push('disable'),
      onUnload: () => events.push('unload'),
    };

    pluginRegistry.register(plugin);
    pluginRegistry.enable('test');
    pluginRegistry.disable('test');
    pluginRegistry.unregister('test');

    expect(events).toEqual(['load', 'enable', 'disable', 'unload']);
  });
});
