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



/* src/components/AddButton.css */
.add-button {
  background-color: #007bff; /* Mavi renk */
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  color: white;
  font-size: 20px; /* FontAwesome ikon boyutu */
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #0056b3; /* Hover için daha koyu mavi */
}


// src/components/AddButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './AddButton.css'; // Stilinizi buraya ekleyin

const AddButton = () => {
  return (
    <button className="add-button">
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default AddButton;

/* src/components/Button.css */
.save-button {
  background-color: #28a745; /* Yeşil renk */
  border: none;
  border-radius: 4px;
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
  background-color: #218838; /* Hover sırasında daha koyu yeşil */
  transform: scale(1.05);
}

.save-button:active {
  background-color: #1e7e34; /* Tıklama sırasında daha koyu yeşil */
  transform: scale(1);
}

.cancel-button {
  background-color: #dc3545; /* Kırmızı renk */
  border: none;
  border-radius: 4px;
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cancel-button:hover {
  background-color: #c82333; /* Hover sırasında daha koyu kırmızı */
  transform: scale(1.05);
}

.cancel-button:active {
  background-color: #bd2130; /* Tıklama sırasında daha koyu kırmızı */
  transform: scale(1);
}


