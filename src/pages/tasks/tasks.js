import React, { Component } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import PopupComponent from './PopupComponent'; // Ayrı bir popup bileşeni

const data = [
  { id: 1, combinedValue: 'Value1/Value2', newCombinedValue: '<1.000.000' },
  // Diğer veriler
];

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: data,
      popupData: null,
      options1: ['Option1', 'Option2', 'Option3'],
      popupVisible: false,
    };
  }

  handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' || e.column.dataField === 'newCombinedValue') {
      this.setState({
        popupData: {
          id: e.row.data.id,
          field: e.column.dataField,
          value: e.row.data[e.column.dataField],
        },
        popupVisible: true,
      });
    }
  };

  handleSave = (id, field, newValue) => {
    const updatedData = this.state.gridData.map((item) =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    this.setState({
      gridData: updatedData,
      popupData: null,
      popupVisible: false,
    });
  };

  render() {
    return (
      <div>
        <Button text="Refresh" onClick={() => this.setState({ gridData: data })} />
        <DataGrid
          dataSource={this.state.gridData}
          keyExpr="id"
          showBorders={true}
          onCellClick={this.handleCellClick}
        >
          <Editing mode="cell" allowUpdating={true} allowAdding={true} allowDeleting={true} />
          <Column dataField="combinedValue" caption="Combined Value" />
          <Column dataField="newCombinedValue" caption="New Combined Value" />
        </DataGrid>

        {this.state.popupVisible && (
          <PopupComponent
            data={this.state.popupData}
            options1={this.state.options1}
            visible={this.state.popupVisible}
            onSave={this.handleSave}
            onCancel={() => this.setState({ popupVisible: false })}
          />
        )}
      </div>
    );
  }
}

export default Tasks;
