import React, { useState } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import PopupComponent from './PopupComponent'; // Ayrı bir popup bileşeni

const data = [
  { id: 1, combinedValue: 'Value1/Value2', newCombinedValue: '<1.000.000' },
  // Diğer veriler
];

const Tasks = () => {
  const [gridData, setGridData] = useState(data);
  const [popupData, setPopupData] = useState(null);
  const [options1, setOptions1] = useState(['Option1', 'Option2', 'Option3']);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' || e.column.dataField === 'newCombinedValue') {
      setPopupData({
        id: e.row.data.id,
        field: e.column.dataField,
        value: e.row.data[e.column.dataField]
      });
      setPopupVisible(true);
    }
  };

  const handleSave = (id, field, newValue) => {
    const updatedData = gridData.map(item => 
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setGridData(updatedData);
    setPopupData(null);
    setPopupVisible(false);
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

      {popupVisible && (
        <PopupComponent 
          data={popupData}
          options1={options1}
          visible={popupVisible}
          onSave={handleSave}
          onCancel={() => setPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default Tasks;
