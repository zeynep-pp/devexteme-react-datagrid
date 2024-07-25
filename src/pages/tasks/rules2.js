import React, { Component } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import Popup from 'devextreme-react/popup';
import Form, { Item } from 'devextreme-react/form';

const data = [
  { id: 1, combinedValue: { value: 'Options1/OptionsA', text: 'Options1/OptionsA', empty: false } },
  { id: 2, combinedValue: { value: 'Options2/OptionsB', text: 'Options2/OptionsB', empty: false } },
  { id: 3, combinedValue: { value: '*', text: '*', empty: true } },
  // Diğer veriler
];

const options1 = ['Option1', 'Option2', 'Option3'];
const options2 = ['OptionA', 'OptionB', 'OptionC'];

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: data,
      selectedValue1: '',
      selectedValue2: '',
      editingRowKey: null,
      isPopupVisible: false,
      popupPosition: { my: 'left top', at: 'left bottom', of: null }
    };
  }

  handleSave = () => {
    const { selectedValue1, selectedValue2, gridData, editingRowKey } = this.state;
    const newValue = `${selectedValue1}/${selectedValue2}`;
    const updatedData = gridData.map(item => 
      item.id === editingRowKey ? { ...item, combinedValue: { value: newValue, text: newValue, empty: false } } : item
    );
    this.setState({ gridData: updatedData, isPopupVisible: false });
  };

  handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' && e.row && e.row.data) {
      this.setState({ 
        editingRowKey: e.row.data.id, 
        selectedValue1: e.row.data.combinedValue.value.split('/')[0],
        selectedValue2: e.row.data.combinedValue.value.split('/')[1],
        isPopupVisible: true,
        popupPosition: { my: 'left top', at: 'left bottom', of: e.cellElement }
      });
    }
  };

  handleRefresh = () => {
    this.setState({ gridData: data });
  };

  handleCancel = () => {
    this.setState({ isPopupVisible: false });
  };

  render() {
    const { gridData, selectedValue1, selectedValue2, isPopupVisible, popupPosition } = this.state;

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
          <Column dataField="combinedValue.text" caption="Combined Value" />
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
                <Button 
                  icon="close" 
                  onClick={this.handleCancel} 
                  style={{ position: 'absolute', top: '10px', right: '-50px', backgroundColor: 'transparent', color: '#fff' }}
                />
              </div>
            )}
          />
        )}
      </div>
    );
  }
}

export default Tasks;
