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

const VALIDATION_FIELDS = ['name', 'metaDescription'] as const
const REQUIRED_FIELDS = new Set(VALIDATION_FIELDS)

function isValidManifestShape(manifest: any): manifest is ComponentManifest {
  if (typeof manifest !== 'object' || manifest === null) {
    return false
  }

  const hasAllRequiredFields = VALIDATION_FIELDS.every(field =>
    field in manifest
  )

  if (!hasAllRequiredFields) {
    console.warn('getComponentManifests: Invalid manifest, missing required fields')
    return false
  }

  if (
    typeof manifest.name !== 'string' ||
    typeof manifest.metaDescription !== 'object' ||
    manifest.metaDescription === null
  ) {
    console.warn('getComponentManifests: Invalid manifest shape')
    return false
  }

  const { metaDescription } = manifest

  return (
    typeof metaDescription.icon === 'string' &&
    typeof metaDescription.label === 'object' &&
    metaDescription.label !== null
  )
}

export function getComponentManifests(): ComponentManifest[] {
  const manifests: ComponentManifest[] = []

  for (const { create } of componentRegistry.values()) {
    const manifest = create({} as any)

    if (isValidManifestShape(manifest)) {
      manifests.push({
        name: manifest.name,
        metaDescription: manifest.metaDescription
      })
    }
  }

  return manifests
}

// Default component creators
const defaultCreators: Record<string, any> = {}

function createDefaultManifest(componentType: string): ComponentManifest {
  return {
    name: `Sys${componentType}Component`,
    metaDescription: {
      icon: componentType,
      label: {
        en: componentType,
        es: `Componente ${componentType}`
      }
    },
    version: '1.0.0',
    componentType,
    props: {
      content: {},
      adaptiveStyles: {
        desktop: [{ element: 'host', styleAttributes: {} }],
        mobile: [{ element: 'host', styleAttributes: {} }]
      },
      responsiveControls: {},
      contextMenuModel: [],
      floatingControlsModel: [],
      propertyPaneModel: {
        content: []
      },
      i18nPropPaths: [],
      i18n: {}
    },
    floatingControlsModel: [
      {
        action: 'edit',
        icon: 'edit',
        label: 'Edit',
        enabled: true
      }
    ],
    contextMenuModel: [
      {
        type: 'GROUP',
        propPath: 'props',
        children: []
      }
    ],
    propertyPaneModel: {
      content: []
    }
  }
}

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
