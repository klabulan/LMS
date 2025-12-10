// B3 LMS ER Viewer - Main Application
// vis.js Network for ER diagram and Status transitions

let erNetwork = null;
let statusNetwork = null;
let selectedEntity = null;
let selectedTransition = null;
let erNodes = null;
let erEdges = null;
let statusNodes = null;
let statusEdges = null;

// Group labels for legend
const groupLabels = {
    template: 'Шаблоны',
    instance: 'Экземпляры',
    user: 'Пользователи',
    process: 'Процессы',
    support: 'Поддержка'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initLegend();
    initERGraph();
    initResizeHandle();
});

// Initialize interactive legend with dropdowns
function initLegend() {
    const legendContainer = document.getElementById('legend');

    // Group entities by their group
    const groups = {};
    entities.forEach(entity => {
        if (!groups[entity.group]) {
            groups[entity.group] = [];
        }
        groups[entity.group].push(entity);
    });

    // Create dropdown for each group
    const groupOrder = ['template', 'instance', 'user', 'process', 'support'];

    groupOrder.forEach(groupId => {
        if (!groups[groupId]) return;

        const dropdown = document.createElement('div');
        dropdown.className = 'legend-dropdown';

        // Header item
        const header = document.createElement('span');
        header.className = `legend-item ${groupId}`;
        header.textContent = groupLabels[groupId];
        dropdown.appendChild(header);

        // Dropdown menu
        const menu = document.createElement('div');
        menu.className = 'legend-menu';

        groups[groupId].forEach(entity => {
            const item = document.createElement('div');
            item.className = `legend-menu-item ${groupId}`;
            item.textContent = entity.label.split('\n')[0];
            item.dataset.entityId = entity.id;

            // Hover - highlight on graph
            item.addEventListener('mouseenter', () => {
                if (erNetwork) {
                    erNetwork.selectNodes([entity.id]);
                    highlightConnectedEdges(entity.id);
                }
            });

            // Mouse leave - deselect only if not clicked
            item.addEventListener('mouseleave', () => {
                if (selectedEntity?.id !== entity.id && erNetwork) {
                    erNetwork.unselectAll();
                    resetEdgeHighlights();
                    // Restore previous selection if any
                    if (selectedEntity) {
                        erNetwork.selectNodes([selectedEntity.id]);
                        highlightConnectedEdges(selectedEntity.id);
                    }
                }
            });

            // Click - select permanently
            item.addEventListener('click', () => {
                if (erNetwork) {
                    erNetwork.selectNodes([entity.id]);
                    selectEntity(entity.id);
                    highlightConnectedEdges(entity.id);
                    // Center on node without changing zoom
                    const currentScale = erNetwork.getScale();
                    erNetwork.focus(entity.id, {
                        scale: currentScale,
                        animation: { duration: 300 }
                    });
                    // Update menu item styling
                    updateLegendSelection(entity.id);
                }
            });

            menu.appendChild(item);
        });

        dropdown.appendChild(menu);
        legendContainer.appendChild(dropdown);
    });
}

// Update legend selection styling
function updateLegendSelection(entityId) {
    document.querySelectorAll('.legend-menu-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.entityId === entityId);
    });
}

