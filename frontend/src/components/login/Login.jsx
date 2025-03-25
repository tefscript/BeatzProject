import React from "react";

const Login = () => {
  return (
    <div className="container">
      <form>
        <h1>Acesse o sistema</h1>
        <div>
          <input type="email" placeholder="Email address" />
        </div>
        <div>
          <input type="password" placeholder="Password" />
        </div>
        <button>LOG IN</button>
      </form>
    </div>
  );
};

export default Login;
