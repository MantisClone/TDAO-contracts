import { Button, Dropdown, Menu } from "antd";
import React from "react";

function NetworkSwitch({ networkOptions, selectedNetwork, setSelectedNetwork }) {
  const menu = (
    <Menu>
      {networkOptions
        .filter(i => i !== selectedNetwork)
        .map(i => (
          <Menu.Item key={i}>
            <Button type="text" onClick={() => setSelectedNetwork(i)}>
              <span style={{ textTransform: "capitalize" }}>{i}</span>
            </Button>
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown.Button overlay={menu} placement="bottomRight" trigger={["click"]}>
        <span style={{ textTransform: "capitalize" }}>{selectedNetwork}</span>
      </Dropdown.Button>
    </div>
  );
}

export default NetworkSwitch;
