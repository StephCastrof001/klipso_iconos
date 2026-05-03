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

export function createComponentRegistry(): {
  createComponent: (componentType: string, props: any) => any
  getManifests: () => ComponentManifest[]
  register: (name: string, creator: ComponentCreator) => void
} {
  return {
    register,
    getComponentManifests: () => getComponentManifests(),
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

export const {
  createComponent,
  getComponentManifests,
  getComponentCreator,
  register: registerComponent
} = createComponentRegistry()

export { componentRegistry }
