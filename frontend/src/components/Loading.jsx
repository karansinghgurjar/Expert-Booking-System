function Loading({ message = "Loading..." }) {
  return (
    <div className="loading" role="status">
      {message}
    </div>
  );
}

export default Loading;
