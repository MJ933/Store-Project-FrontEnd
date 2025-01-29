import React, { useEffect } from "react";

function TestErrorComponent() {
  //   useEffect(async () => {
  //     throw new Error("Intentional test error from TestErrorComponent");
  //   }, []);

  //   return <div>Testing Error Boundary Route</div>;
  throw json(
    { message: "Test Loader Error: Resource not found" },
    { status: 404 }
  );
}

export default TestErrorComponent;
