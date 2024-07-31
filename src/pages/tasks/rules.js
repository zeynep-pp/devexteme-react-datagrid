import React, { Component } from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import Form, { Item } from 'devextreme-react/form';
import Popup from 'devextreme-react/popup';

const options2 = ['OptionA', 'OptionB', 'OptionC'];
const comparisonOptions = ['<', '=', '>'];

class PopupComponent extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      selectedValue1: data.value.split('/')[0],
      selectedValue2: data.value.split('/')[1],
      selectedComparison: data.value[0],
      amount: data.value.slice(1),
    };
  }

  handleSave = () => {
    const { data, onSave } = this.props;
    const { selectedValue1, selectedValue2, selectedComparison, amount } = this.state;
    const newValue = data.field === 'combinedValue' 
      ? `${selectedValue1}/${selectedValue2}` 
      : `${selectedComparison}${amount}`;
    onSave(data.id, data.field, newValue);
  };

  render() {
    const { options1, visible, onCancel, data } = this.props;
    const { selectedValue1, selectedValue2, selectedComparison, amount } = this.state;

    return (
      <Popup 
        title="Edit Popup"
        showTitle={true} 
        visible={visible} 
        onHiding={onCancel} 
        width={400} 
        height={200}
        showCloseButton={true}
      >
        <div style={{ backgroundColor: '#2c2c2c', color: '#fff', padding: '20px', borderRadius: '10px', fontFamily: 'Roboto' }}>
          <Form>
            {data.field === 'combinedValue' ? (
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
            ) : (
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
            )}
            <Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  text="Save" 
                  onClick={this.handleSave} 
                  style={{ backgroundColor: '#4CAF50', color: '#fff', marginRight: '10px', borderRadius: '5px' }}
                />
                <Button 
                  text="Cancel" 
                  onClick={onCancel} 
                  style={{ backgroundColor: '#f44336', color: '#fff', borderRadius: '5px' }}
                />
              </div>
            </Item>
          </Form>
        </div>
      </Popup>
    );
  }
}

export default PopupComponent;

