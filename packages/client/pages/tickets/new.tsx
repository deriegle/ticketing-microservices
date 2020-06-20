import { useState } from "react";
import { NextPage } from "next";
import { CurrentUserData } from "../_app";

interface Props {
  currentUser?: CurrentUserData;
}

const NewTicket: NextPage<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create the ticket</h1>
      <form>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            name="price"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            type="number"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
