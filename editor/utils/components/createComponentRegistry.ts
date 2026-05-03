import { ComponentManifest } from '../../types/document'

export interface ComponentCreator {
  create: (props: any) => any
  createWithManifest: (manifest: ComponentManifest) => any
}

const componentRegistry: Map<string, ComponentCreator> = new Map()

export function registerComponent(name: string, creator: ComponentCreator): void {
  componentRegistry.set(name, creator)
}

export function getComponentCreator(name: string): ComponentCreator | undefined {
  return componentRegistry.get(name)
}

export function getComponentManifests(): ComponentManifest[] {
  return Array.from(componentRegistry.values()).map(({ create }) => {
    const manifest = create({} as any) as any as ComponentManifest
    return {
      name: manifest.name,
      metaDescription: manifest.metaDescription
    }
  })
}

// Default component creators
const defaultCreators: Record<string, any> = {}

type ComponentRegistry = {
  createComponent: (componentType: string, props: any) => any
  getManifests: () => ComponentManifest[]
  register: (name: string, creator: ComponentCreator) => void
  getComponentCreator: (name: string) => ComponentCreator | undefined
  getCreators: () => Record<string, any>
}

export function createComponentRegistry(): ComponentRegistry {
  return {
    register: registerComponent,
    getManifests: getComponentManifests,
    getComponentCreator,
    getCreators: () => defaultCreators,
    createComponent: (componentType: string, props: any) => {
      const creator = getComponentCreator(componentType)
      if (!creator) {
        console.warn(`Component ${componentType} not found, creating default`)
      }
      return creator?.create(props) || {}
    }
  }
}

export const registry = createComponentRegistry()

export const {
  createComponent,
  getManifests: getComponentManifests,
  register: registerComponent,
  getComponentCreator,
  getCreators
} = registry

export { componentRegistry }
