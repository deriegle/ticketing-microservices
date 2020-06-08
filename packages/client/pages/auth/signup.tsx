import { useState, FormEvent, useEffect } from "react";
import { useRequest } from "@ticketing/client/hooks/use-request";

interface RequestData {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, data, errors] = useRequest<RequestData>(
    "https://ticketing.dev/api/users/signup",
    "POST"
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await signup({
      email,
      password,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          type="email"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {!!errors.length && (
        <div className="alert alert-danger">
          <h4>Something went wrong...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};
