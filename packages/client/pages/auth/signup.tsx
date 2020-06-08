import { useState, FormEvent } from "react";
import { ErrorMessage } from "@ticketing/auth/src/middleware/error-handler";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("https://ticketing.dev/api/users/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((res) => res.json());

      console.log(response);
    } catch (err) {
      console.log({
        err,
      });
    }
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
