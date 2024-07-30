import React from 'react';
import Popup from 'devextreme-react/popup';
import Form, { Item } from 'devextreme-react/form';
import { SelectBox } from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';

const PopupComponent = ({ 
  title, 
  visible, 
  onHiding, 
  onSave, 
  onCancel, 
  selectBoxValues, 
  onSelectBoxChange, 
  additionalValues, 
  onAdditionalValueChange, 
  selectedValue1, 
  setSelectedValue1, 
  selectedValue2, 
  setSelectedValue2, 
  selectedComparison, 
  setSelectedComparison, 
  amount, 
  setAmount,
  selectBoxOptions,
  addSelectBoxValue,
  addAdditionalValue
}) => (
  <Popup 
    title={title}
    showTitle={true}
    visible={visible}
    onHiding={onHiding}
    width={400}
    height={400}
    showCloseButton={true}
    position={{ my: 'center', at: 'center', of: window }}
    contentRender={() => (
      <div style={{ backgroundColor: '#2c2c2c', color: '#fff', padding: '20px', borderRadius: '10px', fontFamily: 'Roboto' }}>
        <Form>
          <Item itemType="group" colCount={1} colSpan={1}>
            {title.includes('Select Box') && selectBoxValues.map((value, index) => (
              <Item key={index}>
                <SelectBox
                  dataSource={selectBoxOptions}
                  value={value}
                  onValueChanged={(e) => onSelectBoxChange(index, e.value)}
                  style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', marginBottom: '10px' }}
                />
              </Item>
            ))}
            {title.includes('Additional Values') && additionalValues.map((value, index) => (
              <Item key={index}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onAdditionalValueChange(index, e.target.value)}
                  style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', width: '100%', marginBottom: '10px' }}
                />x
              </Item>
            ))}
            {title.includes('Combined Value') && (
              <>
                <Item>
                  <SelectBox
                    dataSource={['Option1', 'Option2', 'Option3']}
                    value={selectedValue1}
                    onValueChanged={(e) => setSelectedValue1(e.value)}
                    style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', marginBottom: '10px' }}
                  />
                </Item>
                <Item>
                  <SelectBox
                    dataSource={['OptionA', 'OptionB', 'OptionC']}
                    value={selectedValue2}
                    onValueChanged={(e) => setSelectedValue2(e.value)}
                    style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', marginBottom: '10px' }}
                  />
                </Item>
              </>
            )}
            {title.includes('New Value') && (
              <>
                <Item>
                  <SelectBox
                    dataSource={['<', '=', '>']}
                    value={selectedComparison}
                    onValueChanged={(e) => setSelectedComparison(e.value)}
                    style={{ backgroundColor: '#444', color: '#fff', borderRadius: '5px', marginBottom: '10px' }}
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
              </>
            )}
            {title.includes('Select Box') && (
              <Item>
                <Button
                  text="Add SelectBox"
                  onClick={addSelectBoxValue}
                  style={{ backgroundColor: '#2196F3', color: '#fff', borderRadius: '5px', width: '100%' }}
                />
              </Item>
            )}
            {title.includes('Additional Values') && (
              <Item>
                <Button
                  text="Add Value"
                  onClick={addAdditionalValue}
                  style={{ backgroundColor: '#2196F3', color: '#fff', borderRadius: '5px', width: '100%' }}
                />
              </Item>
            )}
          </Item>
          <Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                text="Save" 
                onClick={onSave} 
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
    )}
  />
);

export default PopupComponent;
