import React from "react";
import "./table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";

export default function Table() {
  const data = [
    {
      id: 1,
      productName: "A",
      stock: 99,
      DOH: "XXX",
      status: "Available",
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
      productName: "A",
      stock: 99,
      DOH: "XXX",
      status: "Available",
    },
    {
      id: 3,
      productName: "C",
      stock: 99,
      DOH: "XXX",
      status: "Available",
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
                <td>{item.DOH}</td>
                <td>{item.status}</td>
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
                  <td colSpan={5} className="p-0 border-0">
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
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.variant.map((v) =>
                                v.sub.map((s, idx) => (
                                  <tr key={idx}>
                                    <td>{v.size}</td>
                                    <td>{s.color}</td>
                                    <td>{s.stock}</td>
                                    <td>{s.minStock}</td>
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
