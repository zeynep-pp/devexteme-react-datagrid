import React, { Component } from 'react';
import DataGrid, { Column, Paging, Pager, Toolbar, Item } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import NumberBox from 'devextreme-react/number-box';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      pageSize: 5,
      dataSource: [
        { id: 1, name: 'John Doe', age: 28 },
        { id: 2, name: 'Jane Smith', age: 34 },
        { id: 3, name: 'Sam Johnson', age: 23 },
        { id: 4, name: 'Anna Brown', age: 41 },
        { id: 5, name: 'Michael White', age: 39 },
        { id: 6, name: 'Emily Davis', age: 30 },
        { id: 7, name: 'Chris Wilson', age: 27 },
        { id: 8, name: 'Sarah Lee', age: 22 },
        { id: 9, name: 'David Taylor', age: 45 },
        { id: 10, name: 'Laura Miller', age: 33 }
      ]
    };
  }

  handlePageIndexChange = (e) => {
    this.setState({ currentPageIndex: e.pageIndex });
  };

  handlePageNumberChange = (value) => {
    const newPageIndex = value - 1; // dxNumberBox is 1-based, DataGrid is 0-based
    this.setState((prevState) => {
      const totalPages = Math.ceil(prevState.dataSource.length / prevState.pageSize);
      // Ensure the new page index is within the valid range
      if (newPageIndex >= 0 && newPageIndex < totalPages) {
        return { currentPageIndex: newPageIndex };
      }
      return null;
    });
  };

  render() {
    const totalPages = Math.ceil(this.state.dataSource.length / this.state.pageSize);

    return (
      <DataGrid
        dataSource={this.state.dataSource}
        pageIndex={this.state.currentPageIndex}
        pageSize={this.state.pageSize}
        onPageIndexChange={this.handlePageIndexChange}
      >
        <Column dataField="id" />
        <Column dataField="name" />
        <Column dataField="age" />
        
        <Paging enabled={true} />
        <Pager
          visible={true}
          allowedPageSizes={[5, 10, 15]}
          showPageSizeSelector={true}
          showInfo={true}
        />
        
        <Toolbar>
          <Item
            location="after"
            widget="dxButton"
            options={{
              icon: 'chevronleft',
              onClick: () => {
                if (this.state.currentPageIndex > 0) {
                  this.setState((prevState) => ({
                    currentPageIndex: prevState.currentPageIndex - 1
                  }));
                }
              }
            }}
          />
          <Item
            location="after"
            widget="dxNumberBox"
            options={{
              value: this.state.currentPageIndex + 1,
              min: 1,
              showSpinButtons: true,
              onValueChanged: (e) => this.handlePageNumberChange(e.value),
              width: 80
            }}
          />
          <Item
            location="after"
            widget="dxButton"
            options={{
              icon: 'chevronright',
              onClick: () => {
                const totalPages = Math.ceil(this.state.dataSource.length / this.state.pageSize);
                if (this.state.currentPageIndex < totalPages - 1) {
                  this.setState((prevState) => ({
                    currentPageIndex: prevState.currentPageIndex + 1
                  }));
                }
              }
            }}
          />
        </Toolbar>
      </DataGrid>
    );
  }
}

export default Product;