// Initialize ER Graph with free movement after initial layout
function initERGraph() {
    const container = document.getElementById('er-graph');

    // Define initial positions for entities (will be used as starting points)
    const positionMap = {
        // Row 0: Users
        'user': { x: -200, y: 0 },
        'student': { x: 200, y: 0 },
        // Row 1: Templates
        'course_template': { x: -400, y: 150 },
        'assignment_template': { x: 0, y: 150 },
        'certificate_template': { x: 400, y: 150 },
        // Row 2: Schedules
        'launch_schedule': { x: -500, y: 300 },
        'assignment_schedule': { x: 100, y: 300 },
        // Row 3: Instances
        'course_instance': { x: -300, y: 350 },
        // Row 4: Enrollment
        'enrollment': { x: -100, y: 500 },
        // Row 5: Assignment/Dialog/Certificate Instances
        'assignment_instance': { x: -300, y: 650 },
        'dialog': { x: 100, y: 650 },
        'certificate_instance': { x: 400, y: 500 },
        // Row 6: Messages and Notifications
        'message': { x: 100, y: 800 },
        'notification': { x: 400, y: 0 }
    };

    // Create nodes from entities with initial positions
    erNodes = new vis.DataSet(entities.map(entity => ({
        id: entity.id,
        label: entity.label,
        group: entity.group,
        x: positionMap[entity.id]?.x || 0,
        y: positionMap[entity.id]?.y || 0,
        shape: 'box',
        font: {
            multi: 'html',
            size: 12,
            face: 'Arial'
        },
        margin: 12,
        widthConstraint: { minimum: 130, maximum: 160 }
    })));

    // Create edges from relations
    erEdges = new vis.DataSet(relations.map((rel, index) => ({
        id: index,
        from: rel.from,
        to: rel.to,
        label: rel.label,
        font: {
            size: 10,
            color: '#666',
            strokeWidth: 0,
            background: 'rgba(255,255,255,0.8)'
        },
        arrows: {
            to: { enabled: true, scaleFactor: 0.6, type: 'arrow' }
        },
        color: {
            color: '#999',
            highlight: '#1a237e',
            hover: '#666'
        },
        smooth: {
            enabled: true,
            type: 'curvedCW',
            roundness: 0.15
        },
        width: 1.5,
        hoverWidth: 2.5
    })));

    // Network options - physics disabled for manual positioning, free drag enabled
    const options = {
        groups: {
            template: {
                color: groupColors.template,
                font: { color: '#2E7D32' }
            },
            instance: {
                color: groupColors.instance,
                font: { color: '#1565C0' }
            },
            user: {
                color: groupColors.user,
                font: { color: '#6A1B9A' }
            },
            process: {
                color: groupColors.process,
                font: { color: '#E65100' }
            },
            support: {
                color: groupColors.support,
                font: { color: '#37474F' }
            }
        },
        layout: {
            hierarchical: false  // Disable hierarchical - use manual positions
        },
        physics: {
            enabled: false  // No physics - free positioning
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            zoomView: true,
            dragView: true,
            dragNodes: true,  // Free drag in all directions
            selectConnectedEdges: false
        },
        edges: {
            smooth: {
                enabled: true,
                type: 'curvedCW',
                roundness: 0.15
            }
        }
    };

    // Create network
    erNetwork = new vis.Network(container, { nodes: erNodes, edges: erEdges }, options);

    // Handle node selection
    erNetwork.on('selectNode', (params) => {
        if (params.nodes.length > 0) {
            const entityId = params.nodes[0];
            selectEntity(entityId);
            highlightConnectedEdges(entityId);
        }
    });

    // Handle deselection
    erNetwork.on('deselectNode', () => {
        clearSelection();
        resetEdgeHighlights();
    });

    // Handle click on background
    erNetwork.on('click', (params) => {
        if (params.nodes.length === 0 && params.edges.length === 0) {
            clearSelection();
            resetEdgeHighlights();
        }
    });

    // Fit to view on load
    setTimeout(() => {
        erNetwork.fit({ animation: { duration: 500 } });
    }, 100);
}

// Highlight connected edges when node is selected
function highlightConnectedEdges(nodeId) {
    if (!erEdges) return;

    const allEdges = erEdges.get();
    const updates = allEdges.map(edge => {
        const isConnected = edge.from === nodeId || edge.to === nodeId;
        return {
            id: edge.id,
            color: isConnected
                ? { color: '#1a237e', highlight: '#1a237e', hover: '#1a237e' }
                : { color: '#ddd', highlight: '#1a237e', hover: '#999' },
            width: isConnected ? 3 : 1,
            font: {
                ...edge.font,
                color: isConnected ? '#1a237e' : '#bbb'
            }
        };
    });
    erEdges.update(updates);
}

