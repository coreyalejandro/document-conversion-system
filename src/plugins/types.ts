import { Document } from '@/types';
import { ComponentType } from 'react';

export interface PluginProps {
  /** Document currently being viewed */
  document: Document;
}

/**
 * Basic plugin interface. Plugins provide a React component that will be
 * rendered by the DocumentViewer when the plugin is enabled. Lifecycle hooks
 * allow plugins to execute logic when they are loaded or their enabled state
 * changes.
 */
export interface Plugin {
  /** Unique identifier for the plugin */
  id: string;
  /** Human readable plugin name */
  name: string;
  /** React component rendered in the plugin slot */
  component: ComponentType<PluginProps>;
  /** Called once when the plugin is registered */
  onLoad?(): void | Promise<void>;
  /** Called once when the plugin is unregistered */
  onUnload?(): void | Promise<void>;
  /** Called whenever the plugin is enabled */
  onEnable?(): void | Promise<void>;
  /** Called whenever the plugin is disabled */
  onDisable?(): void | Promise<void>;
}

/** Internal representation of a plugin within the registry */
export interface RegisteredPlugin extends Plugin {
  enabled: boolean;
}
