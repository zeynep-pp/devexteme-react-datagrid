import React, { Component } from 'react';
import { TextBox } from 'devextreme-react/text-box';
import { Button } from 'devextreme-react/button';
import { Form, Item, GroupItem, RequiredRule, EmailRule, PatternRule } from 'devextreme-react/form';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import { FaSun, FaMoon, FaSave, FaUserPlus, FaArrowLeft, FaSearch } from 'react-icons/fa'; // FontAwesome ikonları
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
          <label className="theme-toggle">
            <input type="checkbox" checked={!isDarkTheme} onChange={this.toggleTheme} />
            <span className="slider">
              <FaSun className="slider-icon sun" />
              <FaMoon className="slider-icon moon" />
            </span>
          </label>
        </div>
        <h2>Müşteri Formu</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <TextBox
            value={customerNumber}
            onValueChanged={this.handleCustomerNumberChange}
            placeholder="Müşteri Numarası"
            width="calc(100% - 130px)"
            style={{ color: 'var(--text-color)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', borderRadius: '4px', padding: '10px', boxSizing: 'border-box' }}
          />
          <Button
            onClick={this.handleSearchCustomer}
            className="button default"
            style={{ width: '120px', marginLeft: '10px' }}
          >
            <FaSearch /> Ara
          </Button>
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
                <PatternRule pattern="^\\d{3}-\\d{3}-\\d{4}$" message="Telefon numarası geçerli değil" />
              </Item>
            </GroupItem>
          </Form>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            onClick={this.handleSaveCustomer}
            className="button success"
          >
            <FaSave /> {isEditing ? 'Güncelle' : 'Kaydet'}
          </Button>
          <Button
            onClick={this.handleNewCustomer}
            className="button default"
          >
            <FaUserPlus /> Yeni Müşteri
          </Button>
        </div>
        <Button
          onClick={this.handleBack}
          className="button default"
          style={{ width: '100%', marginTop: '20px' }}
        >
          <FaArrowLeft /> Geri Dön
        </Button>
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
