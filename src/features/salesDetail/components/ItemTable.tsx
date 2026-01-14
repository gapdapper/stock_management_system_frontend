import type { ITransactionItem } from "@/app/types/transaction";
import "./ItemTable.scss"

type Prop = {
  data: ITransactionItem[]
}

export default function ItemTable({ data }: Prop) {
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
          {data && data?.map((item) => {
            return (
              <tr key={item.variantId}>
                <td>{item.productName}</td>
                <td>{item.size}</td>
                <td>{item.color}</td>
                <td>{item.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
