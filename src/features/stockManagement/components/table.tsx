import React from "react";
import "./table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";

export default function Table() {
  const data = [
    {
      id: 1,
      productName: "Jenga",
      stock: 99,
      DOH: 19,
      status: "In-stock",
      variant: [
        {
          size: "S",
          sub: [
            {
              color: "Red",
              stock: 19,
              minStock: 10,
            },
            {
              color: "Green",
              stock: 11,
              minStock: 10,
            },
            {
              color: "Blue",
              stock: 9,
              minStock: 10,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      productName: "Domino",
      stock: 99,
      DOH: 15,
      status: "In-stock",
    },
    {
      id: 3,
      productName: "Jackpot",
      stock: 99,
      DOH: 2,
      status: "Low-stock",
    },
  ];

  return (
    <div className="table-responsive-xxl">
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Stock</th>
            <th>DOH</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((item) => (
            <React.Fragment key={item.id}>
              {/* normal row */}
              <tr>
                <td>{item.productName}</td>
                <td>{item.stock}</td>
                <td>{item.DOH + " Days"}</td>
                <td><span className={item.status === 'In-stock' ? 'badge rounded-pill text-bg-success' : 'badge rounded-pill text-bg-danger'}>{item.status}</span></td>
                <td>
                  {item.variant && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${item.id}`}
                      aria-expanded="false"
                      aria-controls={`collapse-${item.id}`}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  )}
                </td>
              </tr>

              {/* collapsable row */}
              {item.variant && (
                <tr className="collapse-row">
                  <td colSpan={6} className="p-0 border-0">
                    <div className="collapse" id={`collapse-${item.id}`}>
                      <div className="d-flex">
                        {/* image cell */}
                        <div className="image-cell">
                          <PlaceHolder />
                        </div>

                        {/* sub table */}
                        <div className="flex-grow-1">
                          <table className="table mb-0">
                            <thead>
                              <tr>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Stock</th>
                                <th>Min Stock</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody className="table-group-divider">
                              {item.variant.map((v) =>
                                v.sub.map((s, idx) => (
                                  <tr key={idx}>
                                    <td>{idx == 0 ? v.size : ""}</td>
                                    <td>{s.color}</td>
                                    <td>{s.stock}</td>
                                    <td>{s.minStock}</td>
                                    <td><span className={s.stock >= s.minStock ? 'badge rounded-pill text-bg-success' : 'badge rounded-pill text-bg-danger'}>{item.status}</span></td>
                                    <td><button><FontAwesomeIcon icon={faEllipsis} /></button></td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
