import React, { useState } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import Popup from './PopupComponent'; // Ayrı bir popup bileşeni

const data = [
  { id: 1, combinedValue: 'Value1/Value2', newCombinedValue: '<1.000.000' },
  // Diğer veriler
];

const Tasks = () => {
  const [gridData, setGridData] = useState(data);
  const [popupData, setPopupData] = useState(null);

  const handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' || e.column.dataField === 'newCombinedValue') {
      setPopupData({
        id: e.row.data.id,
        field: e.column.dataField,
        value: e.row.data[e.column.dataField]
      });
    }
  };

  const handleSave = (id, field, newValue) => {
    const updatedData = gridData.map(item => 
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setGridData(updatedData);
    setPopupData(null);
  };

  return (
    <div>
      <Button text="Refresh" onClick={() => setGridData(data)} />
      <DataGrid
        dataSource={gridData}
        keyExpr="id"
        showBorders={true}
        onCellClick={handleCellClick}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        />
        <Column dataField="combinedValue" caption="Combined Value" />
        <Column dataField="newCombinedValue" caption="New Combined Value" />
      </DataGrid>

      {popupData && (
        <Popup 
          data={popupData}
          onSave={handleSave}
          onCancel={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
