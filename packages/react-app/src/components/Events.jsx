import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
// import { Address } from "../components";
import { lazy, Suspense } from "react";

const Address = lazy(() => import("../components/Address"));

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
*/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
              <Suspense fallback={<div>Loading...</div>}>
                <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              </Suspense>
              {item.args[1]}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
