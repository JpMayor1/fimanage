import React from "react";

const PageNotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red">404</h1>
        <p className="text-2xl font-semibold text-red mt-4">Page Not Found</p>
        <p className="text-lg text-red mt-2">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block hover:underline text-black text-lg font-medium"
        >
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
