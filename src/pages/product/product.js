import React, { Component } from 'react';
import { TextBox } from 'devextreme-react/text-box';
import { Button } from 'devextreme-react/button';
import { Form, Item, GroupItem, RequiredRule, EmailRule, PatternRule } from 'devextreme-react/form';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import './product.css'; // CSS dosyasını import et

const customers = [
  { customerNumber: '123', name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
  { customerNumber: '456', name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' }
];

class product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerNumber: '',
      customerData: null,
      isEditing: false,
      isFormVisible: false,
      isPopupVisible: false,
      isDarkTheme: true // Varsayılan tema koyu
    };

    this.handleCustomerNumberChange = this.handleCustomerNumberChange.bind(this);
    this.handleSearchCustomer = this.handleSearchCustomer.bind(this);
    this.handleSaveCustomer = this.handleSaveCustomer.bind(this);
    this.handleNewCustomer = this.handleNewCustomer.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  handleCustomerNumberChange(e) {
    this.setState({ customerNumber: e.value });
  }

  handleSearchCustomer() {
    const { customerNumber } = this.state;
    const customer = customers.find(c => c.customerNumber === customerNumber);
    if (customer) {
      this.setState({ customerData: customer, isEditing: true, isFormVisible: true });
    } else {
      notify('Müşteri bulunamadı. Yeni müşteri ekleyebilirsiniz.', 'error', 2000);
      this.setState({ customerData: { customerNumber }, isEditing: false, isFormVisible: true });
    }
  }

  handleSaveCustomer() {
    const { customerData, isEditing } = this.state;
    if (isEditing) {
      notify('Müşteri güncellendi.', 'success', 2000);
    } else {
      customers.push(customerData);
      notify('Müşteri eklendi.', 'success', 2000);
    }
    this.setState({ isFormVisible: false });
  }

  handleNewCustomer() {
    this.setState({ customerData: { customerNumber: '' }, isEditing: false, isFormVisible: true });
  }

  handleBack() {
    this.setState({ customerNumber: '', customerData: null, isEditing: false, isFormVisible: false });
  }

  togglePopup() {
    this.setState(prevState => ({ isPopupVisible: !prevState.isPopupVisible }));
  }

  toggleTheme() {
    this.setState(prevState => ({ isDarkTheme: !prevState.isDarkTheme }));
  }

  render() {
    const { customerNumber, customerData, isEditing, isFormVisible, isPopupVisible, isDarkTheme } = this.state;
    const themeClass = isDarkTheme ? 'dark-theme' : 'light-theme';

    return (
      <div className={`customer-form ${themeClass}`}>
        <div className="theme-toggle-container">
          <span style={{ marginRight: '10px' }}>Koyu Tema</span>
          <label className="theme-toggle">
            <input type="checkbox" checked={!isDarkTheme} onChange={this.toggleTheme} />
            <span className="slider">
              <span className="slider-icon sun">&#9728;</span>
              <span className="slider-icon moon">&#9790;</span>
            </span>
          </label>
          <span style={{ marginLeft: '10px' }}>Açık Tema</span>
        </div>
        <h2>Müşteri Formu</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <TextBox
            value={customerNumber}
            onValueChanged={this.handleCustomerNumberChange}
            placeholder="Müşteri Numarası"
            width="calc(100% - 130px)"
            style={{ color: 'var(--text-color)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', borderRadius: '4px', padding: '10px', boxSizing: 'border-box' }}
          />
          <Button
            text="Ara"
            onClick={this.handleSearchCustomer}
            type="default"
            width="120px"
            style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s', marginLeft: '10px' }}
          />
        </div>
        {isFormVisible && (
          <Form
            formData={customerData}
            onFieldDataChanged={(e) => {
              const updatedCustomerData = { ...customerData, [e.dataField]: e.value };
              this.setState({ customerData: updatedCustomerData });
            }}
          >
            <GroupItem colCount={1}>
              <Item dataField="customerNumber" editorType="dxTextBox">
                <RequiredRule message="Müşteri numarası zorunludur" />
              </Item>
              <Item dataField="name" editorType="dxTextBox">
                <RequiredRule message="İsim zorunludur" />
              </Item>
              <Item dataField="email" editorType="dxTextBox">
                <RequiredRule message="Email zorunludur" />
                <EmailRule message="Geçerli bir e-posta adresi girin" />
              </Item>
              <Item dataField="phone" editorType="dxTextBox">
                <RequiredRule message="Telefon numarası zorunludur" />
                <PatternRule pattern="^\\+?\\d{10,13}$" message="Geçerli bir telefon numarası girin" />
              </Item>
            </GroupItem>
          </Form>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            text={isEditing ? 'Güncelle' : 'Kaydet'}
            onClick={this.handleSaveCustomer}
            type="success"
            disabled={!isFormVisible}
            width="48%"
            style={{ backgroundColor: '#4caf50', color: '#fff', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s' }}
          />
          <Button
            text="Yeni Müşteri"
            onClick={this.handleNewCustomer}
            type="default"
            width="48%"
            style={{ backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s' }}
          />
        </div>
        <Button
          text="Geri Dön"
          onClick={this.handleBack}
          type="default"
          width="100%"
          style={{ backgroundColor: '#343a40', color: '#fff', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s', marginTop: '20px' }}
        />
        {isPopupVisible && (
          <Popup
            visible={isPopupVisible}
            onHiding={this.togglePopup}
            dragEnabled={true}
            closeOnOutsideClick={true}
            title="Müşteri Listesi"
            width={600}
            height={400}
          >
            <DataGrid
              dataSource={customers}
              showBorders={true}
              columnAutoWidth={true}
              paging={{ pageSize: 10 }}
              filterRow={{ visible: true }}
              headerFilter={{ visible: true }}
            >
              <Column dataField="customerNumber" />
              <Column dataField="name" />
              <Column dataField="email" />
              <Column dataField="phone" />
            </DataGrid>
          </Popup>
        )}
      </div>
    );
  }
}

export default product;
