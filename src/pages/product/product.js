import React, { Component } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import Toast from 'devextreme-react/toast';
import 'devextreme/dist/css/dx.light.css';
import './product.css'; // CSS dosyasını import et

// Fiyat bucket seçenekleri
const priceBucketsOptions = [
  { id: 1, code: 'Bucket_1', displayText: 'Bucket 1', segment: 'Segment 1', salesDesk: 'Sales Desk 1' },
  { id: 2, code: 'Bucket_2', displayText: 'Bucket 2', segment: 'Segment 2', salesDesk: 'Sales Desk 2' },
];

// Müşteri verileri
const customers = [
  { id: 1, name: 'Customer 1', segment: 'Segment 1', salesDesk: 'Sales Desk 1' },
  { id: 2, name: 'Customer 2', segment: 'Segment 2', salesDesk: 'Sales Desk 2' },
];

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counterparties: [
        { id: 1, name: 'Counterparty 1', code: 'Code_1', description: 'Description 1', items: [] },
        { id: 2, name: 'Counterparty 2', code: 'Code_2', description: 'Description 2', items: [] },
        { id: 3, name: 'Counterparty 3', code: 'Code_3', description: 'Description 3', items: [] }
      ],
      priceBucketsOptions,
      customers,
      selectedCounterparty: null,
      showModal: false,
      selectedCptyType: 'PriceBucket', // Default to PriceBucket
      selectedPriceBucketId: null,
      selectedCustomerId: null,
      customerIdSearch: '',
      customerName: '', // Display selected customer name
      toastMessage: '',
      showToast: false,
      toastType: '', // 'success' or 'error'
      showDetailsFor: null, // Track which row's details to show
      showConfirmModal: false, // Track confirm modal visibility for details addition
      itemToAdd: null, // Item to be added after confirmation
    };
  }

  handleAddItem = (counterpartyId, item) => {
    this.setState(prevState => {
      const updatedCounterparties = prevState.counterparties.map(counterparty => {
        if (counterparty.id === counterpartyId) {
          return {
            ...counterparty,
            items: [...(counterparty.items || []), item],
          };
        }
        return counterparty;
      });
      return { counterparties: updatedCounterparties };
    }, () => {
      // Automatically show details after adding an item
      this.setState({ showDetailsFor: counterpartyId });
    });
  };

  handleDeleteItem = (counterpartyId, itemId) => {
    this.setState(prevState => {
      const updatedCounterparties = prevState.counterparties.map(counterparty => {
        if (counterparty.id === counterpartyId) {
          return {
            ...counterparty,
            items: (counterparty.items || []).filter(item => item.id !== itemId),
          };
        }
        return counterparty;
      });
      return { counterparties: updatedCounterparties };
    });
  };

  handleAddDetails = () => {
    const { selectedCounterparty, selectedCptyType, selectedPriceBucketId, selectedCustomerId } = this.state;
    if (!selectedCounterparty) return;

    if (selectedCptyType === 'PriceBucket') {
      const bucket = this.state.priceBucketsOptions.find(b => b.id === selectedPriceBucketId);
      if (bucket) {
        this.setState({
          showConfirmModal: true,
          itemToAdd: {
            id: Date.now(),
            cptyType: 'PriceBucket',
            name: bucket.code,
            segment: bucket.segment,
            salesDesk: bucket.salesDesk,
            sourceId: bucket.id,
          }
        });
      }
    } else if (selectedCptyType === 'Customer') {
      const customer = this.state.customers.find(c => c.id === selectedCustomerId);
      if (customer) {
        this.setState({
          showConfirmModal: true,
          itemToAdd: {
            id: Date.now(),
            cptyType: 'Customer',
            name: customer.name,
            segment: customer.segment,
            salesDesk: customer.salesDesk,
            sourceId: customer.id,
          }
        });
      }
    }
  };

  openModal = (counterparty) => {
    this.setState({
      selectedCounterparty: counterparty,
      showModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      selectedCounterparty: null,
      selectedCptyType: 'PriceBucket', // Reset to default
      selectedPriceBucketId: null,
      selectedCustomerId: null,
      customerIdSearch: '',
      customerName: '',
    });
  };

  handleCptyTypeChange = (e) => {
    this.setState({ selectedCptyType: e.value });
  };

  handlePriceBucketSelect = (e) => {
    this.setState({ selectedPriceBucketId: e.value });
  };

  handleCustomerSearch = (e) => {
    const customerId = parseInt(e.value, 10);
    this.setState({ customerIdSearch: e.value });

    if (Number.isInteger(customerId)) {
      const customer = this.state.customers.find(c => c.id === customerId);
      if (customer) {
        this.setState({
          selectedCustomerId: customer.id,
          customerName: customer.name
        });
        this.showToast(`Customer found: ${customer.name}`, 'success');
      } else {
        this.setState({
          selectedCustomerId: null,
          customerName: ''
        });
        this.showToast("Customer not found.", 'error');
      }
    } else {
      this.setState({
        selectedCustomerId: null,
        customerName: ''
      });
    }
  };

  confirmAddItem = () => {
    const { selectedCounterparty, itemToAdd } = this.state;
    if (selectedCounterparty && itemToAdd) {
      this.handleAddItem(selectedCounterparty.id, itemToAdd);
      this.setState({ showConfirmModal: false });
      this.showToast('Item added successfully!', 'success');
    }
  };

  cancelAddItem = () => {
    this.setState({ showConfirmModal: false });
  };

  showToast = (message, type) => {
    this.setState({
      toastMessage: message,
      showToast: true,
      toastType: type
    });
  };

  renderDetailsTable = (items) => (
    <DataGrid
      dataSource={items}
      keyField="id"
      showBorders={true}
      columnAutoWidth={true}
      editable
      showColumnLines={true}
      showRowLines={true}
      allowColumnResizing={true}
      className="data-grid"
    >
      <Column dataField="cptyType" caption="Type" />
      <Column dataField="name" caption="Name" />
      <Column dataField="segment" caption="Segment" />
      <Column dataField="salesDesk" caption="Sales Desk" />
      <Column dataField="sourceId" caption="Source ID" />
      <Editing mode="row" allowUpdating={true} allowDeleting={true} />
      <Paging defaultPageSize={5} />
    </DataGrid>
  );

  render() {
    const { selectedCounterparty, showModal, toastMessage, showToast, toastType, showDetailsFor, showConfirmModal, customerName } = this.state;

    return (
      <div className="product-container">
        <div className="data-grid-container">
          <DataGrid
            dataSource={this.state.counterparties}
            keyField="id"
            showBorders={true}
            className="data-grid"
          >
            <Column dataField="name" caption="Counterparty Name" />
            <Column dataField="code" caption="Code" />
            <Column dataField="description" caption="Description" />
            <Column
              dataField="details"
              caption="Details"
              cellRender={({ data }) => (
                <div>
                  <button onClick={() => this.setState({ showDetailsFor: data.id })}>
                    Show Details
                  </button>
                </div>
              )}
            />
            <Editing mode="row" allowUpdating={true} allowDeleting={true} />
            <Paging defaultPageSize={5} />
          </DataGrid>

          {/* Details section */}
          {this.state.counterparties.map(counterparty => (
            showDetailsFor === counterparty.id && (
              <div className="details-container" key={counterparty.id}>
                <button className="hide-details-button" onClick={() => this.setState({ showDetailsFor: null })}>
                  Hide Details
                </button>
                <div className="details-table-container">
                  {this.renderDetailsTable(counterparty.items || [])}
                  <button className="add-item-button" onClick={() => this.openModal(counterparty)}>
                    Add Item
                  </button>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Modal for adding details */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Select Type and Add Details</h3>
                <button className="close-modal" onClick={this.closeModal}>✖</button>
              </div>
              <div className="modal-body">
                <div className="select-box-container">
                  <SelectBox
                    dataSource={['PriceBucket', 'Customer']}
                    value={this.state.selectedCptyType}
                    onValueChanged={this.handleCptyTypeChange}
                    placeholder="Select Type"
                  />
                </div>
                {this.state.selectedCptyType === 'PriceBucket' ? (
                  <SelectBox
                    dataSource={this.state.priceBucketsOptions}
                    value={this.state.selectedPriceBucketId}
                    valueExpr={'id'}
                    displayExpr={'displayText'}
                    onValueChanged={this.handlePriceBucketSelect}
                    placeholder="Select Price Bucket"
                  />
                ) : (
                  <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <TextBox
                      className="search-textbox"
                      placeholder="Enter Customer ID"
                      value={this.state.customerIdSearch}
                      onValueChanged={this.handleCustomerSearch}
                    />
                    {customerName && (
                      <div className="customer-name-display">
                        <strong>Customer Name:</strong> {customerName}
                      </div>
                    )}
                  </div>
                )}
                <button className="add-button" onClick={this.handleAddDetails}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal for Adding Item */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Confirm</h3>
                <button className="close-modal" onClick={this.cancelAddItem}>✖</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to add this item?</p>
                <button className="confirm-button" onClick={this.confirmAddItem}>Yes</button>
                <button className="cancel-button" onClick={this.cancelAddItem}>No</button>
              </div>
            </div>
          </div>
        )}

        <Toast
          message={toastMessage}
          visible={showToast}
          onHiding={() => this.setState({ showToast: false })}
          displayTime={3000}
          className={`notification-toast ${toastType}`}
        />
      </div>
    );
  }
}

export default Product;
