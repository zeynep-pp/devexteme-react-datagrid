import React, { useState } from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import Form, { Item } from 'devextreme-react/form';
import Popup from 'devextreme-react/popup';

const options1 = ['Option1', 'Option2', 'Option3'];
const options2 = ['OptionA', 'OptionB', 'OptionC'];
const comparisonOptions = ['<', '=', '>'];

const PopupComponent = ({ data, onSave, onCancel }) => {
  const [selectedValue1, setSelectedValue1] = useState(data.value.split('/')[0]);
  const [selectedValue2, setSelectedValue2] = useState(data.value.split('/')[1]);
  const [selectedComparison, setSelectedComparison] = useState(data.value[0]);
  const [amount, setAmount] = useState(data.value.slice(1));

  const handleSave = () => {
    const newValue = data.field === 'combinedValue' 
      ? `${selectedValue1}/${selectedValue2}` 
      : `${selectedComparison}${amount}`;
    onSave(data.id, data.field, newValue);
  };

  return (
    <Popup 
      title="Edit Popup"
      showTitle={true} 
      visible={true} 
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
                  onValueChanged={(e) => setSelectedValue1(e.value)}
                  style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px' }}
                />
              </Item>
              <Item>
                <SelectBox
                  dataSource={options2}
                  value={selectedValue2}
                  onValueChanged={(e) => setSelectedValue2(e.value)}
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
                  onValueChanged={(e) => setSelectedComparison(e.value)}
                  style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px' }}
                />
              </Item>
              <Item>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', width: '100%' }}
                />
              </Item>
            </Item>
          )}
          <Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                text="Save" 
                onClick={handleSave} 
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
};

export default PopupComponent;
