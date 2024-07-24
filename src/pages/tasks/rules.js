import React, { Component } from 'react';
import DataGrid, { Column, Editing, Popup, Form, Item } from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';

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
      selectedValue2: ''
    };
  }

  handleSave = () => {
    const { selectedValue1, selectedValue2, gridData } = this.state;
    const newValue = `${selectedValue1}/${selectedValue2}`;
    this.setState({
      gridData: [...gridData, { id: gridData.length + 1, combinedValue: newValue }]
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
        </DataGrid>
      </div>
    );
  }
}

export default App;
