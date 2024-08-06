import React, { Component } from 'react';
import { Form, Item, GroupItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import { FaSun, FaMoon } from 'react-icons/fa'; // İkonları import et
import './settings.css'; // CSS dosyasını import et

const themes = [
  { value: 'light', text: 'Light' },
  { value: 'dark', text: 'Dark' },
];

class settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTheme: 'light', // Varsayılan tema
    };

    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.applySettings = this.applySettings.bind(this);
  }

  handleThemeChange(e) {
    this.setState({ selectedTheme: e.value });
  }

  applySettings() {
    const { selectedTheme } = this.state;
    document.body.className = selectedTheme; // Temayı uygulama
    localStorage.setItem('theme', selectedTheme); // Temayı tarayıcıda saklama
  }

  componentDidMount() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setState({ selectedTheme: savedTheme });
      document.body.className = savedTheme;
    }
  }

  render() {
    const { selectedTheme } = this.state;
    return (
      <div className="settings-container">
        <h2>Settings</h2>
        <Form>
          <GroupItem colCount={1} className="theme-row">
            <Item>
              <div className="theme-row-content">
                <span className="theme-label">Theme</span>
                <div className="theme-selector">
                  <SelectBox
                    items={themes}
                    value={selectedTheme}
                    displayExpr="text"
                    valueExpr="value"
                    onValueChanged={this.handleThemeChange}
                  />
                  <div className="theme-icon">
                    {selectedTheme === 'dark' ? <FaMoon /> : <FaSun />}
                  </div>
                </div>
              </div>
            </Item>
          </GroupItem>
          <div className="settings-buttons">
            <Button
              text="Apply"
              type="success"
              onClick={this.applySettings}
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default settings;
