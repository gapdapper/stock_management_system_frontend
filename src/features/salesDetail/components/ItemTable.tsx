import "./ItemTable.scss"

export default function Itemtable({ data }: any) {
  return (
    <div className="item-table-wrapper">
      <table className=" item-table">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Size</th>
            <th scope="col">Color</th>
            <th scope="col">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr>
                <td>{item.name}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td>{item.qty}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
