export const Error = ({ error }) => {
  return (
    <div className="flex justify-center mb-3">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="block">An error occured!</strong>
        {error.code ? <span className="block">Error; {error.code}</span> : null}
        {error.message ? (
          <span className="block">Message; {error.message}</span>
        ) : null}
      </div>
    </div>
  );
};
