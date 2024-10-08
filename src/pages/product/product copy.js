import React, { Component } from 'react';
import axios from 'axios';
import { TextBox, CheckBox } from 'devextreme-react';
import { Button } from 'devextreme-react/button';
import { Form, Item, GroupItem, RequiredRule } from 'devextreme-react/form';
import { DataGrid, Column, ColumnChooser, Export } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import { FaSun, FaMoon, FaSave, FaUserPlus, FaArrowLeft, FaSearch, FaList, FaArrowCircleRight, FaFileExcel } from 'react-icons/fa';
import './product.css'; // CSS dosyasını import et


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
      isCustomerListPopupVisible: false,
      permissions: [],
      selectedPermissions: [],
      customers: [], // Added to hold the list of customers
      selectedRowKey: null // Added to manage the selected row
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
    this.handleExcelExport = this.handleExcelExport.bind(this);
  }

  componentDidMount() {
    // Fetch permissions and customers on component mount
    axios.get('/api/permissions')
      .then(response => {
        this.setState({ permissions: response.data });
      })
      .catch(error => {
        console.error('Error fetching permissions:', error);
      });

    axios.get('/api/customers')
      .then(response => {
        this.setState({ customers: response.data });
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }

  handleCustomerNumberChange(e) {
    this.setState({ customerNumber: e.value });
  }

  handleSearchCustomer() {
    const { customerNumber } = this.state;
    axios.get(`/api/customers/${customerNumber}`)
      .then(response => {
        const customer = response.data;
        if (customer) {
          this.setState({ customerData: customer, isEditing: true, isFormVisible: true });
          // Fetch selected permissions
          axios.get(`/api/customers/${customerNumber}/permissions`)
            .then(permissionsResponse => {
              const selectedPermissions = permissionsResponse.data;
              this.setState({ selectedPermissions });
            })
            .catch(error => {
              console.error('Error fetching selected permissions:', error);
            });
        } else {
          notify('Müşteri bulunamadı. Yeni müşteri ekleyebilirsiniz.', 'error', 2000);
          this.setState({ customerData: { customerNumber }, isEditing: false, isFormVisible: true });
        }
      })
      .catch(error => {
        console.error('Error searching customer:', error);
        notify('Müşteri sorgulama sırasında bir hata oluştu.', 'error', 2000);
      });
  }

  handleSaveCustomer() {
    const { customerData, isEditing, selectedPermissions } = this.state;
    const permissionsToSave = selectedPermissions.map(permission => ({
      cptyId: customerData.customerNumber,
      channelCode: permission.channelCode,
      deleted: false
    }));

    if (isEditing) {
      axios.put(`/api/customers/${customerData.customerNumber}`, customerData)
        .then(() => {
          axios.put(`/api/customers/${customerData.customerNumber}/permissions`, permissionsToSave)
            .then(() => {
              notify('Müşteri ve izinler güncellendi.', 'success', 2000);
            })
            .catch(error => {
              console.error('Error updating permissions:', error);
              notify('İzinler güncellenirken bir hata oluştu.', 'error', 2000);
            });
        })
        .catch(error => {
          console.error('Error updating customer:', error);
          notify('Müşteri güncellenirken bir hata oluştu.', 'error', 2000);
        });
    } else {
      axios.post('/api/customers', customerData)
        .then(() => {
          axios.post('/api/customers/permissions', permissionsToSave)
            .then(() => {
              notify('Yeni müşteri ve izinler kaydedildi.', 'success', 2000);
            })
            .catch(error => {
              console.error('Error saving permissions:', error);
              notify('İzinler kaydedilirken bir hata oluştu.', 'error', 2000);
            });
        })
        .catch(error => {
          console.error('Error saving customer:', error);
          notify('Yeni müşteri kaydedilirken bir hata oluştu.', 'error', 2000);
        });
    }
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
    this.setState({ customerNumber }, () => {
      this.handleSearchCustomer();
      this.toggleCustomerListPopup(); // Close the popup after selection
    });
  }

  handleExcelExport() {
    this.grid.instance.exportToExcel(false);
  }

  render() {
    const { customerNumber, customerData, isEditing, isFormVisible, isPopupVisible, isDarkTheme, isCustomerListPopupVisible, permissions, selectedPermissions, customers } = this.state;
    const themeClass = isDarkTheme ? 'dark-theme' : 'light-theme';

    // Determine which permissions are checked based on selectedPermissions
    const permissionOptions = permissions.map(permission => ({
      ...permission,
      checked: selectedPermissions.some(sp => sp.channelCode === permission.code)
    }));

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
            width="calc(100% - 360px)"
            style={{ color: 'var(--text-color)', backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', borderRadius: '4px', padding: '10px', boxSizing: 'border-box' }}
          />
          <Button
            onClick={this.handleSearchCustomer}
            className="button default"
            style={{ width: '120px', marginLeft: '10px' }}
          >
            <FaSearch /> Ara
          </Button>
          <Button
            onClick={this.toggleCustomerListPopup}
            className="button default"
            style={{ width: '120px', marginLeft: '10px' }}
          >
            <FaList /> Müşteri Listesi
          </Button>
          <Button
            onClick={this.handleNewCustomer}
            className="button default"
            style={{ width: '120px', marginLeft: '10px' }}
          >
            <FaUserPlus /> Yeni Müşteri
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
                  {permissionOptions.map(permission => (
                    <CheckBox
                      key={permission.code}
                      text={permission.displayText}
                      value={permission.checked}
                      onValueChanged={(e) => {
                        const updatedPermissions = e.value
                          ? [...selectedPermissions, { cptyId: customerData.customerNumber, channelCode: permission.code, deleted: false }]
                          : selectedPermissions.filter(sp => sp.channelCode !== permission.code);
                        this.setState({ selectedPermissions: updatedPermissions });
                      }}
                    />
                  ))}
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
              ref={(ref) => { this.grid = ref; }} // Store reference to the DataGrid instance
            >
              <Column
                type="buttons"
                width={100}
                buttons={[{
                  icon: <FaArrowCircleRight />,
                  hint: 'Getir',
                  onClick: (e) => {
                    const { customerNumber } = e.row.data;
                    this.handleCustomerSelection(customerNumber);
                  },
                  cssClass: 'get-button',
                }]}
              />
              <Column dataField="customerNumber" />
              <Column dataField="name" />
              <Column dataField="taxId" />
              <Column dataField="registrationNo" />
              <Column dataField="customerSegment" />
              <Column dataField="salesDesk" />
              <Column dataField="customerStatus" />
              <Column dataField="channelPermissions" />
              <Column
                type="buttons"
                width={100}
                buttons={[{
                  icon: <FaFileExcel />,
                  hint: 'Excel’e Aktar',
                  onClick: this.handleExcelExport,
                  cssClass: 'export-button',
                }]}
              />
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
              ref={(ref) => { this.grid = ref; }} // Store reference to the DataGrid instance
              onRowClick={(e) => this.handleCustomerSelection(e.data.customerNumber)} // Handle row click
            >
              <Column
                type="buttons"
                width={100}
                buttons={[{
                  icon: <FaArrowCircleRight />,
                  hint: 'Getir',
                  onClick: (e) => {
                    const { customerNumber } = e.row.data;
                    this.handleCustomerSelection(customerNumber);
                  },
                  cssClass: 'get-button',
                }]}
              />
              <Column dataField="customerNumber" />
              <Column dataField="name" />
              <Column dataField="taxId" />
              <Column dataField="registrationNo" />
              <Column dataField="customerSegment" />
              <Column dataField="salesDesk" />
              <Column dataField="customerStatus" />
              <Column dataField="channelPermissions" />
              <Column
                type="buttons"
                width={100}
                buttons={[{
                  icon: <FaFileExcel />,
                  hint: 'Excel’e Aktar',
                  onClick: this.handleExcelExport,
                  cssClass: 'export-button',
                }]}
              />
            </DataGrid>
          </Popup>
        )}
      </div>
    );
  }
}

export default Product;