// Reset edge highlights
function resetEdgeHighlights() {
    if (!erEdges) return;

    const allEdges = erEdges.get();
    const updates = allEdges.map(edge => ({
        id: edge.id,
        color: { color: '#999', highlight: '#1a237e', hover: '#666' },
        width: 1.5,
        font: {
            size: 10,
            color: '#666',
            strokeWidth: 0,
            background: 'rgba(255,255,255,0.8)'
        }
    }));
    erEdges.update(updates);
}

// Initialize resize handle
function initResizeHandle() {
    const handle = document.getElementById('resize-handle');
    const topSection = document.querySelector('.top-section');
    const bottomSection = document.querySelector('.bottom-section');

    let isResizing = false;
    let startY = 0;
    let startTopHeight = 0;
    let startBottomHeight = 0;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startTopHeight = topSection.offsetHeight;
        startBottomHeight = bottomSection.offsetHeight;
        document.body.classList.add('resizing');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaY = e.clientY - startY;
        const newTopHeight = startTopHeight + deltaY;
        const newBottomHeight = startBottomHeight - deltaY;

        // Minimum heights
        const minTop = 200;
        const minBottom = 150;

        if (newTopHeight >= minTop && newBottomHeight >= minBottom) {
            topSection.style.flex = 'none';
            topSection.style.height = newTopHeight + 'px';
            bottomSection.style.height = newBottomHeight + 'px';

            // Trigger resize on networks
            if (erNetwork) erNetwork.redraw();
            if (statusNetwork) statusNetwork.redraw();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.classList.remove('resizing');
            // Fit graphs to new container size
            if (erNetwork) erNetwork.fit({ animation: { duration: 200 } });
            if (statusNetwork) statusNetwork.fit({ animation: { duration: 200 } });
        }
    });
}

// Select entity and update panels
function selectEntity(entityId) {
    selectedEntity = entities.find(e => e.id === entityId);
    if (!selectedEntity) return;

    updateAttributesPanel(selectedEntity);
    updateStatusDiagram(selectedEntity);
    clearTransitionPanel();
    updateLegendSelection(entityId);
}

// Clear selection
function clearSelection() {
    selectedEntity = null;
    selectedTransition = null;
    document.getElementById('entity-info').innerHTML = `
        <div class="placeholder">
            <p>Выберите сущность на графе</p>
            <p class="hint">Клик на узел покажет атрибуты и статусы</p>
        </div>
    `;
    document.getElementById('status-title').textContent = 'Диаграмма переходов статусов';
    document.getElementById('status-graph').innerHTML = `
        <div class="no-statuses">Выберите сущность для просмотра статусов</div>
    `;
    clearTransitionPanel();
    updateLegendSelection(null);
    if (statusNetwork) {
        statusNetwork.destroy();
        statusNetwork = null;
    }
}

// Clear transition panel
function clearTransitionPanel() {
    document.getElementById('transition-panel').innerHTML = `
        <div class="placeholder">
            <p>Выберите переход</p>
            <p class="hint">Клик на стрелку покажет детали перехода</p>
        </div>
    `;
}

