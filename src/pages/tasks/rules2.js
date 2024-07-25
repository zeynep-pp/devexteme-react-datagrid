import React, { Component } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import Popup from 'devextreme-react/popup';
import Form, { Item } from 'devextreme-react/form';

const data = [
  { id: 1, combinedValue: 'Value1/Value2', newCombinedValue: '<1.000.000' },
  // Diğer veriler
];

const options1 = ['Option1', 'Option2', 'Option3'];
const options2 = ['OptionA', 'OptionB', 'OptionC'];
const comparisonOptions = ['<', '=', '>'];

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: data,
      selectedValue1: '',
      selectedValue2: '',
      selectedComparison: '',
      amount: '',
      editingRowKey: null,
      isPopupVisible: false,
      isNewPopupVisible: false,
      popupPosition: { my: 'center', at: 'center', of: window }
    };
  }

  handleSave = () => {
    const { selectedValue1, selectedValue2, gridData, editingRowKey } = this.state;
    const newValue = `${selectedValue1}/${selectedValue2}`;
    const updatedData = gridData.map(item => 
      item.id === editingRowKey ? { ...item, combinedValue: newValue } : item
    );
    this.setState({ gridData: updatedData, isPopupVisible: false });
  };

  handleNewSave = () => {
    const { selectedComparison, amount, gridData, editingRowKey } = this.state;
    const newCombinedValue = `${selectedComparison}${amount}`;
    const updatedData = gridData.map(item => 
      item.id === editingRowKey ? { ...item, newCombinedValue: newCombinedValue } : item
    );
    this.setState({ gridData: updatedData, isNewPopupVisible: false });
  };

  handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' && e.row && e.row.data) {
      const cellElement = e.cellElement;
      const rect = cellElement.getBoundingClientRect();
      this.setState({ 
        editingRowKey: e.row.data.id, 
        selectedValue1: e.row.data.combinedValue.split('/')[0],
        selectedValue2: e.row.data.combinedValue.split('/')[1],
        isPopupVisible: true,
        popupPosition: { my: 'top', at: 'bottom', of: cellElement }
      });
    } else if (e.column.dataField === 'newCombinedValue' && e.row && e.row.data) {
      const cellElement = e.cellElement;
      const rect = cellElement.getBoundingClientRect();
      this.setState({ 
        editingRowKey: e.row.data.id, 
        selectedComparison: e.row.data.newCombinedValue[0],
        amount: e.row.data.newCombinedValue.slice(1),
        isNewPopupVisible: true,
        popupPosition: { my: 'top', at: 'bottom', of: cellElement }
      });
    }
  };

  handleRefresh = () => {
    this.setState({ gridData: data });
  };

  handleCancel = () => {
    this.setState({ isPopupVisible: false, isNewPopupVisible: false });
  };

  render() {
    const { gridData, selectedValue1, selectedValue2, selectedComparison, amount, isPopupVisible, isNewPopupVisible, popupPosition } = this.state;

    return (
      <div>
        <Button text="Refresh" onClick={this.handleRefresh} />
        <DataGrid
          dataSource={gridData}
          keyExpr="id"
          showBorders={true}
          onCellClick={this.handleCellClick}
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

        {isPopupVisible && (
          <Popup 
            title="Edit Popup"
            showTitle={true} 
            visible={isPopupVisible} 
            onHiding={() => this.setState({ isPopupVisible: false })} 
            width={400} 
            height={200}
            position={popupPosition}
            showCloseButton={true}
            contentRender={() => (
              <div style={{ backgroundColor: '#2c2c2c', color: '#fff', padding: '20px', borderRadius: '10px', fontFamily: 'Roboto', position: 'relative' }}>
                <Form>
                  <Item itemType="group" colCount={2} colSpan={2}>
                    <Item>
                      <SelectBox
                        dataSource={options1}
                        value={selectedValue1}
                        onValueChanged={(e) => this.setState({ selectedValue1: e.value })}
                        style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px' }}
                      />
                    </Item>
                    <Item>
                      <SelectBox
                        dataSource={options2}
                        value={selectedValue2}
                        onValueChanged={(e) => this.setState({ selectedValue2: e.value })}
                        style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px' }}
                      />
                    </Item>
                  </Item>
                  <Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        text="Save" 
                        onClick={this.handleSave} 
                        style={{ backgroundColor: '#4CAF50', color: '#fff', marginRight: '10px', borderRadius: '5px' }}
                      />
                      <Button 
                        text="Cancel" 
                        onClick={this.handleCancel} 
                        style={{ backgroundColor: '#f44336', color: '#fff', borderRadius: '5px' }}
                      />
                    </div>
                  </Item>
                </Form>
              </div>
            )}
          />
        )}

        {isNewPopupVisible && (
          <Popup 
            title="Edit New Popup"
            showTitle={true} 
            visible={isNewPopupVisible} 
            onHiding={() => this.setState({ isNewPopupVisible: false })} 
            width={400} 
            height={200}
            position={popupPosition}
            showCloseButton={true}
            contentRender={() => (
              <div style={{ backgroundColor: '#2c2c2c', color: '#fff', padding: '20px', borderRadius: '10px', fontFamily: 'Roboto', position: 'relative' }}>
                <Form>
                  <Item itemType="group" colCount={2} colSpan={2}>
                    <Item>
                      <SelectBox
                        dataSource={comparisonOptions}
                        value={selectedComparison}
                        onValueChanged={(e) => this.setState({ selectedComparison: e.value })}
                        style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px' }}
                      />
                    </Item>
                    <Item>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => this.setState({ amount: e.target.value })}
                        style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', width: '100%' }}
                      />
                    </Item>
                  </Item>
                  <Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        text="Save" 
                        onClick={this.handleNewSave} 
                        style={{ backgroundColor: '#4CAF50', color: '#fff', marginRight: '10px', borderRadius: '5px' }}
                      />
                      <Button 
                        text="Cancel" 
                        onClick={this.handleCancel} 
                        style={{ backgroundColor: '#f44336', color: '#fff', borderRadius: '5px' }}
                      />
                    </div>
                  </Item>
                </Form>
              </div>
            )}
          />
        )}
      </div>
    );
  }
}

export default Tasks;
