import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [headerData, setHeaderData] = useState([]);
  const [fieldData, setFieldData] = useState([]);
  const API_KEY = "";
  const URI = "";
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          URI,
          {
            method: "get",
            mode: "cors",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setFieldData(data.body.records);
        setHeaderData(data.body.fields);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const Row = ({ field, index }) => {
    return (
      <tr
        style={{
          animationDuration: `${0.2 + index * 0.1}s`,
          backgroundColor: index % 2 ? "#F5F5F5" : {},
        }}
        className="tableRow"
        key={field[index]}
      >
        <Cells field={field} />
      </tr>
    );
  };
  const Cells = ({ field }) => {
    return field.map((cell, index) => {
      return (
        <td className="tableCell" key={index}>
          {cell}
        </td>
      );
    });
  };

  return (
    <div className="App">
      <div style={{ overflowY: "auto", overflowX: "hidden" }}>
        <table cellSpacing={0} className="tableTheme">
          <thead>
            <tr>
              <th className="tableHeader" colSpan={4}>
                Ontario - Last 7 Days
              </th>
            </tr>
            <tr>
              {headerData &&
                headerData.map((header) => {
                  return (
                    <th key={header} className="tableHeader">
                      {header}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {fieldData.length ? (
              fieldData.map((field, index) => {
                return <Row key={index} field={field} index={index} />;
              })
            ) : (
              <tr style={{ backgroundColor: "#F5F5F5" }} className="tableRow">
                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                    marginTop: 8,
                  }}
                  colSpan={4}
                >
                  <div className="spinner" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
