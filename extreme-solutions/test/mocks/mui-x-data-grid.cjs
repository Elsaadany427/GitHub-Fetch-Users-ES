const React = require('react');

function DataGrid({ rows = [], columns = [] }) {
  return React.createElement(
    'div',
    { 'data-testid': 'datagrid', role: 'table' },
    rows.map((row, i) =>
      React.createElement(
        'div',
        { key: row.id ?? i, role: 'row' },
        columns.map((col, j) => {
          let content = null;
          if (col && typeof col.renderCell === 'function') {
            const params = { row, value: row[col.field] };
            content = col.renderCell(params);
          } else if (col && col.field) {
            const val = row[col.field];
            content = val == null ? '' : String(val);
          }
          return React.createElement('div', { key: col?.field || j, role: 'cell' }, content);
        })
      )
    )
  );
}

function GridToolbarFilterButton() {
  return null;
}

module.exports = { DataGrid, GridToolbarFilterButton };
