import React, { useState, useRef } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import SelectBox from 'devextreme-react/select-box';
import Toast from 'devextreme-react/toast';
import 'devextreme/dist/css/dx.light.css';
import './product.css';

const priceBucketsOptions = [
  { id: 1, displayText: 'Bucket 1', segment: 'Segment 1', salesDesk: 'Sales Desk 1' },
  { id: 2, displayText: 'Bucket 2', segment: 'Segment 2', salesDesk: 'Sales Desk 2' },
];

const allCustomers = [
  { id: 1, name: 'Customer 1', segment: 'Segment 1', salesDesk: 'Sales Desk 1' },
  { id: 2, name: 'Customer 2', segment: 'Segment 2', salesDesk: 'Sales Desk 2' },
  { id: 3, name: 'Customer 3', segment: 'Segment 3', salesDesk: 'Sales Desk 3' },
  // Diğer müşteriler...
];

const options = [
  { value: 'customer', text: 'Customer' },
  { value: 'priceBucket', text: 'Price Bucket' },
];

function Product() {
  const [counterparties, setCounterparties] = useState([
    { id: 1, name: 'Counterparty 1', code: 'Code_1', description: 'Description 1', items: [] },
    { id: 2, name: 'Counterparty 2', code: 'Code_2', description: 'Description 2', items: [] },
    { id: 3, name: 'Counterparty 3', code: 'Code_3', description: 'Description 3', items: [] }
  ]);
  const [selectedCounterparty, setSelectedCounterparty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCptyType, setSelectedCptyType] = useState('priceBucket');
  const [selectedPriceBuckets, setSelectedPriceBuckets] = useState([]);
  const [selectedTempCustomers, setSelectedTempCustomers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemsToAdd, setItemsToAdd] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState('');
  const [showDetailsFor, setShowDetailsFor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [temporaryCustomerList, setTemporaryCustomerList] = useState([]);

  const gridRef = useRef(null);

  // Arama fonksiyonu
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const results = allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setTemporaryCustomerList(results);
    } else {
      setTemporaryCustomerList([]);
    }
  };

  const handleAddItem = (counterpartyId, item) => {
    setCounterparties(prevState =>
      prevState.map(counterparty =>
        counterparty.id === counterpartyId
          ? { ...counterparty, items: [...counterparty.items, item] }
          : counterparty
      )
    );
  };

  const handleDeleteItem = (counterpartyId, itemId) => {
    setCounterparties(prevState =>
      prevState.map(counterparty =>
        counterparty.id === counterpartyId
          ? { ...counterparty, items: counterparty.items.filter(item => item.id !== itemId) }
          : counterparty
      )
    );
  };

  const handleAddDetails = () => {
    if (!selectedCounterparty) return;

    const items = selectedCptyType === 'priceBucket'
      ? selectedPriceBuckets.map(bucket => ({
          id: Date.now(),
          cptyType: 'PriceBucket',
          name: bucket.displayText,
          segment: bucket.segment,
          salesDesk: bucket.salesDesk,
          sourceId: bucket.id,
        }))
      : selectedTempCustomers.map(customer => ({
          id: Date.now(),
          cptyType: 'Customer',
          name: customer.name,
          segment: customer.segment,
          salesDesk: customer.salesDesk,
          sourceId: customer.id,
        }));

    setItemsToAdd(items);
    setShowConfirmModal(true);
  };

  const openModal = (counterparty) => {
    setSelectedCounterparty(counterparty);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCounterparty(null);
    setSelectedCptyType('priceBucket');
    setSelectedPriceBuckets([]);
    setSelectedTempCustomers([]);
    setSearchValue('');
    setTemporaryCustomerList([]);
  };

  const handleCptyTypeChange = (e) => {
    setSelectedCptyType(e.value);
    setSearchValue('');
    setTemporaryCustomerList([]);
    setSelectedTempCustomers([]);
  };

  const handleCustomerSelection = (e) => {
    setSelectedTempCustomers(e.selectedRowsData);
  };

  const confirmAddItem = () => {
    if (selectedCounterparty && itemsToAdd.length > 0) {
      itemsToAdd.forEach(item => handleAddItem(selectedCounterparty.id, item));
      setShowConfirmModal(false);
      showToast('Items added successfully!', 'success');
    }
  };

  const cancelAddItem = () => {
    setShowConfirmModal(false);
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
  };

  const renderDetailsTable = (items) => (
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

  const dropDownGrid = () => (
    <DataGrid
      dataSource={selectedCptyType === 'priceBucket' ? priceBucketsOptions : temporaryCustomerList}
      keyField="id"
      columnAutoWidth={true}
      showBorders={true}
      selection={{ mode: 'multiple' }}
      ref={gridRef}
      onSelectionChanged={handleCustomerSelection}
    >
      <Column dataField={selectedCptyType === 'priceBucket' ? 'displayText' : 'name'} caption="Name" />
      {selectedCptyType === 'priceBucket' && (
        <>
          <Column dataField="segment" caption="Segment" />
          <Column dataField="salesDesk" caption="Sales Desk" />
        </>
      )}
      {selectedCptyType === 'customer' && (
        <>
          <Column dataField="segment" caption="Segment" />
          <Column dataField="salesDesk" caption="Sales Desk" />
        </>
      )}
    </DataGrid>
  );

  const selectedItemsText = () => {
    const items = selectedCptyType === 'priceBucket'
      ? selectedPriceBuckets
      : selectedTempCustomers;

    return items.map(item => item.displayText || item.name).join(', ');
  };

  return (
    <div className="product-container">
      <div className="data-grid-container">
        <DataGrid
          dataSource={counterparties}
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
                <button onClick={() => setShowDetailsFor(data.id)}>
                  Show Details
                </button>
              </div>
            )}
          />
          <Editing mode="row" allowUpdating={true} allowDeleting={true} />
          <Paging defaultPageSize={5} />
        </DataGrid>

        {counterparties.map(counterparty => (
          showDetailsFor === counterparty.id && (
            <div className="details-container" key={counterparty.id}>
              <button className="hide-details-button" onClick={() => setShowDetailsFor(null)}>
                Hide Details
              </button>
              <div className="details-table-container">
                {renderDetailsTable(counterparty.items || [])}
                <button className="add-details-button" onClick={() => openModal(counterparty)}>
                  Add Details
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Details to {selectedCounterparty.name}</h2>
            <SelectBox
              dataSource={options}
              value={selectedCptyType}
              onValueChanged={handleCptyTypeChange}
              displayExpr="text"
              valueExpr="value"
            />
            {selectedCptyType === 'customer' && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search Customers..."
                  value={searchValue}
                  onChange={handleSearch}
                />
              </div>
            )}
            <DropDownBox
              dataSource={selectedCptyType === 'priceBucket' ? priceBucketsOptions : temporaryCustomerList}
              value={selectedCptyType === 'priceBucket' ? selectedPriceBuckets : selectedTempCustomers}
              displayExpr={selectedCptyType === 'priceBucket' ? 'displayText' : 'name'}
              valueExpr="id" // Ensure valueExpr is correctly set for selections
              contentRender={dropDownGrid}
            >
              {dropDownGrid()}
            </DropDownBox>
            <p>Selected Items: {selectedItemsText()}</p>
            <div className="modal-actions">
              <button onClick={handleAddDetails}>Add</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content">
            <h2>Confirm Adding Items</h2>
            <p>Are you sure you want to add these items?</p>
            <p>Selected Items: {selectedItemsText()}</p>
            <button onClick={confirmAddItem}>Confirm</button>
            <button onClick={cancelAddItem}>Cancel</button>
          </div>
        </div>
      )}

      <Toast
        message={toastMessage}
        visible={isToastVisible}
        type={toastType}
        onHiding={() => setIsToastVisible(false)}
        displayTime={3000}
        position={{ at: 'top center', my: 'top center' }}
      />
    </div>
  );
}

export default Product;
