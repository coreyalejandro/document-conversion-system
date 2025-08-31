import { RegisteredPlugin, Plugin } from './types';

type Listener = () => void;

class PluginRegistry {
  private plugins = new Map<string, RegisteredPlugin>();
  private listeners = new Set<Listener>();

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin '${plugin.id}' is already registered`);
    }
    this.plugins.set(plugin.id, { ...plugin, enabled: false });
    void plugin.onLoad?.();
    this.emit();
  }

  unregister(id: string) {
    const plugin = this.plugins.get(id);
    if (!plugin) return;
    if (plugin.enabled) {
      void plugin.onDisable?.();
    }
    void plugin.onUnload?.();
    this.plugins.delete(id);
    this.emit();
  }

  enable(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin && !plugin.enabled) {
      plugin.enabled = true;
      void plugin.onEnable?.();
      this.emit();
    }
  }

  disable(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin && plugin.enabled) {
      plugin.enabled = false;
      void plugin.onDisable?.();
      this.emit();
    }
  }

  getPlugins(): RegisteredPlugin[] {
    return Array.from(this.plugins.values());
  }

  getEnabledPlugins(): RegisteredPlugin[] {
    return this.getPlugins().filter((p) => p.enabled);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const pluginRegistry = new PluginRegistry();
