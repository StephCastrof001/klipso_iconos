import { WidgetDefinition } from '../store/document'

export interface ComponentManifest {
  name: string
  metaDescription: {
    icon: string
    label: { [lang: string]: string }
  }
  version: string
  componentType: string
  props?: {
    [key: string]: any
  }
  floatingControlsModel?: any[]
  contextMenuModel?: any[]
  propertyPaneModel?: {
    content: any[]
  }
  i18nPropPaths?: [string]
}

export interface AppearanceModel {
  environment: 'DESKTOP' | 'MOBILE'
  widgets: WidgetDefinition[]
}

export interface LayoutParams {
  width?: string
  height?: string
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  paddingBottom?: number
  paddingTop?: number
  paddingLeft?: number
  paddingRight?: number
  zIndex?: number
  borderRadius?: number
  shadow?: boolean
}

export interface ResponsiveControlConfig {
  desktop?: Partial<LayoutParams>
  mobile?: Partial<LayoutParams>
  tablet?: Partial<LayoutParams>
}

export interface ContextMenuModel {
  type: 'GROUP'
  propPath: string
  children: {
    type: 'CONTROL'
    name: string
    icon?: any
    shortcut?: string
    callback?: (...args: any[]) => any
  }[]
}
