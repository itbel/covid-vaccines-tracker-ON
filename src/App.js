import { useEffect, useState } from "react";
import "./App.css";
import Spinner from "./Spinner";

function App() {
  const [headerData, setHeaderData] = useState([]);
  const [fieldData, setFieldData] = useState([]);
  const API_KEY = "zrZ6NnYASR9ta03GcHUs1apcTYbk7fbZ763e6DIp";
  const URI = "https://33qka4mlhl.execute-api.us-east-1.amazonaws.com/prod/covid";
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
        setFieldData(data.body);
        setHeaderData(Object.keys(data.body[0]));
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
    return Object.values(field)?.map((cell, index) => {
      return (
        <td className="tableCell" key={index}>
          {cell}
        </td>
      );
    });
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <h1 className="pageHeader" colSpan={4}>
        Ontario - Vaccinations
      </h1>
      <div>

        <table cellSpacing={0} className="tableTheme">
          <thead>
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
            {fieldData?.length ?
              fieldData.map((field, index) => {
                return <Row key={index} field={field} index={index} />;
              }) : null}
          </tbody>
          <tfoot>
            {fieldData?.length ? <tr><td style={{ fontSize: 10, textAlign: 'center', color: '#808080', paddingTop: 30 }} colSpan={3}>Contains information licensed under the <a href="https://www.ontario.ca/page/open-government-licence-ontario">Open Government Licence – Ontario.</a></td></tr> : null}
          </tfoot>
        </table>
        {fieldData.length ? null : <div className="spinner_container"><Spinner /></div>}
      </div>
    </div>
  )
}
export default App;