// Update attributes panel
function updateAttributesPanel(entity) {
    const entityRelations = relations.filter(r => r.from === entity.id || r.to === entity.id);

    let html = `
        <div class="entity-header">
            <h2>${entity.label.replace('\n', ' / ')}</h2>
            <div class="entity-id">${entity.id}</div>
        </div>

        <div class="section-title">Атрибуты (${entity.attributes.length})</div>
        <table class="attributes-table">
            <thead>
                <tr>
                    <th>Поле</th>
                    <th>Тип</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${entity.attributes.map(attr => `
                    <tr title="${attr.desc}">
                        <td class="field-name">${attr.name}</td>
                        <td class="field-type">${attr.type}</td>
                        <td>${attr.required ? '<span class="required">*</span>' : ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Add relations section
    if (entityRelations.length > 0) {
        html += `
            <div class="section-title">Связи (${entityRelations.length})</div>
            <ul class="relations-list">
                ${entityRelations.map(rel => {
                    const isFrom = rel.from === entity.id;
                    const targetId = isFrom ? rel.to : rel.from;
                    const target = entities.find(e => e.id === targetId);
                    const direction = isFrom ? '→' : '←';
                    return `
                        <li>
                            <span class="relation-type">${rel.label}</span>
                            <span class="relation-target">${direction} ${target ? target.label.split('\n')[0] : targetId}</span>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    // Add statuses section (summary)
    if (entity.statuses.length > 0) {
        html += `
            <div class="section-title">Статусы (${entity.statuses.length})</div>
            <ul class="relations-list">
                ${entity.statuses.map(status => `
                    <li title="${status.desc}">
                        <span class="relation-type" style="background: ${status.color}20; color: ${status.color}; border: 1px solid ${status.color}">${status.label}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    document.getElementById('entity-info').innerHTML = html;
}

// Update status diagram with free movement
function updateStatusDiagram(entity) {
    const container = document.getElementById('status-graph');
    const titleEl = document.getElementById('status-title');

    titleEl.textContent = `Статусы: ${entity.label.split('\n')[0]}`;

    if (entity.statuses.length === 0) {
        container.innerHTML = `<div class="no-statuses">Эта сущность не имеет статусной модели</div>`;
        clearTransitionPanel();
        if (statusNetwork) {
            statusNetwork.destroy();
            statusNetwork = null;
        }
        statusNodes = null;
        statusEdges = null;
        return;
    }

    container.innerHTML = '';

    // Calculate initial positions - horizontal layout with spacing
    const statusCount = entity.statuses.length;
    const spacing = 180;
    const startX = -(statusCount - 1) * spacing / 2;

    // Create nodes for statuses with initial positions
    statusNodes = new vis.DataSet(entity.statuses.map((status, index) => ({
        id: status.id,
        label: status.label,
        x: startX + index * spacing,
        y: 0,
        color: {
            background: status.color + '30',
            border: status.color,
            highlight: {
                background: status.color + '50',
                border: status.color
            }
        },
        font: {
            color: status.color,
            size: 13,
            face: 'Arial',
            bold: true
        },
        shape: 'box',
        margin: 10,
        title: status.desc,
        borderWidth: 2,
        originalColor: status.color
    })));

    // Count edges between same pair of nodes
    const edgeCounts = {};
    entity.transitions.forEach(trans => {
        const key = [trans.from, trans.to].sort().join('|');
        edgeCounts[key] = (edgeCounts[key] || 0) + 1;
    });

    const edgeIndexes = {};

    // Create edges for transitions
    statusEdges = new vis.DataSet(entity.transitions.map((trans, index) => {
        const key = [trans.from, trans.to].sort().join('|');
        const totalBetweenPair = edgeCounts[key];

        // Track index for this pair
        if (!edgeIndexes[key]) edgeIndexes[key] = 0;
        const pairIndex = edgeIndexes[key]++;

        // Determine curve direction based on status order (left-to-right vs right-to-left)
        // Get status indexes to determine visual direction
        const fromIndex = entity.statuses.findIndex(s => s.id === trans.from);
        const toIndex = entity.statuses.findIndex(s => s.id === trans.to);
        const isLeftToRight = fromIndex < toIndex;

        // Left-to-right goes above, right-to-left goes below
        const curveType = 'curvedCW';
        const roundness = isLeftToRight ? 0.3 : -1.6;

        return {
            id: index,
            from: trans.from,
            to: trans.to,
            label: trans.label,
            font: {
                size: 10,
                color: '#555',
                strokeWidth: 0,
                align: 'horizontal',
                background: 'rgba(255,255,255,0.9)'
            },
            arrows: {
                to: { enabled: true, scaleFactor: 0.8, type: 'arrow' }
            },
            color: {
                color: '#888',
                highlight: '#1a237e',
                hover: '#555'
            },
            smooth: {
                enabled: true,
                type: curveType,
                roundness: roundness
            },
            width: 2,
            hoverWidth: 3,
            title: `Инициатор: ${trans.initiator}`,
            transitionData: trans
        };
    }));

    // Network options - free movement enabled
    const options = {
        layout: {
            hierarchical: false  // Disable hierarchical - use initial positions
        },
        physics: {
            enabled: false  // No physics - free positioning
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            zoomView: true,
            dragView: true,
            dragNodes: true,  // Free drag in all directions
            selectConnectedEdges: false
        }
    };

    // Create status network
    if (statusNetwork) {
        statusNetwork.destroy();
    }
    statusNetwork = new vis.Network(container, { nodes: statusNodes, edges: statusEdges }, options);

    // Handle node selection for highlighting edges
    statusNetwork.on('selectNode', (params) => {
        if (params.nodes.length > 0) {
            const statusId = params.nodes[0];
            highlightStatusEdges(statusId, entity);
        }
    });

    // Handle edge selection for transition details
    statusNetwork.on('selectEdge', (params) => {
        if (params.edges.length > 0) {
            const edgeId = params.edges[0];
            const edge = statusEdges.get(edgeId);
            if (edge && edge.transitionData) {
                showTransitionDetails(edge.transitionData, entity);
                highlightSelectedEdge(edgeId);
            }
        }
    });

    // Handle deselection
    statusNetwork.on('deselectNode', () => {
        resetStatusEdgeHighlights(entity);
    });

    statusNetwork.on('deselectEdge', () => {
        clearTransitionPanel();
        resetStatusEdgeHighlights(entity);
    });

    // Handle click on background
    statusNetwork.on('click', (params) => {
        if (params.edges.length === 0 && params.nodes.length === 0) {
            clearTransitionPanel();
            resetStatusEdgeHighlights(entity);
        }
    });

    // Fit diagram
    setTimeout(() => {
        statusNetwork.fit({ animation: { duration: 300 } });
    }, 100);
}

// Highlight edges connected to selected status node
function highlightStatusEdges(statusId, entity) {
    if (!statusEdges) return;

    const allEdges = statusEdges.get();
    const updates = allEdges.map(edge => {
        const isConnected = edge.from === statusId || edge.to === statusId;
        return {
            id: edge.id,
            color: isConnected
                ? { color: '#1a237e', highlight: '#1a237e', hover: '#1a237e' }
                : { color: '#ddd', highlight: '#1a237e', hover: '#888' },
            width: isConnected ? 3 : 1.5,
            font: {
                ...edge.font,
                color: isConnected ? '#1a237e' : '#bbb'
            }
        };
    });
    statusEdges.update(updates);
}

// Highlight selected edge
function highlightSelectedEdge(edgeId) {
    if (!statusEdges) return;

    const allEdges = statusEdges.get();
    const updates = allEdges.map(edge => {
        const isSelected = edge.id === edgeId;
        return {
            id: edge.id,
            color: isSelected
                ? { color: '#1a237e', highlight: '#1a237e', hover: '#1a237e' }
                : { color: '#ccc', highlight: '#1a237e', hover: '#888' },
            width: isSelected ? 4 : 1.5,
            font: {
                ...edge.font,
                color: isSelected ? '#1a237e' : '#aaa'
            }
        };
    });
    statusEdges.update(updates);
}

// Reset status edge highlights
function resetStatusEdgeHighlights(entity) {
    if (!statusEdges) return;

    const allEdges = statusEdges.get();
    const updates = allEdges.map(edge => ({
        id: edge.id,
        color: { color: '#888', highlight: '#1a237e', hover: '#555' },
        width: 2,
        font: {
            size: 10,
            color: '#555',
            strokeWidth: 0,
            align: 'horizontal',
            background: 'rgba(255,255,255,0.9)'
        }
    }));
    statusEdges.update(updates);
}

// Show transition details in panel - full information from section 5
function showTransitionDetails(transition, entity) {
    const panel = document.getElementById('transition-panel');

    // Find from and to statuses
    const fromStatus = entity.statuses.find(s => s.id === transition.from);
    const toStatus = entity.statuses.find(s => s.id === transition.to);

    let html = `
        <div class="transition-header">
            <h4>${transition.label}</h4>
        </div>

        <div class="transition-arrow">
            <span class="status-badge" style="background: ${fromStatus?.color || '#999'}30; color: ${fromStatus?.color || '#999'}; border: 1px solid ${fromStatus?.color || '#999'}">
                ${fromStatus?.label || transition.from}
            </span>
            <span class="arrow">→</span>
            <span class="status-badge" style="background: ${toStatus?.color || '#999'}30; color: ${toStatus?.color || '#999'}; border: 1px solid ${toStatus?.color || '#999'}">
                ${toStatus?.label || transition.to}
            </span>
        </div>
    `;

    // Initiator
    html += `
        <div class="transition-detail">
            <div class="label">Инициатор</div>
            <div class="value">${transition.initiator}</div>
        </div>
    `;

    // Trigger
    if (transition.trigger) {
        html += `
            <div class="transition-detail">
                <div class="label">Триггер</div>
                <div class="value">${transition.trigger}</div>
            </div>
        `;
    }

    // Conditions
    if (transition.conditions) {
        html += `
            <div class="transition-detail">
                <div class="label">Условия</div>
                <div class="value">${transition.conditions}</div>
            </div>
        `;
    }

    // Validation
    if (transition.validation) {
        html += `
            <div class="transition-detail">
                <div class="label">Валидация</div>
                <div class="value">${transition.validation}</div>
            </div>
        `;
    }

    // Visibility changes
    if (transition.visibility) {
        html += `
            <div class="transition-detail">
                <div class="label">Видимость</div>
                <div class="value">${transition.visibility}</div>
            </div>
        `;
    }

    // Access changes
    if (transition.access) {
        html += `
            <div class="transition-detail">
                <div class="label">Доступ</div>
                <div class="value">${transition.access}</div>
            </div>
        `;
    }

    // Child objects
    if (transition.childObjects) {
        html += `
            <div class="transition-detail">
                <div class="label">Дочерние объекты</div>
                <div class="value">${transition.childObjects}</div>
            </div>
        `;
    }

    // Notifications
    if (transition.notifications) {
        html += `
            <div class="transition-detail">
                <div class="label">Уведомления</div>
                <div class="value">${transition.notifications}</div>
            </div>
        `;
    }

    // Updated fields
    if (transition.updatedFields) {
        html += `
            <div class="transition-detail">
                <div class="label">Обновляемые поля</div>
                <div class="value">${transition.updatedFields}</div>
            </div>
        `;
    }

    // Parent object updates
    if (transition.parentUpdates) {
        html += `
            <div class="transition-detail">
                <div class="label">Обновление родительских объектов</div>
                <div class="value">${transition.parentUpdates}</div>
            </div>
        `;
    }

    // Actions summary
    if (transition.actions) {
        html += `
            <div class="transition-detail">
                <div class="label">Действия при переходе</div>
                <div class="value">${transition.actions}</div>
            </div>
        `;
    }

    // Notes
    if (transition.notes) {
        html += `
            <div class="transition-detail note">
                <div class="label">Примечание</div>
                <div class="value">${transition.notes}</div>
            </div>
        `;
    }

    panel.innerHTML = html;
}
