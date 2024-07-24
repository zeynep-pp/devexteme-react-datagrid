import React, { Component } from 'react';
import DataGrid, { Column, Editing, Popup, Form, Item } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import axios from 'axios';

const data = [
  { id: 1, combinedValue: 'Value1/Value2' },
  // Diğer veriler
];

const options1 = ['Option1', 'Option2', 'Option3'];
const options2 = ['OptionA', 'OptionB', 'OptionC'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: data,
      selectedValue1: '',
      selectedValue2: '',
      editingRowKey: null
    };
  }

  handleSave = () => {
    const { selectedValue1, selectedValue2, gridData, editingRowKey } = this.state;
    const newValue = `${selectedValue1}/${selectedValue2}`;
    const updatedData = gridData.map(item => 
      item.id === editingRowKey ? { ...item, combinedValue: newValue } : item
    );
    this.setState({ gridData: updatedData });
  };

  handleRowUpdating = (e) => {
    this.setState({ editingRowKey: e.key });
  };

  handleSaveToServer = (rowData) => {
    axios.post('/api/save', rowData)
      .then(response => {
        console.log('Data saved successfully:', response.data);
      })
      .catch(error => {
        console.error('There was an error saving the data!', error);
      });
  };

  render() {
    const { gridData, selectedValue1, selectedValue2 } = this.state;

    return (
      <div>
        <DataGrid
          dataSource={gridData}
          keyExpr="id"
          showBorders={true}
          onRowUpdating={this.handleRowUpdating}
        >
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Edit Popup" showTitle={true} width={700} height={250} />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item>
                  <SelectBox
                    dataSource={options1}
                    value={selectedValue1}
                    onValueChanged={(e) => this.setState({ selectedValue1: e.value })}
                  />
                </Item>
                <Item>
                  <SelectBox
                    dataSource={options2}
                    value={selectedValue2}
                    onValueChanged={(e) => this.setState({ selectedValue2: e.value })}
                  />
                </Item>
              </Item>
              <Item>
                <button type="button" onClick={this.handleSave}>Save</button>
              </Item>
            </Form>
          </Editing>
          <Column dataField="combinedValue" caption="Combined Value" />
          <Column
            type="buttons"
            buttons={[
              {
                text: 'Save',
                onClick: (e) => this.handleSaveToServer(e.row.data)
              }
            ]}
          />
        </DataGrid>
      </div>
    );
  }
}

export default App;
