import React, { Component } from 'react';
import { TextBox, SelectBox, CheckBox } from 'devextreme-react';
import { Button } from 'devextreme-react/button';
import { Form, Item, GroupItem, RequiredRule } from 'devextreme-react/form';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import { FaSun, FaMoon, FaSave, FaUserPlus, FaArrowLeft, FaSearch, FaList, FaArrowCircleRight } from 'react-icons/fa';
import './product.css'; // CSS dosyasını import et

const customers = [
  { customerNumber: '123', name: 'John Doe', taxId: '111-22-3333', registrationNo: '123456789', customerSegment: 'Retail', salesDesk: 'Desk A', customerStatus: 'Active', channelPermissions: ['Email', 'Phone'] },
  { customerNumber: '456', name: 'Jane Smith', taxId: '444-55-6666', registrationNo: '987654321', customerSegment: 'Wholesale', salesDesk: 'Desk B', customerStatus: 'Inactive', channelPermissions: ['Phone'] }
];

const customerSegments = ['Retail', 'Wholesale', 'Corporate'];
const salesDesks = ['Desk A', 'Desk B', 'Desk C'];
const customerStatuses = ['Active', 'Inactive', 'Pending'];

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerNumber: '',
      customerData: null,
      isEditing: false,
      isFormVisible: false,
      isPopupVisible: false,
      isDarkTheme: true,
      isCustomerListPopupVisible: false // Add state for the customer list popup
    };

    this.handleCustomerNumberChange = this.handleCustomerNumberChange.bind(this);
    this.handleSearchCustomer = this.handleSearchCustomer.bind(this);
    this.handleSaveCustomer = this.handleSaveCustomer.bind(this);
    this.handleNewCustomer = this.handleNewCustomer.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.toggleCustomerListPopup = this.toggleCustomerListPopup.bind(this);
    this.handleCustomerSelection = this.handleCustomerSelection.bind(this);
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
      notify('Yeni müşteri kaydedildi.', 'success', 2000);
    }
    // Here you would typically also update the customers array
  }

  handleNewCustomer() {
    this.setState({ customerNumber: '', customerData: { customerNumber: '' }, isEditing: false, isFormVisible: true });
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

  toggleCustomerListPopup() {
    this.setState(prevState => ({ isCustomerListPopupVisible: !prevState.isCustomerListPopupVisible }));
  }

  handleCustomerSelection(customerNumber) {
    const customer = customers.find(c => c.customerNumber === customerNumber);
    if (customer) {
      this.setState({ customerData: customer, isEditing: true, isFormVisible: true });
      notify(`Müşteri ${customer.name} seçildi.`, 'success', 2000);
    } else {
      notify('Müşteri bulunamadı.', 'error', 2000);
    }
  }

  renderButtonCell = (cellInfo) => {
    return (
      <div className="button-cell">
        <button
          onClick={() => this.handleCustomerSelection(cellInfo.row.data.customerNumber)}
          className="get-button"
        >
          <FaArrowCircleRight />
        </button>
      </div>
    );
  };

  render() {
    const { customerNumber, customerData, isEditing, isFormVisible, isPopupVisible, isDarkTheme, isCustomerListPopupVisible } = this.state;
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
            <GroupItem colCount={2}>
              <Item dataField="customerNumber" editorType="dxTextBox">
                <RequiredRule message="Müşteri numarası zorunludur" />
              </Item>
              <Item dataField="name" editorType="dxTextBox">
                <RequiredRule message="İsim zorunludur" />
              </Item>
              <Item dataField="taxId" editorType="dxTextBox">
                <RequiredRule message="Vergi numarası zorunludur" />
              </Item>
              <Item dataField="registrationNo" editorType="dxTextBox">
                <RequiredRule message="Ticaret numarası zorunludur" />
              </Item>
            </GroupItem>
            <GroupItem colCount={3}>
              <Item dataField="customerSegment" editorType="dxSelectBox" editorOptions={{ items: customerSegments }}>
                <RequiredRule message="Müşteri segmenti zorunludur" />
              </Item>
              <Item dataField="salesDesk" editorType="dxSelectBox" editorOptions={{ items: salesDesks }}>
                <RequiredRule message="Satış masası zorunludur" />
              </Item>
              <Item dataField="customerStatus" editorType="dxSelectBox" editorOptions={{ items: customerStatuses }}>
                <RequiredRule message="Müşteri durumu zorunludur" />
              </Item>
            </GroupItem>
            <GroupItem colCount={1}>
              <Item dataField="channelPermissions">
                <RequiredRule message="Kanal izinleri zorunludur" />
                <div className="channel-permissions">
                  <CheckBox text="E-posta" value={customerData?.channelPermissions?.includes('Email')} onValueChanged={(e) => this.setState({ customerData: { ...customerData, channelPermissions: e.value ? [...(customerData.channelPermissions || []), 'Email'] : (customerData.channelPermissions || []).filter(p => p !== 'Email') } })} />
                  <CheckBox text="Telefon" value={customerData?.channelPermissions?.includes('Phone')} onValueChanged={(e) => this.setState({ customerData: { ...customerData, channelPermissions: e.value ? [...(customerData.channelPermissions || []), 'Phone'] : (customerData.channelPermissions || []).filter(p => p !== 'Phone') } })} />
                  <CheckBox text="Posta" value={customerData?.channelPermissions?.includes('Mail')} onValueChanged={(e) => this.setState({ customerData: { ...customerData, channelPermissions: e.value ? [...(customerData.channelPermissions || []), 'Mail'] : (customerData.channelPermissions || []).filter(p => p !== 'Mail') } })} />
                </div>
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
          <Button
            onClick={this.toggleCustomerListPopup}
            className="button default"
          >
            <FaList /> Müşteri Listesi
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
              <Column dataField="taxId" />
              <Column dataField="registrationNo" />
              <Column dataField="customerSegment" />
              <Column dataField="salesDesk" />
              <Column dataField="customerStatus" />
              <Column dataField="channelPermissions" />
            </DataGrid>
          </Popup>
        )}
        {isCustomerListPopupVisible && (
          <Popup
            visible={isCustomerListPopupVisible}
            onHiding={this.toggleCustomerListPopup}
            dragEnabled={true}
            closeOnOutsideClick={true}
            title="Kaydedilen Müşteriler"
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
              <Column
                width={100}
                cellRender={this.renderButtonCell}
                caption="Seçim"
              />
              <Column dataField="customerNumber" />
              <Column dataField="name" />
              <Column dataField="taxId" />
              <Column dataField="registrationNo" />
              <Column dataField="customerSegment" />
              <Column dataField="salesDesk" />
              <Column dataField="customerStatus" />
              <Column dataField="channelPermissions" />
            </DataGrid>
          </Popup>
        )}
      </div>
    );
  }
}

export default Product;
