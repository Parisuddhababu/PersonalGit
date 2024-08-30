const ChatLoader = ({ isText }: { isText: boolean }) => {
  return (
    <div className="loader-spin white-bg">
      <div className="circle"></div>
      {isText && (
        <div className="loading-text">
          Chat loading
          <span className="dot-one"> .</span>
          <span className="dot-two"> .</span>
          <span className="dot-three"> .</span>
        </div>
      )}
    </div>
  );
};

export default ChatLoader;
