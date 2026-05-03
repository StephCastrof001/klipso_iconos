import React from 'react'

interface WidgetDefinition {
  id: string
  type: string
  componentType: string
  manifestName: string
  props: any
  layout: Partial<any>
  index: number
  parentId: string | null
  children: WidgetDefinition[]
  isActive: boolean
  hasError: boolean
  errorMessages: string[]
  canBeMoved: boolean
}

interface DocumentState {
  widgetTree: WidgetDefinition[]
  selectedWidgetId: string | null
  documentModel: any
  appearances: { [env: string]: any }[]
  errors: any[]
  isSaving: boolean
  saveSuccess: boolean
  isSavingSuccess: boolean
  isPublishing: boolean
}

interface Actions {
  setSelected: (id: string | null) => void
  setWidget: (widgetId: string, updates: any) => void
  addRootWidget: (widget: WidgetDefinition) => void
  moveWidgetUp: (widgetId: string) => void
  moveWidgetDown: (widgetId: string) => void
  addChildWidget: (parentId: string, newWidget: WidgetDefinition) => void
  copyWidget: (widgetId: string, targetId: string | null) => void
  removeWidget: (widgetId: string) => void
  clearErrors: () => void
  setSaving: (isSaving: boolean) => void
  setSavingSuccess: (isSaving: boolean) => void
  setPublishing: (isPublishing: boolean) => void
  setDocumentModel: (model: any) => void
}

interface DocumentStoreConfig {
  initialDocument?: any
  onSave: (model: any) => Promise<void>
}

const documentState = {
  widgetTree: [] as WidgetDefinition[],
  selectedWidgetId: null as string | null,
  documentModel: {},
  appearances: []
}

let actionsRef = { ...actions }

function createActions() {
  return {
    setSelected: (id: string | null) => {
      actionsRef.selectedWidgetId = id
      documentState.selectedWidgetId = id
    },
    setWidget: (widgetId: string, updates: any) => {
      if (!documentState.widgetTree.length) return
    },
    addRootWidget: (widget: WidgetDefinition) => {
      documentState.widgetTree.push({ ...widget, index: 0 })
    },
    moveWidgetUp: (widgetId: string) => {
      if (!documentState.widgetTree.length) return
    },
    moveWidgetDown: (widgetId: string) => {
      if (!documentState.widgetTree.length) return
    },
    addChildWidget: (parentId: string, newWidget: WidgetDefinition) => {
      if (!documentState.widgetTree.length) return
    },
    copyWidget: (widgetId: string, targetId: string | null) => {
      if (!documentState.widgetTree.length) return
    },
    removeWidget: (widgetId: string) => {
      if (!documentState.widgetTree.length) return
    },
    clearErrors: () => {
      documentState.errors = []
    },
    setSaving: (isSaving: boolean) => {
      documentState.isSaving = isSaving
    },
    setSavingSuccess: (isSaving: boolean) => {
      documentState.isSavingSuccess = isSaving
    },
    setPublishing: (isPublishing: boolean) => {
      documentState.isPublishing = isPublishing
    },
    setDocumentModel: (model: any) => {
      documentState.documentModel = model
    }
  }
}

const actions = createActions()

const subscribe = (callback: (state: DocumentState) => any) => {
  return () => {}
}

export function createDocumentStore(config?: DocumentStoreConfig): {
  state: DocumentState
  actions: Actions
  subscribe: (callback: (state: DocumentState) => any) => () => void
} {
  return {
    state: documentState,
    actions,
    subscribe
  }
}

export { actions }

export default createDocumentStore
