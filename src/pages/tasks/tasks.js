import React, { Component } from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import PopupComponent from './PopupComponent'; // PopupComponent'i import edin

const data = [
  { id: 1, combinedValue: 'Value1/Value2', newCombinedValue: '<1.000.000', selectBoxValues: '', additionalValues: '' },
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
      isSelectBoxPopupVisible: false,
      isAdditionalValuesPopupVisible: false,
      selectBoxOptions: options1,
      selectBoxValues: [''],
      additionalValues: [''],
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

  handleSelectBoxSave = () => {
    const { selectBoxValues, gridData, editingRowKey } = this.state;
    const newSelectBoxValues = selectBoxValues.filter(value => value).join(',');
    const updatedData = gridData.map(item =>
      item.id === editingRowKey ? { ...item, selectBoxValues: newSelectBoxValues } : item
    );
    this.setState({ gridData: updatedData, isSelectBoxPopupVisible: false });
  };

  handleAdditionalValuesSave = () => {
    const { additionalValues, gridData, editingRowKey } = this.state;
    const newAdditionalValues = additionalValues.filter(value => value).join(',');
    const updatedData = gridData.map(item =>
      item.id === editingRowKey ? { ...item, additionalValues: newAdditionalValues } : item
    );
    this.setState({ gridData: updatedData, isAdditionalValuesPopupVisible: false });
  };

  handleCellClick = (e) => {
    if (e.column.dataField === 'combinedValue' && e.row && e.row.data) {
      const cellElement = e.cellElement;
      this.setState({
        editingRowKey: e.row.data.id,
        selectedValue1: e.row.data.combinedValue.split('/')[0],
        selectedValue2: e.row.data.combinedValue.split('/')[1],
        isPopupVisible: true
      });
    } else if (e.column.dataField === 'newCombinedValue' && e.row && e.row.data) {
      this.setState({
        editingRowKey: e.row.data.id,
        selectedComparison: e.row.data.newCombinedValue[0],
        amount: e.row.data.newCombinedValue.slice(1),
        isNewPopupVisible: true
      });
    } else if (e.column.dataField === 'selectBoxValues' && e.row && e.row.data) {
      this.setState({
        editingRowKey: e.row.data.id,
        selectBoxValues: e.row.data.selectBoxValues.split(',').filter(value => value),
        isSelectBoxPopupVisible: true
      });
    } else if (e.column.dataField === 'additionalValues' && e.row && e.row.data) {
      this.setState({
        editingRowKey: e.row.data.id,
        additionalValues: e.row.data.additionalValues.split(',').filter(value => value),
        isAdditionalValuesPopupVisible: true
      });
    }
  };

  handleCancel = () => {
    this.setState({
      isPopupVisible: false,
      isNewPopupVisible: false,
      isSelectBoxPopupVisible: false,
      isAdditionalValuesPopupVisible: false
    });
  };

  handleSelectBoxChange = (index, value) => {
    const newValues = [...this.state.selectBoxValues];
    newValues[index] = value;
    this.setState({ selectBoxValues: newValues });
  };

  handleAdditionalValueChange = (index, value) => {
    const newValues = [...this.state.additionalValues];
    newValues[index] = value;
    this.setState({ additionalValues: newValues });
  };

  handleAddSelectBox = () => {
    this.setState(prevState => ({
      selectBoxValues: [...prevState.selectBoxValues, '']
    }));
  };

  handleAddAdditionalValue = () => {
    this.setState(prevState => ({
      additionalValues: [...prevState.additionalValues, '']
    }));
  };

  handleRemoveSelectBoxValue = (index) => {
    this.setState(prevState => ({
      selectBoxValues: prevState.selectBoxValues.filter((_, i) => i !== index)
    }));
  };

  handleRemoveAdditionalValue = (index) => {
    this.setState(prevState => ({
      additionalValues: prevState.additionalValues.filter((_, i) => i !== index)
    }));
  };

  render() {
    const {
      gridData, 
      isPopupVisible, 
      isNewPopupVisible, 
      isSelectBoxPopupVisible, 
      isAdditionalValuesPopupVisible,
      selectBoxOptions,
      selectBoxValues,
      additionalValues,
      selectedValue1,
      selectedValue2,
      selectedComparison,
      amount
    } = this.state;

    return (
      <div>
        <DataGrid
          dataSource={gridData}
          showBorders={true}
          onCellClick={this.handleCellClick}
        >
          <Column dataField="combinedValue" />
          <Column dataField="newCombinedValue" />
          <Column dataField="selectBoxValues" />
          <Column dataField="additionalValues" />
          <Editing
            mode="cell"
            allowUpdating={true}
          />
        </DataGrid>

        <PopupComponent
          title="Edit Combined Value"
          visible={isPopupVisible}
          onHiding={this.handleCancel}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          selectedValue1={selectedValue1}
          setSelectedValue1={(value) => this.setState({ selectedValue1: value })}
          selectedValue2={selectedValue2}
          setSelectedValue2={(value) => this.setState({ selectedValue2: value })}
          selectBoxOptions={selectBoxOptions}
        />

        <PopupComponent
          title="Edit New Popup"
          visible={isNewPopupVisible}
          onHiding={this.handleCancel}
          onSave={this.handleNewSave}
          onCancel={this.handleCancel}
          selectedComparison={selectedComparison}
          setSelectedComparison={(value) => this.setState({ selectedComparison: value })}
          amount={amount}
          setAmount={(value) => this.setState({ amount: value })}
        />

        <PopupComponent
          title="Edit Select Box Popup"
          visible={isSelectBoxPopupVisible}
          onHiding={this.handleCancel}
          onSave={this.handleSelectBoxSave}
          onCancel={this.handleCancel}
          selectBoxValues={selectBoxValues}
          onSelectBoxChange={this.handleSelectBoxChange}
          addSelectBoxValue={this.handleAddSelectBox}
          onRemoveSelectBoxValue={this.handleRemoveSelectBoxValue}
          selectBoxOptions={selectBoxOptions}
        />

        <PopupComponent
          title="Edit Additional Values Popup"
          visible={isAdditionalValuesPopupVisible}
          onHiding={this.handleCancel}
          onSave={this.handleAdditionalValuesSave}
          onCancel={this.handleCancel}
          additionalValues={additionalValues}
          onAdditionalValueChange={this.handleAdditionalValueChange}
          addAdditionalValue={this.handleAddAdditionalValue}
          onRemoveAdditionalValue={this.handleRemoveAdditionalValue}
        />
      </div>
    );
  }
}

export default Tasks;
