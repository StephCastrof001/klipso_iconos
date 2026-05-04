import React, { useState } from 'react'

interface PropertyPaneProps {
  selectedElement: any
  documentModel: any
  onUpdate: (element: any, updates: any) => void
}

export const PropertyPane: React.FC<PropertyPaneProps> = ({
  selectedElement,
  documentModel,
  onUpdate
}) => {
  const [isDirty, setIsDirty] = useState(false)

  // Property groups
  const groups = [
    'SIZE',
    'MARGIN',
    'PADDING',
    'TEXT_PARAMS',
    'BACKGROUND',
    'BORDER',
    'SHADOW',
    'RADIUS',
    'Z_INDEX',
    'RESPONSIVE'
  ]

  return (
    <div className="property-pane" style={{ width: '320px', height: '100%', borderLeft: '1px solid #e0e0e0' }}>
      <div className="property-pane-header">
        <h2>{selectedElement?.name || 'Properties'}</h2>
      </div>

      <div className="property-groups">
        {groups.map(group => (
          <PropertyGroup
            key={group}
            groupName={group}
            element={selectedElement}
            documentModel={documentModel}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  )
}

const PropertyGroup: React.FC<{
  groupName: string
  element: any
  documentModel: any
  onUpdate: (element: any, updates: any) => void
}> = ({ groupName, element, documentModel, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="property-group">
      <button
        className="property-group-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '12px', cursor: 'pointer', fontWeight: 500 }}
      >
        {groupName}
      </button>

      {isOpen && <PropertyControls />}
    </div>
  )
}

const PropertyControls = () => {
  // Implement actual controls
  return null
}

export default PropertyPane
